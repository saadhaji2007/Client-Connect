// pages/dashboard.js - Clean version focused on operations
import { useEffect, useState } from "react";
import ClientCard from "../components/ClientCard";
import ClientModal from "../components/ClientModal";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import Layout from "../components/layout";
import { Users, TrendingUp, BarChart3, Brain } from 'lucide-react';
import Link from 'next/link';
import mlService from "../utils/mlPredictionservice"

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
  const [dashboardStats, setDashboardStats] = useState({});
  const [quickMLInsights, setQuickMLInsights] = useState(null);
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
        calculateDashboardStats(data);
        generateQuickMLInsights(data);
      } catch (err) {
        console.error("Error fetching clients:", err);
      }
    };

    fetchClients();
  }, [user]);

  // Calculate dashboard statistics
  const calculateDashboardStats = (clientsData) => {
    const totalClients = clientsData.length;
    const activeProjects = clientsData.filter(c => c.project && c.status === 'Active').length;
    const completedProjects = clientsData.filter(c => c.project?.progress === "100").length;
    const totalRevenue = clientsData
      .filter(c => c.project?.price)
      .reduce((sum, c) => sum + parseFloat(c.project.price || 0), 0);
    
    const avgProgress = activeProjects > 0 ? 
      clientsData
        .filter(c => c.project && c.status === 'Active')
        .reduce((sum, c) => sum + parseFloat(c.project.progress || 0), 0) / activeProjects 
      : 0;

    setDashboardStats({
      totalClients,
      activeProjects,
      completedProjects,
      totalRevenue,
      avgProgress: Math.round(avgProgress)
    });
  };

  // Generate quick ML insights for dashboard
  const generateQuickMLInsights = async (clientsData) => {
    try {
      const activeProjects = clientsData.filter(c => c.project && c.status === 'Active');
      if (activeProjects.length === 0) {
        setQuickMLInsights(null);
        return;
      }

      // Get quick predictions for active projects
      const predictions = await Promise.all(
        activeProjects.slice(0, 3).map(async (client) => {
          const prediction = await mlService.predictProjectSuccess(client.project);
          return {
            clientName: client.name,
            successRate: prediction.successProbability
          };
        })
      );

      const avgSuccessRate = Math.round(
        predictions.reduce((sum, p) => sum + p.successRate, 0) / predictions.length
      );

      const highRiskCount = predictions.filter(p => p.successRate < 60).length;

      setQuickMLInsights({
        avgSuccessRate,
        highRiskCount,
        totalAnalyzed: activeProjects.length,
        predictions: predictions.slice(0, 2) // Show top 2
      });

    } catch (error) {
      console.error('Error generating quick ML insights:', error);
      setQuickMLInsights(null);
    }
  };

  // ➕ Add client with user ID
  const handleAddClient = async (clientData) => {
    try {
      const docRef = await addDoc(collection(db, "clients"), {
        ...clientData,
        userId: user.uid,
      });
      const newClients = [...clients, { id: docRef.id, ...clientData, userId: user.uid }];
      setClients(newClients);
      calculateDashboardStats(newClients);
      generateQuickMLInsights(newClients);
    } catch (err) {
      console.error("Error adding client:", err);
    }
  };

  // ✏️ Edit client
  const handleUpdateClient = async (updatedData) => {
    try {
      const docRef = doc(db, "clients", updatedData.id);
      await updateDoc(docRef, updatedData);
      const newClients = clients.map((client) =>
        client.id === updatedData.id ? updatedData : client
      );
      setClients(newClients);
      calculateDashboardStats(newClients);
      generateQuickMLInsights(newClients);
    } catch (err) {
      console.error("Error updating client:", err);
    }
  };

  // 🗑️ Delete
  const handleDeleteClient = async (id) => {
    try {
      await deleteDoc(doc(db, "clients", id));
      const newClients = clients.filter((client) => client.id !== id);
      setClients(newClients);
      calculateDashboardStats(newClients);
      generateQuickMLInsights(newClients);
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

  // Filter clients based on search and status
  const filteredClients = clients
    .filter((client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((client) =>
      statusFilter === "All" ? true : client.status === statusFilter
    );

  return (
    <Layout>
      {/* Dashboard Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title="Total Clients" 
          value={dashboardStats.totalClients || 0} 
          icon={<Users size={24} />}
          color="bg-blue-500" 
        />
        <StatCard 
          title="Active Projects" 
          value={dashboardStats.activeProjects || 0} 
          icon={<TrendingUp size={24} />}
          color="bg-green-500" 
        />
        <StatCard 
          title="Completed Projects" 
          value={dashboardStats.completedProjects || 0} 
          icon={<BarChart3 size={24} />}
          color="bg-purple-500" 
        />
        <StatCard 
          title="Total Revenue" 
          value={`₹${(dashboardStats.totalRevenue || 0).toLocaleString()}`} 
          icon={<TrendingUp size={24} />}
          color="bg-orange-500" 
        />
      </div>

      {/* Quick ML Insights Banner */}
      {quickMLInsights && (
        <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl shadow-lg p-4 mb-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Brain className="mr-3" size={24} />
              <div>
                <h3 className="font-semibold">AI Project Health</h3>
                <p className="text-sm opacity-90">
                  Avg Success Rate: <span className="font-bold">{quickMLInsights.avgSuccessRate}%</span>
                  {quickMLInsights.highRiskCount > 0 && (
                    <span className="ml-3 bg-red-500 bg-opacity-30 px-2 py-1 rounded text-xs">
                      {quickMLInsights.highRiskCount} High Risk
                    </span>
                  )}
                </p>
              </div>
            </div>
            <Link href="/stats">
              <button className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg text-sm font-medium transition-all">
                View Full Analysis →
              </button>
            </Link>
          </div>

          {/* Quick predictions preview */}
          {quickMLInsights.predictions && quickMLInsights.predictions.length > 0 && (
            <div className="mt-3 pt-3 border-t border-white border-opacity-20">
              <div className="flex space-x-4 text-xs">
                {quickMLInsights.predictions.map((pred, index) => (
                  <div key={index} className="flex items-center">
                    <span className="opacity-80">{pred.clientName}:</span>
                    <span className={`ml-1 font-bold ${
                      pred.successRate >= 80 ? 'text-green-300' : 
                      pred.successRate >= 60 ? 'text-yellow-300' : 'text-red-300'
                    }`}>
                      {pred.successRate}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

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
        {filteredClients.map((client) => (
          <ClientCard
            key={client.id}
            client={client}
            onDelete={handleDeleteClient}
            onEdit={handleEditClick}
          />
        ))}
      </div>

      {filteredClients.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No clients found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by adding a new client.
          </p>
        </div>
      )}

      {/* 🧩 Modal */}
      <ClientModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={modalMode === "edit" ? handleUpdateClient : handleAddClient}
        mode={modalMode}
        initialData={currentClient}
      />
    </Layout>
  );
}

// Stats Card Component
function StatCard({ title, value, icon, color }) {
  return (
    <div className={`${color} rounded-xl shadow-lg p-4 text-white`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-90">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className="opacity-80">{icon}</div>
      </div>
    </div>
  );
}