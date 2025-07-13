// // import { useEffect, useState } from "react";
// // import Sidebar from "../components/Sidebar";
// // import Topbar from "../components/topbar";
// import Layout from "../components/layout";
// import { db } from "../../firebase";
// import { collection, getDocs } from "firebase/firestore";
// import { saveAs } from "file-saver";
// import jsPDF from "jspdf";
// import Link from "next/link";
// import { onAuthStateChanged } from "firebase/auth";
// import { auth } from "../../firebase"; 
// import { useRouter } from "next/router";
// import { useEffect, useState } from "react";

// const [user, setUser] = useState(null);
// const router = useRouter();
// export default function ClientSummaryPage() {
//   const [user, setUser] = useState(null);
//   const router = useRouter();
//   const [clients, setClients] = useState([]);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       if (!currentUser) {
//         router.push("/login");
//       } else {
//         setUser(currentUser);
//       }
//     });
//     return () => unsubscribe();
//   }, []);

//   useEffect(() => {
//     const fetchClients = async () => {
//       const snapshot = await getDocs(collection(db, "clients"));
//       const data = snapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setClients(data);
//     };
//     if (user) fetchClients();
//   }, [user]);

//   if (!user) return <div className="p-6">🔐 Loading...</div>;


// // useEffect(() => {
// //   const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
// //     if (!currentUser) {
// //       router.push("/login"); // 🚫 redirect if not logged in
// //     } else {
// //       setUser(currentUser);
// //     }
// //   });
// //   return () => unsubscribe();
// // }, []);

// // if (!user) return <div className="p-6">🔐 Loading...</div>;

// // export default function ClientSummaryPage() {
// //   const [clients, setClients] = useState([]);

// //   useEffect(() => {
// //     const fetchClients = async () => {
// //       const snapshot = await getDocs(collection(db, "clients"));
// //       const data = snapshot.docs.map((doc) => ({
// //         id: doc.id,
// //         ...doc.data(),
// //       }));
// //       setClients(data);
// //     };
// //     fetchClients();
// //   }, []);

// const handleDownloadInvoice = (client) => {
//   const doc = new jsPDF();

//   doc.setFontSize(18);
//   doc.text("Client Connect - Project Invoice", 20, 20);

//   doc.setFontSize(12);
//   doc.text(`Client Name: ${client.name}`, 20, 40);
//   doc.text(`Email: ${client.email}`, 20, 50);
//   doc.text(`Project Title: ${client.project?.title}`, 20, 60);
//   doc.text(`Price: ₹${client.project?.price}`, 20, 70);
//   doc.text(`Payment Due: ${client.project?.paymentDue}`, 20, 80);
//   doc.text(`Progress: ${client.project?.progress}%`, 20, 90);

//   doc.text("Thank you for working with us!", 20, 110);

//   doc.save(`Invoice_${client.name}.pdf`);
// };

import { useEffect, useState } from "react";
import Layout from "../components/layout";
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
        router.push("/login"); // redirect if not logged in
      } else {
        setUser(currentUser);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
  //   const fetchClients = async () => {
  //     const snapshot = await getDocs(collection(db, "clients"));
  //     const data = snapshot.docs.map((doc) => ({
  //       id: doc.id,
  //       ...doc.data(),
  //     }));
  //     setClients(data);
  //   };
  //   fetchClients();
  // }, []);
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

    doc.setFontSize(18);
    doc.text("Client Connect - Project Invoice", 20, 20);

    doc.setFontSize(12);
    doc.text(`Client Name: ${client.name}`, 20, 40);
    doc.text(`Email: ${client.email}`, 20, 50);
    doc.text(`Project Title: ${client.project?.title}`, 20, 60);
    doc.text(`Price: ₹${client.project?.price}`, 20, 70);
    doc.text(`Payment Due: ${client.project?.paymentDue}`, 20, 80);
    doc.text(`Progress: ${client.project?.progress}%`, 20, 90);

    doc.text("Thank you for working with us!", 20, 110);
    doc.save(`Invoice_${client.name}.pdf`);
  };

  if (!user) return <div className="p-6">🔐 Loading...</div>;

  return (
    <Layout>
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-1 p-4">
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
                  <td className="p-3 font-medium">
                    <Link href={`/clients/${client.id}`}>{client.name}</Link>
                  </td>
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
  Download Invoice
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
    </Layout>
  );
  
}
