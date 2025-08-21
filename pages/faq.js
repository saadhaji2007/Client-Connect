import { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
  Shield, 
  CreditCard, 
  Users, 
  BarChart3, 
  Zap,
  MessageCircle,
  Mail
} from 'lucide-react';

export default function FAQ() {
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (index) => {
    setOpenItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const faqCategories = [
    {
      title: "Getting Started",
      icon: Zap,
      color: "from-blue-500 to-purple-500",
      faqs: [
        {
          question: "What is ClientConnect and who is it for?",
          answer: "ClientConnect is a comprehensive client management platform designed for freelancers, developers, and small agencies. It helps you manage client relationships, track project progress, generate invoices, and predict project success using AI-powered insights."
        },
        {
          question: "How do I get started with ClientConnect?",
          answer: "Simply sign up with your email address and create your account. You can start adding clients immediately and begin tracking your first project within minutes. Our intuitive interface requires no training - just jump right in!"
        },
        {
          question: "Is there a free trial available?",
          answer: "Yes! We offer a 14-day free trial with full access to all features. No credit card required to start. You can upgrade to a paid plan anytime during or after your trial period."
        },
        {
          question: "Can I import my existing client data?",
          answer: "Absolutely! ClientConnect supports CSV imports for client data, project information, and time tracking records. We also provide migration guides for popular tools like Trello, Asana, and spreadsheet-based systems."
        }
      ]
    },
    {
      title: "Features & Functionality",
      icon: BarChart3,
      color: "from-green-500 to-teal-500",
      faqs: [
        {
          question: "How does the AI Success Prediction work?",
          answer: "Our neural network analyzes multiple factors including project budget, timeline, current progress, team efficiency, and historical data to predict success probability (0-100%). It provides color-coded indicators: 🟢 High success (80%+), 🟡 Medium risk (50-79%), 🔴 High risk (<50%) along with actionable recommendations."
        },
        {
          question: "What is Revenue Forecasting and how accurate is it?",
          answer: "Our time-series AI model predicts monthly revenue based on historical data, client count, average project values, and completion rates. It provides predictions with confidence intervals (e.g., '₹45,000 ± ₹7,500'). Accuracy improves with more historical data, typically reaching 85-90% accuracy after 3 months of usage."
        },
        {
          question: "Can I generate custom invoices and receipts?",
          answer: "Yes! Create professional PDF invoices with your branding, customizable templates, automatic tax calculations, and payment tracking. You can also set up recurring invoices for retainer clients and send automated payment reminders."
        },
        {
          question: "How does time tracking work?",
          answer: "Built-in time tracking allows you to log hours manually or use our timer feature. Track billable vs non-billable hours, categorize time by project phases, and automatically generate timesheets for client reporting and invoice creation."
        },
        {
          question: "What kind of analytics and reports can I generate?",
          answer: "ClientConnect provides comprehensive dashboards with project progress charts, revenue analytics, client profitability reports, time utilization metrics, and success rate trends. All reports can be exported as PDFs or shared with clients."
        }
      ]
    },
    {
      title: "Client Management",
      icon: Users,
      color: "from-purple-500 to-pink-500",
      faqs: [
        {
          question: "How many clients can I manage?",
          answer: "There's no limit to the number of clients you can manage. Our platform is designed to scale with your business, whether you have 5 clients or 500. Performance remains optimal regardless of your client base size."
        },
        {
          question: "Can clients access their project information?",
          answer: "Yes! You can create client portals where clients can view project progress, timelines, invoices, and communicate directly. You control what information is visible to each client, ensuring privacy and professionalism."
        },
        {
          question: "How do I organize multiple projects for the same client?",
          answer: "Each client can have unlimited projects. Organize them by status (active, completed, on-hold), priority levels, or custom tags. Use our project templates to quickly set up similar projects and maintain consistency."
        },
        {
          question: "Can I collaborate with team members on client projects?",
          answer: "Absolutely! Invite team members with role-based permissions (admin, manager, contributor). Team members can track time, update project status, and communicate with clients while maintaining proper access controls."
        }
      ]
    },
    {
      title: "Security & Privacy",
      icon: Shield,
      color: "from-red-500 to-orange-500",
      faqs: [
        {
          question: "How secure is my data?",
          answer: "Your data is protected with enterprise-grade security. We use Firebase for authentication and data storage, ensuring 99.9% uptime, automatic backups, and SOC 2 compliance. All data is encrypted in transit and at rest."
        },
        {
          question: "Who can access my client information?",
          answer: "Only you and team members you explicitly invite can access your data. We never share, sell, or access your client information. Each account is completely isolated with strict access controls."
        },
        {
          question: "Can I export my data if I decide to leave?",
          answer: "Yes! You own your data completely. Export all client information, projects, time logs, and invoices in standard formats (CSV, PDF, JSON) at any time. No lock-in, no hassle."
        },
        {
          question: "Do you comply with GDPR and privacy regulations?",
          answer: "Yes, ClientConnect is fully GDPR compliant. We provide data processing agreements, allow data deletion requests, and maintain transparent privacy policies. Your clients' privacy rights are fully protected."
        }
      ]
    },
    {
      title: "Pricing & Billing",
      icon: CreditCard,
      color: "from-indigo-500 to-blue-500",
      faqs: [
        {
          question: "What are your pricing plans?",
          answer: "We offer flexible pricing: Starter ($9/month) for solo freelancers, Professional ($19/month) for small teams, and Enterprise ($39/month) for agencies. All plans include core features with increasing limits and advanced capabilities."
        },
        {
          question: "Can I change my plan anytime?",
          answer: "Yes! Upgrade or downgrade your plan anytime. Changes take effect immediately, and we'll prorate any billing adjustments. No contracts or cancellation fees."
        },
        {
          question: "Do you offer discounts for annual payments?",
          answer: "Yes! Save 20% when you pay annually. We also offer special discounts for students, non-profits, and early-stage startups. Contact our support team for eligibility."
        },
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for annual plans. All payments are processed securely through Stripe."
        }
      ]
    },
    {
      title: "Technical Support",
      icon: HelpCircle,
      color: "from-teal-500 to-green-500",
      faqs: [
        {
          question: "What kind of support do you provide?",
          answer: "We offer comprehensive support including email support, live chat during business hours, detailed documentation, video tutorials, and community forums. Premium plans include priority support with faster response times."
        },
        {
          question: "Is there training available?",
          answer: "Yes! We provide free onboarding sessions for new users, comprehensive video tutorials, and detailed guides for all features. Enterprise customers get dedicated training sessions and account management."
        },
        {
          question: "What if I encounter a bug or issue?",
          answer: "Report bugs through our in-app feedback system, email, or live chat. We prioritize bug fixes and typically resolve issues within 24-48 hours. Critical issues are addressed immediately."
        },
        {
          question: "Do you provide API access for integrations?",
          answer: "Yes! Our REST API allows integration with popular tools like Slack, Zapier, QuickBooks, and custom applications. API documentation and SDKs are available for developers."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <HelpCircle size={16} />
              Get Your Questions Answered
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Everything you need to know about ClientConnect. Cant find what youre looking for? 
              <a href="#contact" className="text-blue-600 hover:text-blue-700 font-medium"> Contact our support team</a>.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="space-y-12">
          {faqCategories.map((category, categoryIndex) => {
            const Icon = category.icon;
            return (
              <div key={categoryIndex} className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                {/* Category Header */}
                <div className={`bg-gradient-to-r ${category.color} p-6`}>
                  <div className="flex items-center gap-3 text-white">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <Icon size={20} />
                    </div>
                    <h2 className="text-2xl font-bold">{category.title}</h2>
                  </div>
                </div>

                {/* FAQ Items */}
                <div className="divide-y divide-slate-100">
                  {category.faqs.map((faq, faqIndex) => {
                    const itemKey = `${categoryIndex}-${faqIndex}`;
                    const isOpen = openItems[itemKey];
                    
                    return (
                      <div key={faqIndex} className="transition-all duration-200">
                        <button
                          onClick={() => toggleItem(itemKey)}
                          className="w-full px-6 py-5 text-left hover:bg-slate-50 transition-colors focus:outline-none focus:bg-slate-50"
                        >
                          <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-slate-800 pr-4">
                              {faq.question}
                            </h3>
                            <div className="flex-shrink-0">
                              {isOpen ? (
                                <ChevronUp size={20} className="text-slate-400" />
                              ) : (
                                <ChevronDown size={20} className="text-slate-400" />
                              )}
                            </div>
                          </div>
                        </button>
                        
                        {isOpen && (
                          <div className="px-6 pb-5">
                            <div className="pt-2 border-t border-slate-100">
                              <p className="text-slate-600 leading-relaxed">
                                {faq.answer}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact Section */}
        <div id="contact" className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Still Have Questions?</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Our support team is here to help! Get in touch and well respond within 24 hours.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@clientconnect.com"
              className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105"
            >
              <Mail size={18} />
              Email Support
            </a>
            <button className="inline-flex items-center gap-2 bg-white text-blue-600 hover:bg-gray-50 px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105">
              <MessageCircle size={18} />
              Live Chat
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-slate-100">
            <div className="text-2xl font-bold text-blue-600 mb-2">24h</div>
            <div className="text-sm text-slate-600">Average Response Time</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-slate-100">
            <div className="text-2xl font-bold text-green-600 mb-2">98%</div>
            <div className="text-sm text-slate-600">Customer Satisfaction</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-slate-100">
            <div className="text-2xl font-bold text-purple-600 mb-2">500+</div>
            <div className="text-sm text-slate-600">Questions Answered Daily</div>
          </div>
        </div>
      </div>
    </div>
  );
}