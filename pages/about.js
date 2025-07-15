import { FaGithub, FaLinkedin, FaInstagram, FaXTwitter } from "react-icons/fa6";
import Layout from "./components/layout"; 
import Image from "next/image";

export default function About() {
  return (
    <Layout>
    <div className="flex bg-gray-100 min-h-screen">
      <div className="flex-1 flex flex-col">
        <main className="flex-grow p-6">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-blue-700 mb-4">About ClientConnect</h1>
            <p className="text-gray-700 mb-6 leading-relaxed">
              ClientConnect is a smart dashboard platform designed to help developers efficiently
              manage client details, project progress, payments, and communications — all in one place.
            </p>

            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">👨‍💻 Developed By</h2>
              <div className="flex items-center gap-4">
                <div>
                  <p className="font-bold text-lg">Saad Haji</p>
                  <p className="text-gray-600">Full Stack Developer | MERN | ML Enthusiast</p>
                  <div className="flex space-x-3 mt-2">
                    <a
                      href="https://github.com/saadhaji2007"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-black"
                    >
                      <FaGithub size={20} />
                    </a>
                    <a
                      href="https://www.linkedin.com/in/saadhaji2007/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaLinkedin size={20} />
                    </a>
                    <a href="https://instagram.com/saadhaji__" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    >
                   <FaInstagram className="hover:text-pink-600" 
                   />
  </a>
  <a href="https://x.com/saadhaji_" target="_blank" rel="noopener noreferrer">
    <FaXTwitter className="hover:text-black" />
  </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">📈 Features</h2>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                <li>Manage multiple clients and their projects</li>
                <li>Track project progress with charts</li>
                <li>Generate invoice PDFs</li>
                <li>Modern UI with Tailwind CSS</li>
                <li>Authentication & Firebase backend</li>
              </ul>
            </div>
          </div>
        </main>
        {/* <Footer /> */}
      </div>
    </div>
    </Layout>
  );
}
