import { useEffect, useState } from "react";
import Layout from "../../components/layout";
import { db } from "../../firebase";
import jsPDF from "jspdf";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase"; 
import { useRouter } from "next/router";
import { collection, getDocs, query, where } from "firebase/firestore";

export default function ClientSummaryPage() {
  const [user, setUser] = useState(null);
  const [clients, setClients] = useState([]);
  const router = useRouter();

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
    };

    fetchClients();
  }, [user]);

  const handleDownloadInvoice = (client) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    
    // Colors
    const primaryColor = '#4F46E5'; // Indigo
    const secondaryColor = '#6B7280'; // Gray
    const accentColor = '#10B981'; // Green
    
    // Header Section with Company Branding
    doc.setFillColor(79, 70, 229); // Primary color
    doc.rect(0, 0, pageWidth, 35, 'F');
    
    // Company Logo/Icon (using text as logo)
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('⚡', 15, 25);
    
    // Company Name
    doc.setFontSize(20);
    doc.text('ClientConnect', 25, 25);
    
    // Tagline
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Smart Client Management Solutions', 25, 30);
    
    // Invoice Title
    doc.setTextColor(79, 70, 229);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('INVOICE', pageWidth - 50, 25);
    
    // Invoice Details Box
    doc.setDrawColor(79, 70, 229);
    doc.setLineWidth(0.5);
    doc.rect(pageWidth - 65, 35, 60, 25);
    
    doc.setTextColor(107, 114, 128);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Invoice #:', pageWidth - 60, 45);
    doc.text('Date:', pageWidth - 60, 50);
    doc.text('Due Date:', pageWidth - 60, 55);
    
    doc.setFont('helvetica', 'bold');
    doc.text(`INV-${Date.now().toString().slice(-6)}`, pageWidth - 35, 45);
    doc.text(new Date().toLocaleDateString(), pageWidth - 35, 50);
    doc.text(client.project?.paymentDue || 'Upon completion', pageWidth - 35, 55);
    
    // Company Address Section
    doc.setTextColor(79, 70, 229);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('From:', 15, 75);
    
    doc.setTextColor(107, 114, 128);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('ClientConnect Technologies', 15, 85);
    doc.text('Your Business Address', 15, 90);
    doc.text('City, State - PIN Code', 15, 95);
    doc.text('Email: hello@clientconnect.com', 15, 100);
    doc.text('Phone: +91 XXXXX XXXXX', 15, 105);
    
    // Client Information Section
    doc.setTextColor(79, 70, 229);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Bill To:', 15, 125);
    
    doc.setTextColor(107, 114, 128);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(client.name, 15, 135);
    if (client.company) {
      doc.text(client.company, 15, 140);
    }
    doc.text(client.email, 15, client.company ? 145 : 140);
    doc.text(client.phone, 15, client.company ? 150 : 145);
    
    // Project Details Table
    const tableStartY = 165;
    
    // Table Header
    doc.setFillColor(79, 70, 229);
    doc.rect(15, tableStartY, pageWidth - 30, 15, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Project Details', 20, tableStartY + 10);
    
    // Table Content
    doc.setFillColor(248, 250, 252);
    doc.rect(15, tableStartY + 15, pageWidth - 30, 60, 'F');
    
    doc.setTextColor(107, 114, 128);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    // Project Title
    doc.setFont('helvetica', 'bold');
    doc.text('Project:', 20, tableStartY + 25);
    doc.setFont('helvetica', 'normal');
    doc.text(client.project?.title || 'N/A', 45, tableStartY + 25);
    
    // Progress
    doc.setFont('helvetica', 'bold');
    doc.text('Progress:', 20, tableStartY + 35);
    doc.setFont('helvetica', 'normal');
    doc.text(`${client.project?.progress || 0}%`, 45, tableStartY + 35);
    
    // Progress Bar
    const progressBarY = tableStartY + 40;
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(3);
    doc.line(45, progressBarY, 120, progressBarY);
    
    doc.setDrawColor(16, 185, 129); // Green color
    const progressWidth = ((client.project?.progress || 0) / 100) * 75;
    doc.line(45, progressBarY, 45 + progressWidth, progressBarY);
    
    // Status
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(107, 114, 128);
    doc.text('Status:', 20, tableStartY + 50);
    doc.setFont('helvetica', 'normal');
    const statusColor = client.project?.progress === "100" ? [16, 185, 129] : [79, 70, 229];
    doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
    doc.text(client.project?.progress === "100" ? 'Completed' : 'In Progress', 45, tableStartY + 50);
    
    // Payment Information
    const paymentY = tableStartY + 85;
    
    // Payment Header
    doc.setFillColor(16, 185, 129);
    doc.rect(15, paymentY, pageWidth - 30, 15, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Payment Information', 20, paymentY + 10);
    
    // Payment Details
    doc.setFillColor(240, 253, 244);
    doc.rect(15, paymentY + 15, pageWidth - 30, 30, 'F');
    
    doc.setTextColor(107, 114, 128);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Project Amount:', 20, paymentY + 25);
    
    doc.setTextColor(16, 185, 129);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(`₹${client.project?.price || 0}`, pageWidth - 60, paymentY + 25);
    
    doc.setTextColor(107, 114, 128);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('(All amounts in Indian Rupees)', 20, paymentY + 35);
    
    // Payment Terms
    const termsY = paymentY + 55;
    doc.setTextColor(79, 70, 229);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Payment Terms & Conditions:', 15, termsY);
    
    doc.setTextColor(107, 114, 128);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const terms = [
      '• Payment is due within 30 days of invoice date',
      '• Late payments may incur additional charges',
      '• All disputes must be raised within 7 days',
      '• This invoice is system generated and valid without signature'
    ];
    
    terms.forEach((term, index) => {
      doc.text(term, 15, termsY + 10 + (index * 5));
    });
    
    // Footer
    const footerY = termsY + 40;
    doc.setDrawColor(79, 70, 229);
    doc.setLineWidth(0.5);
    doc.line(15, footerY, pageWidth - 15, footerY);
    
    doc.setTextColor(79, 70, 229);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Thank You for Your Business!', 15, footerY + 15);
    
    doc.setTextColor(107, 114, 128);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Generated by ClientConnect - Smart Client Management Platform', 15, footerY + 25);
    doc.text(`Invoice generated on: ${new Date().toLocaleString()}`, 15, footerY + 30);
    
    // Watermark (if needed)
    if (client.project?.progress !== "100") {
      doc.setTextColor(200, 200, 200);
      doc.setFontSize(40);
      doc.setFont('helvetica', 'bold');
      doc.text('DRAFT', pageWidth/2 - 20, 150, { angle: 45 });
    }
    
    // Save the PDF
    const fileName = `ClientConnect_Invoice_${client.name.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
    doc.save(fileName);
  };

  if (!user) return <div className="p-6">🔐 Loading...</div>;

  return (
    <Layout>
      <div className="flex min-h-screen bg-gray-100">
        <div className="flex-1 p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-blue-700">Client Summary</h2>
                <p className="text-gray-600 mt-1">Overview of all your clients and their projects</p>
              </div>
              <div className="text-sm text-gray-500">
                Total Clients: <span className="font-semibold text-blue-600">{clients.length}</span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
            <table className="min-w-full table-auto">
              <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 text-left text-sm uppercase text-gray-700">
                <tr>
                  <th className="p-4 font-semibold">Client</th>
                  <th className="p-4 font-semibold">Project Title</th>
                  <th className="p-4 font-semibold">Price</th>
                  <th className="p-4 font-semibold">Due Date</th>
                  <th className="p-4 font-semibold">Progress</th>
                  <th className="p-4 font-semibold">Invoice</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client, index) => (
                  <tr key={client.id} className={`border-b hover:bg-gray-50 text-sm transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                    <td className="p-4 font-medium">
                      <Link href={`/clients/${client.id}`} className="text-blue-600 hover:text-blue-800 hover:underline">
                        {client.name}
                      </Link>
                      {client.company && (
                        <div className="text-xs text-gray-500 mt-1">{client.company}</div>
                      )}
                    </td>
                    <td className="p-4">
                      {client.project?.title ? (
                        <span className="text-gray-800">{client.project.title}</span>
                      ) : (
                        <span className="text-gray-400 italic">No project assigned</span>
                      )}
                    </td>
                    <td className="p-4">
                      {client.project?.price ? (
                        <span className="text-green-600 font-semibold">₹{parseInt(client.project.price).toLocaleString()}</span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="p-4">
                      {client.project?.paymentDue ? (
                        <span className="text-gray-700">{new Date(client.project.paymentDue).toLocaleDateString()}</span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="p-4 w-40">
                      {client.project?.progress ? (
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-3">
                            <div
                              className={`h-3 rounded-full transition-all duration-300 ${
                                client.project.progress === "100" ? 'bg-green-500' : 
                                parseInt(client.project.progress) >= 75 ? 'bg-blue-500' :
                                parseInt(client.project.progress) >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${client.project.progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-600 min-w-max">{client.project.progress}%</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="p-4">
                      {client.project?.progress === "100" ? (
                        <button
                          onClick={() => handleDownloadInvoice(client)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
                        >
                          📄 Download Invoice
                        </button>
                      ) : client.project ? (
                        <button
                          onClick={() => handleDownloadInvoice(client)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
                        >
                          📋 Draft Invoice
                        </button>
                      ) : (
                        <span className="text-gray-400 text-sm">No project</span>
                      )}
                    </td>
                  </tr>
                ))}
                {clients.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center p-12 text-gray-500">
                      <div className="flex flex-col items-center">
                        <div className="text-4xl mb-4">📋</div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No clients found</h3>
                        <p className="text-sm text-gray-500">Start by adding your first client to see them here</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {clients.length > 0 && (
            <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {clients.filter(c => c.project?.progress === "100").length}
                  </div>
                  <div className="text-sm text-blue-700">Completed Projects</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    ₹{clients.filter(c => c.project?.price).reduce((sum, c) => sum + parseInt(c.project.price || 0), 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-green-700">Total Revenue</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {clients.filter(c => c.status === 'Active').length}
                  </div>
                  <div className="text-sm text-yellow-700">Active Clients</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {clients.filter(c => c.project && c.project.progress !== "100").length}
                  </div>
                  <div className="text-sm text-purple-700">In Progress</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}