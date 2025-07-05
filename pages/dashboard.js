import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/topbar";
import ClientCard from "./components/ClientCard";
import ClientModal from "./components/ClientModal";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from "firebase/firestore";

export default function Dashboard() {
  const [clients, setClients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
  const [currentClient, setCurrentClient] = useState(null);

  // 🔁 Fetch on load
  useEffect(() => {
    const fetchClients = async () => {
      const snapshot = await getDocs(collection(db, "clients"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setClients(data);
    };
    fetchClients();
  }, []);

  // ➕ Add new
  const handleAddClient = async (clientData) => {
    try {
      const docRef = await addDoc(collection(db, "clients"), clientData);
      setClients((prev) => [...prev, { id: docRef.id, ...clientData }]);
    } catch (error) {
      console.error("Add error:", error);
    }
  };

  // 📝 Edit existing
  const handleUpdateClient = async (updatedData) => {
    try {
      const docRef = doc(db, "clients", updatedData.id);
      await updateDoc(docRef, updatedData);

      // Update UI
      setClients((prev) =>
        prev.map((client) =>
          client.id === updatedData.id ? updatedData : client
        )
      );
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  // 🗑️ Delete
  const handleDeleteClient = async (id) => {
    try {
      await deleteDoc(doc(db, "clients", id));
      setClients((prev) => prev.filter((client) => client.id !== id));
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  // 👇 open modal in edit mode
  const handleEditClick = (client) => {
    setCurrentClient(client);
    setModalMode("edit");
    setShowModal(true);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-4">
        <Topbar />

        {/* ➕ Add button */}
        <div className="flex justify-end mb-4">
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow"
            onClick={() => {
              setModalMode("add");
              setCurrentClient(null);
              setShowModal(true);
            }}
          >
            + Add Client
          </button>
        </div>

        {/* 📦 Client cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              onDelete={handleDeleteClient}
              onEdit={handleEditClick}
            />
          ))}
        </div>

        {/* 🔁 Modal for Add/Edit */}
        <ClientModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSave={modalMode === "edit" ? handleUpdateClient : handleAddClient}
          mode={modalMode}
          initialData={currentClient}
        />
      </div>
    </div>
  );
}
