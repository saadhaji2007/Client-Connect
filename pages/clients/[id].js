import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/topbar";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";

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

  // Fetch client
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
          <p className="text-gray-600 mb-1">Status: {client.status}</p>

          {/* Project Info Section */}
          {client.project ? (
            <div className="mt-4 border-t pt-4">
              <h3 className="text-lg font-semibold text-gray-700">Project Details</h3>
              <p><strong>Title:</strong> {client.project.title}</p>
              <p><strong>Price:</strong> ₹{client.project.price}</p>
              <p><strong>Payment Due:</strong> {client.project.paymentDue}</p>
              <p><strong>Progress:</strong> {client.project.progress}%</p>
            </div>
          ) : (
            <div className="mt-4">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={() => setShowProjectModal(true)}
              >
                + Add Project Info
              </button>
            </div>
          )}
        </div>

        {/* Modal to Add Project Info */}
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
    </div>
  );
}
