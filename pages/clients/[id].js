import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/topbar";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";
import jsPDF from "jspdf";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Footer from "../components/footer"; // adjust path accordingly


export default function ClientDetailsPage() {
  const router = useRouter();
  const { id } = router.query;

  const [client, setClient] = useState(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [projectData, setProjectData] = useState({
    title: "",
    price: "",
    paymentDue: "",
    progress: ""
  });

  // ✅ Auth protection
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, []);

  // ✅ Fetch client
  useEffect(() => {
    if (id) {
      const fetchClient = async () => {
        const docRef = doc(db, "clients", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setClient({ id: docSnap.id, ...docSnap.data() });
        }
      };
      fetchClient();
    }
  }, [id]);

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    try {
      const docRef = doc(db, "clients", id);
      await updateDoc(docRef, {
        project: projectData
      });
      setClient((prev) => ({
        ...prev,
        project: projectData
      }));
      setShowProjectModal(false);
    } catch (err) {
      console.error("Error updating project:", err);
    }
  };

  const handleGenerateInvoice = () => {
    const docPDF = new jsPDF();

    docPDF.setFontSize(18);
    docPDF.text("Client Connect - Project Invoice", 20, 20);

    docPDF.setFontSize(12);
    docPDF.text(`Client Name: ${client.name}`, 20, 40);
    docPDF.text(`Email: ${client.email}`, 20, 50);
    docPDF.text(`Project Title: ${client.project.title}`, 20, 60);
    docPDF.text(`Price: ₹${client.project.price}`, 20, 70);
    docPDF.text(`Payment Due: ${client.project.paymentDue}`, 20, 80);
    docPDF.text(`Progress: ${client.project.progress}%`, 20, 90);

    docPDF.text("Thank you for working with us!", 20, 110);

    docPDF.save(`Invoice_${client.name}.pdf`);
  };

  if (!client) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading client details...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-4">
        <Topbar />
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-blue-600 mb-2">{client.name}</h2>
          <p className="text-gray-600 mb-1">Company: {client.company}</p>
          <p className="text-gray-600 mb-1">Email: {client.email}</p>
          <p className="text-gray-600 mb-1">Phone: {client.phone}</p>

          {/* ✅ Show Project Info if exists */}
          {client.project && (
            <div className="mt-6 border-t pt-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Project Details</h3>
              <p className="text-gray-700">📌 <strong>Title:</strong> {client.project.title}</p>
              <p className="text-gray-700">💰 <strong>Price:</strong> ₹{client.project.price}</p>
              <p className="text-gray-700">📅 <strong>Payment Due:</strong> {client.project.paymentDue}</p>
              <p className="text-gray-700">📈 <strong>Progress:</strong> {client.project.progress}%</p>

              {/* ✅ Allow download only if progress is 100 */}
              {parseInt(client.project.progress) === 100 ? (
                <button
                  className="mt-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                  onClick={handleGenerateInvoice}
                >
                  Generate Invoice PDF
                </button>
              ) : (
                <p className="mt-4 text-red-600">Invoice can be downloaded only after 100% completion.</p>
              )}
            </div>
          )}

          {/* ✅ If no project info */}
          {!client.project ? (
  <button
    className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
    onClick={() => {
      setProjectData({ title: "", price: "", paymentDue: "", progress: "" });
      setShowProjectModal(true);
    }}
  >
    Add Project Details
  </button>
) : (
  <button
    className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
    onClick={() => {
      // Prefill the modal with current project data
      setProjectData(client.project);
      setShowProjectModal(true);
    }}
  >
    Edit Project Details
  </button>
)}
 {client.project && (
      <div className="bg-white mt-6 p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold text-blue-700 mb-4">Project Progress</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={[
                { name: 'Completed', value: parseInt(client.project.progress) },
                { name: 'Remaining', value: 100 - parseInt(client.project.progress) }
              ]}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              fill="#8884d8"
              label
            >
              <Cell fill="#4ade80" /> {/* Green */}
              <Cell fill="#f87171" /> {/* Red */}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    )}

        </div>

        {/* ✅ Modal for Project Input */}
        {showProjectModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl shadow w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Add Project Details</h2>
              <form onSubmit={handleProjectSubmit} className="space-y-3">
                <input
                  type="text"
                  placeholder="Project Title"
                  className="w-full p-2 border rounded"
                  value={projectData.title}
                  onChange={(e) => setProjectData({ ...projectData, title: e.target.value })}
                  required
                />
                <input
                  type="number"
                  placeholder="Price (₹)"
                  className="w-full p-2 border rounded"
                  value={projectData.price}
                  onChange={(e) => setProjectData({ ...projectData, price: e.target.value })}
                  required
                />
                <input
                  type="date"
                  className="w-full p-2 border rounded"
                  value={projectData.paymentDue}
                  onChange={(e) => setProjectData({ ...projectData, paymentDue: e.target.value })}
                  required
                />
                <input
                  type="number"
                  placeholder="Progress %"
                  className="w-full p-2 border rounded"
                  value={projectData.progress}
                  onChange={(e) => setProjectData({ ...projectData, progress: e.target.value })}
                  required
                />
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setShowProjectModal(false)}
                    className="text-gray-500 hover:text-black"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    {/* Move Project Progress Chart inside main return */}
    </div>
  );
}
<Footer />
