import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/topbar";

export default function StatPage() {
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

  const totalClients = clients.length;
  const clientsWithProject = clients.filter((c) => c.project).length;
  const totalRevenue = clients
    .filter((c) => c.project)
    .reduce((sum, c) => sum + parseFloat(c.project.price || 0), 0);
  const avgProgress =
    clientsWithProject === 0
      ? 0
      : clients
          .filter((c) => c.project)
          .reduce((sum, c) => sum + parseFloat(c.project.progress || 0), 0) /
        clientsWithProject;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-4">
        <Topbar />
        <h1 className="text-2xl font-bold mb-4">📊 Client Statistics</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard label="Total Clients" value={totalClients} color="blue" />
          <StatCard label="With Projects" value={clientsWithProject} color="green" />
          <StatCard label="Total Revenue (₹)" value={totalRevenue} color="purple" />
          <StatCard label="Avg Progress (%)" value={avgProgress.toFixed(1)} color="orange" />
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }) {
  const colors = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    purple: "bg-purple-500",
    orange: "bg-orange-500",
  };

  return (
    <div className={`p-6 rounded-xl shadow text-white ${colors[color]}`}>
      <h3 className="text-sm font-medium mb-1">{label}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
