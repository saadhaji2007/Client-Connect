// import Link from "next/link";
// import { FaGithub, FaInstagram, FaLinkedin, FaXTwitter, FaDiscord, FaReddit } from "react-icons/fa6";
// import { FaChartLine } from "react-icons/fa";

// export default function Footer() {
//   return (
//     <footer className="bg-white text-gray-700 border-t border-gray-200 py-10 px-6 mt-16">
//       <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
//         {/* Branding */}
//         <div>
//           <h2 className="text-xl font-bold text-purple-600">⚡ ClientConnect</h2>
//           <p className="text-sm mt-2">
//             The ultimate client management solution. <br />
//             Track projects, generate invoices, and more.
//           </p>
//           <div className="flex space-x-4 mt-4 text-lg text-gray-600">
//             <a href="https://x.com/yourprofile" target="_blank" rel="noreferrer"><FaXTwitter /></a>
//             <a href="https://discord.com/yourprofile" target="_blank" rel="noreferrer"><FaDiscord /></a>
//             <a href="https://reddit.com/yourprofile" target="_blank" rel="noreferrer"><FaReddit /></a>
//             <a href="https://instagram.com/yourprofile" target="_blank" rel="noreferrer"><FaInstagram /></a>
//             <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noreferrer"><FaLinkedin /></a>
//             <a href="https://github.com/your-repo" target="_blank" rel="noreferrer"><FaGithub /></a>
//             <Link href="/timeline"><FaChartLine /></Link>
//           </div>
//         </div>

//         {/* Quick Links */}
//         <div>
//           <h3 className="font-semibold text-gray-900 mb-2">Quick Links</h3>
//           <ul className="space-y-1 text-sm">
//             <li><Link href="/" className="hover:text-purple-600">Home</Link></li>
//             <li><Link href="/about" className="hover:text-purple-600">About</Link></li>
//             <li><Link href="/faq" className="hover:text-purple-600">FAQ</Link></li>
//             <li><Link href="/contact" className="hover:text-purple-600">Contact</Link></li>
//           </ul>
//         </div>

//         {/* Resources */}
//         <div>
//           <h3 className="font-semibold text-gray-900 mb-2">Resources</h3>
//           <ul className="space-y-1 text-sm">
//             <li><Link href="/timeline" className="hover:text-purple-600">Roadmap</Link></li>
//             <li><Link href="/terms" className="hover:text-purple-600">Terms of Service</Link></li>
//             <li><Link href="/privacy" className="hover:text-purple-600">Privacy Policy</Link></li>
//           </ul>
//         </div>
//       </div>

//       <div className="border-t border-gray-200 mt-8 pt-4 text-center text-xs text-gray-500">
//         &copy; 2025 ClientConnect. All rights reserved.
//       </div>
//     </footer>
//   );
// }

import Link from "next/link";
import {
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaXTwitter,
  FaDiscord,
  FaReddit,
} from "react-icons/fa6";
import { FaChartLine } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-white text-gray-800 border-t border-gray-200 py-12 px-6 mt-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Branding */}
        <div>
          <h2 className="text-2xl font-bold text-purple-600 hover:text-purple-800 transition duration-300">⚡ ClientConnect</h2>
          <p className="text-sm mt-3 text-gray-600">
            Your all-in-one solution for smart client tracking, task management,
            and project billing.
          </p>
          <div className="flex space-x-4 mt-5 text-xl text-gray-500 hover:text-purple-600 transition-all duration-300">
            <a href="https://x.com/yourprofile" target="_blank" rel="noreferrer" className="hover:text-purple-600 transition duration-300"><FaXTwitter /></a>
            <a href="https://discord.com/yourprofile" target="_blank" rel="noreferrer" className="hover:text-purple-600 transition duration-300"><FaDiscord /></a>
            <a href="https://reddit.com/yourprofile" target="_blank" rel="noreferrer" className="hover:text-purple-600 transition duration-300"><FaReddit /></a>
            <a href="https://instagram.com/yourprofile" target="_blank" rel="noreferrer" className="hover:text-purple-600 transition duration-300"><FaInstagram /></a>
            <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noreferrer" className="hover:text-purple-600 transition duration-300"><FaLinkedin /></a>
            <a href="https://github.com/your-repo" target="_blank" rel="noreferrer" className="hover:text-purple-600 transition duration-300"><FaGithub /></a>
            <Link href="/timeline" className="hover:text-purple-600 transition duration-300"><FaChartLine /></Link>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-2 text-lg">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-purple-600 transition duration-300">Home</Link></li>
            <li><Link href="/about" className="hover:text-purple-600 transition duration-300">About</Link></li>
            <li><Link href="/faq" className="hover:text-purple-600 transition duration-300">FAQ</Link></li>
            <li><Link href="/contact" className="hover:text-purple-600 transition duration-300">Contact</Link></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-2 text-lg">Resources</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/roadmap" className="hover:text-purple-600 transition duration-300">Roadmap</Link></li>
            <li><Link href="/terms" className="hover:text-purple-600 transition duration-300">Terms of Service</Link></li>
            <li><Link href="/privacy" className="hover:text-purple-600 transition duration-300">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-200 mt-10 pt-4 text-center text-xs text-gray-500">
        &copy; 2025 ClientConnect. All rights reserved.
      </div>
    </footer>
  );
}
