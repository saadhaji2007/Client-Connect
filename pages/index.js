import Footer from "./components/footer";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

export default function LandingPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="bg-white min-h-screen flex flex-col justify-between">
      {/* HERO SECTION */}
      <section className="text-center px-4 py-24 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <motion.h1
          className="text-5xl font-extrabold mb-4"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Welcome to ClientConnect
        </motion.h1>

        <motion.p
          className="text-lg mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Your smart platform to manage clients, track projects, and generate invoices effortlessly.
        </motion.p>

        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.8 }}
          className="flex gap-4 justify-center"
        >
          {user ? (
            <Link href="/dashboard">
              <button className="bg-white text-purple-600 font-semibold px-6 py-3 rounded-lg shadow hover:bg-purple-100 transition">
                Go to Dashboard
              </button>
            </Link>
          ) : (
            <>
              <Link href="/signup">
                <button className="bg-white text-purple-600 font-semibold px-6 py-3 rounded-lg shadow hover:bg-purple-100 transition">
                  Sign Up
                </button>
              </Link>
              <Link href="/login">
                <button className="bg-white text-purple-600 font-semibold px-6 py-3 rounded-lg shadow hover:bg-purple-100 transition">
                  Login
                </button>
              </Link>
            </>
          )}
        </motion.div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="px-6 py-16 bg-gray-50 text-center">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-6 text-left max-w-6xl mx-auto">
          {[
            {
              title: "Add Clients",
              desc: "Easily create client profiles with project info and status.",
            },
            {
              title: "Track Progress",
              desc: "Monitor each client’s project progress and update in real-time.",
            },
            {
              title: "Generate Invoices",
              desc: "Download professional invoices with one click.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="bg-white p-6 rounded-xl shadow hover:shadow-xl transition"
              whileHover={{ scale: 1.03 }}
            >
              <h3 className="text-xl font-semibold text-purple-700">{item.title}</h3>
              <p className="text-gray-600 mt-2">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
