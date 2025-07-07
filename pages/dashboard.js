import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/topbar";
import ClientCard from "./components/ClientCard";
import ClientModal from "./components/ClientModal";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";

export default function Dashboard() {
  const [clients, setClients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [currentClient, setCurrentClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [user, setUser] = useState(null);
  const router = useRouter();

  // 🔐 Protect route & get user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/login");
      } else {
        setUser(currentUser);
      }
    });

    return () => unsubscribe();
  }, []);

  // 🔁 Fetch only current user's clients
  useEffect(() => {
    const fetchClients = async () => {
      try {
        if (!user) return;

        const q = query(collection(db, "clients"), where("userId", "==", user.uid));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setClients(data);
      } catch (err) {
        console.error("Error fetching clients:", err);
      }
    };

    fetchClients();
  }, [user]);

  // ➕ Add client with user ID
  const handleAddClient = async (clientData) => {
    try {
      const docRef = await addDoc(collection(db, "clients"), {
        ...clientData,
        userId: user.uid,
      });
      setClients((prev) => [...prev, { id: docRef.id, ...clientData, userId: user.uid }]);
    } catch (err) {
      console.error("Error adding client:", err);
    }
  };

  // ✏️ Edit client
  const handleUpdateClient = async (updatedData) => {
    try {
      const docRef = doc(db, "clients", updatedData.id);
      await updateDoc(docRef, updatedData);
      setClients((prev) =>
        prev.map((client) =>
          client.id === updatedData.id ? updatedData : client
        )
      );
    } catch (err) {
      console.error("Error updating client:", err);
    }
  };

  // 🗑️ Delete
  const handleDeleteClient = async (id) => {
    try {
      await deleteDoc(doc(db, "clients", id));
      setClients((prev) => prev.filter((client) => client.id !== id));
    } catch (err) {
      console.error("Error deleting client:", err);
    }
  };

  // ✏️ Edit modal
  const handleEditClick = (client) => {
    setCurrentClient(client);
    setModalMode("edit");
    setShowModal(true);
  };

  if (!user) return <div className="p-8 text-center">🔒 Loading...</div>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-4">
        <Topbar />

        {/* 🔎 Search & Filter */}
        <div className="flex flex-col md:flex-row gap-2 justify-between mb-4">
          <input
            type="text"
            placeholder="Search by name..."
            className="p-2 border rounded w-full md:w-1/2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="p-2 border rounded w-full md:w-1/4"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="In Discussion">In Discussion</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* ➕ Add Client Button */}
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

        {/* 📦 Client Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients
            .filter((client) =>
              client.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .filter((client) =>
              statusFilter === "All" ? true : client.status === statusFilter
            )
            .map((client) => (
              <ClientCard
                key={client.id}
                client={client}
                onDelete={handleDeleteClient}
                onEdit={handleEditClick}
              />
            ))}
        </div>

        {/* 🧩 Modal */}
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
