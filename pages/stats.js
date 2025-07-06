import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/topbar";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#34D399", "#60A5FA", "#FBBF24", "#F87171"];

export default function StatsPage() {
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

  const total = clients.length;
  const inDiscussion = clients.filter((c) => c.status === "In Discussion").length;
  const active = clients.filter((c) => c.status === "Active").length;
  const completed = clients.filter((c) => c.status === "Completed").length;

  const pieData = [
    { name: "In Discussion", value: inDiscussion },
    { name: "Active", value: active },
    { name: "Completed", value: completed },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-4">
        <Topbar />

        {/* 📊 Counts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow text-center">
            <h2 className="text-2xl font-bold">{total}</h2>
            <p className="text-gray-500">Total Clients</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow text-center">
            <h2 className="text-2xl font-bold">{active}</h2>
            <p className="text-gray-500">Active Clients</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow text-center">
            <h2 className="text-2xl font-bold">{completed}</h2>
            <p className="text-gray-500">Completed Projects</p>
          </div>
        </div>

        {/* 📈 Graph */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Client Status Breakdown</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
