// pages/stats.js - Enhanced with full ML features
import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import Layout from "../components/layout";
import MLInsights from "../components/mlInsights"
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import { Brain, BarChart3, TrendingUp, Users, DollarSign, AlertTriangle } from 'lucide-react';

export default function StatPage() {
  const [clients, setClients] = useState([]);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [dashboardStats, setDashboardStats] = useState({});
  const router = useRouter();

  // 🔒 Protect Route
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

  // 🔁 Fetch only user's own clients
  useEffect(() => {
    const fetchClients = async () => {
      if (!user) return;

      const q = query(collection(db, "clients"), where("userId", "==", user.uid));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setClients(data);
      calculateStats(data);
    };

    fetchClients();
  }, [user]);

  const calculateStats = (clientsData) => {
    const totalClients = clientsData.length;
    const clientsWithProject = clientsData.filter((c) => c.project).length;
    const totalRevenue = clientsData
      .filter((c) => c.project)
      .reduce((sum, c) => sum + parseFloat(c.project.price || 0), 0);
    const avgProgress =
      clientsWithProject === 0
        ? 0
        : clientsData
            .filter((c) => c.project)
            .reduce((sum, c) => sum + parseFloat(c.project.progress || 0), 0) /
          clientsWithProject;

    const completedProjects = clientsData.filter(c => c.project?.progress === "100").length;
    const activeProjects = clientsData.filter(c => c.project && c.status === 'Active').length;

    setDashboardStats({
      totalClients,
      clientsWithProject,
      totalRevenue,
      avgProgress: Math.round(avgProgress),
      completedProjects,
      activeProjects
    });
  };

  if (!user) return <div className="p-8 text-center">🔐 Loading...</div>;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Business Intelligence</h1>
          <p className="text-gray-600">Advanced analytics and AI-powered insights for your business</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("overview")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "overview"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <BarChart3 className="inline-block w-4 h-4 mr-2" />
                Analytics Overview
              </button>
              <button
                onClick={() => setActiveTab("ai-insights")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "ai-insights"
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Brain className="inline-block w-4 h-4 mr-2" />
                AI Predictions
              </button>
              <button
                onClick={() => setActiveTab("performance")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "performance"
                    ? "border-green-500 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <TrendingUp className="inline-block w-4 h-4 mr-2" />
                Performance Metrics
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "overview" && (
              <OverviewTab clients={clients} stats={dashboardStats} />
            )}

            {activeTab === "ai-insights" && (
              <div>
                <MLInsights clients={clients} />
              </div>
            )}

            {activeTab === "performance" && (
              <PerformanceTab clients={clients} stats={dashboardStats} />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

// Overview Tab Component
function OverviewTab({ clients, stats }) {
  const statusDistribution = {
    'In Discussion': clients.filter(c => c.status === 'In Discussion').length,
    'Active': clients.filter(c => c.status === 'Active').length,
    'Completed': clients.filter(c => c.status === 'Completed').length
  };

  const revenueByStatus = {
    'Active': clients
      .filter(c => c.status === 'Active' && c.project?.price)
      .reduce((sum, c) => sum + parseFloat(c.project.price), 0),
    'Completed': clients
      .filter(c => c.status === 'Completed' && c.project?.price)
      .reduce((sum, c) => sum + parseFloat(c.project.price), 0)
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total Clients" 
          value={stats.totalClients || 0} 
          color="blue"
          icon={<Users size={24} />}
        />
        <StatCard 
          label="With Projects" 
          value={stats.clientsWithProject || 0} 
          color="green"
          icon={<BarChart3 size={24} />}
        />
        <StatCard 
          label="Total Revenue" 
          value={`₹${(stats.totalRevenue || 0).toLocaleString()}`} 
          color="purple"
          icon={<DollarSign size={24} />}
        />
        <StatCard 
          label="Avg Progress" 
          value={`${stats.avgProgress || 0}%`} 
          color="orange"
          icon={<TrendingUp size={24} />}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Client Status Distribution</h3>
          <div className="space-y-3">
            {Object.entries(statusDistribution).map(([status, count]) => {
              const percentage = stats.totalClients > 0 ? Math.round((count / stats.totalClients) * 100) : 0;
              const colors = {
                'In Discussion': 'bg-yellow-500',
                'Active': 'bg-blue-500',
                'Completed': 'bg-green-500'
              };
              
              return (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${colors[status]}`}></div>
                    <span className="text-sm font-medium text-gray-700">{status}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{count}</span>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${colors[status]}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 w-8">{percentage}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Revenue Breakdown */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Revenue by Status</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
              <span className="text-sm font-medium text-blue-800">Active Projects</span>
              <span className="text-lg font-bold text-blue-600">
                ₹{revenueByStatus.Active.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded">
              <span className="text-sm font-medium text-green-800">Completed Projects</span>
              <span className="text-lg font-bold text-green-600">
                ₹{revenueByStatus.Completed.toLocaleString()}
              </span>
            </div>
            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-700">Total Revenue</span>
                <span className="text-xl font-bold text-purple-600">
                  ₹{stats.totalRevenue?.toLocaleString() || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Performance Tab Component  
function PerformanceTab({ clients, stats }) {
  const projectsByMonth = clients
    .filter(c => c.project?.paymentDue)
    .reduce((acc, client) => {
      const month = new Date(client.project.paymentDue).toLocaleString('default', { 
        month: 'short', 
        year: 'numeric' 
      });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});

  const completionRate = stats.totalClients > 0 ? 
    Math.round((stats.completedProjects / stats.totalClients) * 100) : 0;

  const avgProjectValue = stats.clientsWithProject > 0 ? 
    Math.round(stats.totalRevenue / stats.clientsWithProject) : 0;

  return (
    <div className="space-y-6">
      {/* Performance KPIs */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Completion Rate</p>
              <p className="text-3xl font-bold">{completionRate}%</p>
            </div>
            <BarChart3 className="opacity-80" size={32} />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Avg Project Value</p>
              <p className="text-3xl font-bold">₹{avgProjectValue.toLocaleString()}</p>
            </div>
            <DollarSign className="opacity-80" size={32} />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Active Projects</p>
              <p className="text-3xl font-bold">{stats.activeProjects || 0}</p>
            </div>
            <TrendingUp className="opacity-80" size={32} />
          </div>
        </div>
      </div>

      {/* Project Timeline */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Projects Timeline</h3>
        <div className="space-y-2">
          {Object.entries(projectsByMonth).length > 0 ? (
            Object.entries(projectsByMonth)
              .sort(([a], [b]) => new Date(a) - new Date(b))
              .map(([month, count]) => (
                <div key={month} className="flex items-center justify-between p-3 bg-white rounded shadow-sm">
                  <span className="text-sm font-medium text-gray-700">{month}</span>
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${Math.min((count / Math.max(...Object.values(projectsByMonth))) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                      {count} project{count !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <AlertTriangle className="mx-auto h-12 w-12 text-gray-400 mb-2" />
              <p>No project timelines available</p>
              <p className="text-sm">Add payment due dates to projects to see timeline analysis</p>
            </div>
          )}
        </div>
      </div>

      {/* Progress Analysis */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Progress Analysis</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Overall Progress</h4>
            <div className="w-full bg-gray-200 rounded-full h-6">
              <div
                className="bg-gradient-to-r from-green-400 to-green-500 h-6 rounded-full flex items-center justify-center"
                style={{ width: `${stats.avgProgress || 0}%` }}
              >
                <span className="text-sm text-white font-medium">
                  {stats.avgProgress || 0}%
                </span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Project Health</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Completed</span>
                <span className="font-medium text-green-600">{stats.completedProjects || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">In Progress</span>
                <span className="font-medium text-blue-600">{stats.activeProjects || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Not Started</span>
                <span className="font-medium text-gray-600">
                  {(stats.totalClients || 0) - (stats.clientsWithProject || 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Stats Card Component
function StatCard({ label, value, color, icon }) {
  const colors = {
    blue: "bg-blue-500",
    green: "bg-green-500", 
    purple: "bg-purple-500",
    orange: "bg-orange-500",
  };

  return (
    <div className={`${colors[color]} rounded-xl shadow-lg p-6 text-white`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium mb-1 opacity-90">{label}</h3>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className="opacity-80">{icon}</div>
      </div>
    </div>
  );
}