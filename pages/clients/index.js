import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/topbar";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { saveAs } from "file-saver";

export default function ClientSummaryPage() {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const fetchClients = async () => {
      const snapshot = await getDocs(collection(db, "clients"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setClients(data);
    };
    fetchClients();
  }, []);

  const handleDownloadInvoice = (client) => {
    const blob = new Blob(
      [
        `Invoice for ${client.name}\nProject: ${client.project?.title}\nAmount: ₹${client.project?.price}`,
      ],
      { type: "text/plain;charset=utf-8" }
    );
    saveAs(blob, `${client.name}_invoice.txt`);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-4">
        <Topbar />
        <h2 className="text-2xl font-bold mb-4 text-blue-700">Client Summary</h2>

        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100 text-left text-sm uppercase text-gray-600">
              <tr>
                <th className="p-3">Client</th>
                <th className="p-3">Project Title</th>
                <th className="p-3">Price</th>
                <th className="p-3">Due Date</th>
                <th className="p-3">Progress</th>
                <th className="p-3">Invoice</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id} className="border-b hover:bg-gray-50 text-sm">
                  <td className="p-3 font-medium">{client.name}</td>
                  <td className="p-3">
                    {client.project?.title || <span className="text-gray-400">—</span>}
                  </td>
                  <td className="p-3">
                    {client.project?.price
                      ? `₹${client.project.price}`
                      : <span className="text-gray-400">—</span>}
                  </td>
                  <td className="p-3">
                    {client.project?.paymentDue || <span className="text-gray-400">—</span>}
                  </td>
                  <td className="p-3 w-40">
                    {client.project?.progress ? (
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-green-500 h-3 rounded-full"
                          style={{ width: `${client.project.progress}%` }}
                        />
                      </div>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="p-3">
                    {client.project?.progress === "100" ? (
                      <button
                        onClick={() => handleDownloadInvoice(client)}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Download
                      </button>
                    ) : (
                      <span className="text-gray-400">Not Ready</span>
                    )}
                  </td>
                </tr>
              ))}
              {clients.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center p-4 text-gray-500">
                    No clients found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
