import { motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";
import RoadmapTimeline from "./roadmap";
import Layout from "./components/layout"

const roadmap = [
  {
    title: "Client Profile Setup",
    description: "Added secure client login and individual profile view.",
    date: "July 10, 2025"
  },
  {
    title: "Project Summary Table",
    description: "Displayed all project data in one dashboard table.",
    date: "July 11, 2025"
  },
  {
    title: "Invoice Generator",
    description: "Generate downloadable invoices as PDFs.",
    date: "July 12, 2025"
  },
  {
    title: "Client Detail Timeline",
    description: "Roadmap to track project updates with animations.",
    date: "July 13, 2025"
  }
];

export default function TimelineRoadmap() {
  return (
    <Layout>
    <div className="bg-white py-16 px-4 sm:px-6 lg:px-24">
      <h2 className="text-3xl font-bold text-center text-purple-600 mb-12">Project Roadmap</h2>
      <div className="relative border-l-4 border-purple-300 pl-6">
        {roadmap.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true }}
            className="mb-10 relative"
          >
            <span className="absolute -left-4 top-2 w-4 h-4 bg-purple-600 rounded-full border-4 border-white"></span>
            <div className="bg-purple-50 hover:bg-purple-100 transition duration-300 p-6 rounded-xl shadow-md">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-semibold text-purple-800">{item.title}</h3>
                <FaCheckCircle className="text-green-500 text-lg" />
              </div>
              <p className="text-gray-600 mb-1">{item.description}</p>
              <p className="text-sm text-gray-400 italic">{item.date}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
    </Layout>
  );
}
