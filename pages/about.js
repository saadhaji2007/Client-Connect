import { FaGithub, FaLinkedin, FaInstagram, FaXTwitter } from "react-icons/fa6";
import Layout from "../components/layout"; 
import { 
  Users, 
  BarChart3, 
  FileText, 
  Shield, 
  Zap, 
  Heart,
  Target,
  Award,
  Lightbulb,
  Clock,
  TrendingUp
} from "lucide-react";

export default function About() {
  const features = [
    {
      icon: Users,
      title: "Client Management",
      description: "Organize and manage multiple clients with detailed profiles, contact information, and project history."
    },
    {
      icon: BarChart3,
      title: "Progress Tracking",
      description: "Visualize project progress with interactive charts and real-time analytics dashboard."
    },
    {
      icon: FileText,
      title: "Invoice Generation",
      description: "Create professional PDF invoices with customizable templates and automatic calculations."
    },
    {
      icon: Shield,
      title: "Secure Authentication",
      description: "Firebase-powered authentication ensures your data is protected with enterprise-grade security."
    },
    {
      icon: Target,
      title: "AI Success Prediction",
      description: "Neural network analyzes budget, timeline, and team efficiency to predict project success probability with color-coded risk indicators and actionable recommendations."
    },
    {
      icon: TrendingUp,
      title: "Revenue Forecasting",
      description: "Time-series AI model predicts monthly revenue with confidence intervals, analyzes trends, and provides insights based on historical data and client patterns."
    }
  ];

  const stats = [
    { number: "500+", label: "Active Users" },
    { number: "10K+", label: "Projects Managed" },
    { number: "99.9%", label: "Uptime" },
    { number: "24/7", label: "Support" }
  ];

  return (
    <Layout>
      <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50 min-h-screen">
        <main className="max-w-7xl mx-auto px-6 py-12">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Heart size={16} className="text-blue-600" />
              Made for developers, by developers
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-6">
              About ClientConnect
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              The comprehensive client management platform that transforms how developers handle projects, 
              track progress, and manage client relationships with intelligence and ease.
            </p>
          </div>

          {/* Mission Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-16 border border-slate-100">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <Target size={24} className="text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-800">Our Mission</h2>
                </div>
                <p className="text-slate-600 leading-relaxed mb-6">
                  We believe that managing clients shouldnt be complicated. ClientConnect was born from 
                  the frustration of juggling multiple tools, spreadsheets, and communication channels 
                  just to keep track of client work.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  Our mission is to provide developers and agencies with a unified platform that 
                  simplifies client management, increases productivity, and helps build stronger 
                  professional relationships.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600 mb-2">{stat.number}</div>
                    <div className="text-sm text-slate-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-800 mb-4">Powerful Features</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Everything you need to manage your clients effectively, all in one beautiful interface.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center mb-4">
                      <Icon size={24} className="text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-3">{feature.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Developer Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-white mb-16">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Award size={24} className="text-white" />
                </div>
                <h2 className="text-3xl font-bold">Meet the Creator</h2>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8 items-center">
                <div className="md:col-span-2">
                  <h3 className="text-2xl font-bold mb-2">Saad Haji</h3>
                  <p className="text-blue-100 mb-4 text-lg">Full Stack Developer | MERN Stack | ML Enthusiast</p>
                  <p className="text-blue-50 leading-relaxed mb-6">
                    Passionate about creating solutions that make developers lives easier. With expertise 
                    in modern web technologies and a keen eye for user experience, Saad built ClientConnect 
                    to address the real challenges faced by freelancers and development teams.
                  </p>
                  
                  <div className="flex gap-4">
                    <a
                      href="https://github.com/saadhaji2007"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110"
                      aria-label="GitHub Profile"
                    >
                      <FaGithub size={20} />
                    </a>
                    <a
                      href="https://www.linkedin.com/in/saadhaji2007/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110"
                      aria-label="LinkedIn Profile"
                    >
                      <FaLinkedin size={20} />
                    </a>
                    <a 
                      href="https://instagram.com/saadhaji__" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110"
                      aria-label="Instagram Profile"
                    >
                      <FaInstagram size={20} />
                    </a>
                    <a 
                      href="https://x.com/saadhaji_" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110"
                      aria-label="Twitter Profile"
                    >
                      <FaXTwitter size={20} />
                    </a>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="w-32 h-32 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <div className="w-24 h-24 bg-white/30 rounded-full flex items-center justify-center">
                      <span className="text-3xl font-bold">SH</span>
                    </div>
                  </div>
                  <div className="space-y-2 text-blue-100">
                    <div className="flex items-center justify-center gap-2">
                      <Lightbulb size={16} />
                      <span className="text-sm">Innovation Focused</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Heart size={16} />
                      <span className="text-sm">User-Centric Design</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Technology Stack */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-slate-100">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-800 mb-4">Built with Modern Technology</h2>
              <p className="text-slate-600">
                ClientConnect is built using cutting-edge technologies to ensure reliability, performance, and scalability.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: "Next.js", description: "React framework for production" },
                { name: "Firebase", description: "Backend & Authentication" },
                { name: "Tailwind CSS", description: "Modern styling framework" },
                { name: "Chart.js", description: "Interactive data visualization" }
              ].map((tech, index) => (
                <div key={index} className="text-center p-6 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
                    <span className="font-bold text-blue-600">{tech.name.charAt(0)}</span>
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-2">{tech.name}</h3>
                  <p className="text-sm text-slate-600">{tech.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Ready to Get Started?</h2>
            <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
              Join hundreds of developers who are already using ClientConnect to streamline their client management workflow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                Start Free Trial
              </button>
              <button className="border border-slate-300 text-slate-700 px-8 py-3 rounded-xl font-semibold hover:bg-slate-50 transition-colors">
                View Demo
              </button>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
}