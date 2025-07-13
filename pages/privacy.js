import Head from "next/head";
// import Footer from "./components/footer";
import { ShieldCheck, Lock, Users, Settings, AlertTriangle, RefreshCw } from "lucide-react";
import Layout from "./components/layout";

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>Privacy Policy | ClientConnect</title>
      </Head>
      <Layout>
      <div className="bg-white min-h-screen flex flex-col justify-between text-gray-800">
        <main className="max-w-5xl mx-auto py-12 px-6 md:px-12">
          <h1 className="text-5xl font-bold mb-6 text-purple-700 text-center">Privacy Policy</h1>
          <p className="mb-8 text-center text-lg text-gray-600">
            At <strong>ClientConnect</strong>, your privacy is not just a policy — it's a promise.
          </p>

          {/* Section 1 */}
          <Section icon={<Users className="w-6 h-6 text-purple-600" />} title="1. Information We Collect">
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>Your name and email address when you sign up</li>
              <li>Client and project information you enter</li>
              <li>Usage data such as page views, interactions, and device info</li>
            </ul>
          </Section>

          {/* Section 2 */}
          <Section icon={<Settings className="w-6 h-6 text-purple-600" />} title="2. How We Use Your Data">
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>To provide and maintain your account</li>
              <li>To organize your client and project data</li>
              <li>To improve our service based on usage analytics</li>
              <li>To send important updates or transactional emails</li>
            </ul>
          </Section>

          {/* Section 3 */}
          <Section icon={<Lock className="w-6 h-6 text-purple-600" />} title="3. Data Protection">
            <p>
              All data is securely stored in the cloud using Firebase. We use strong authentication measures to protect access and never sell your data to third parties.
            </p>
          </Section>

          {/* Section 4 */}
          <Section icon={<ShieldCheck className="w-6 h-6 text-purple-600" />} title="4. Third-Party Services">
            <p>
              We use trusted tools like Firebase and Google Analytics, which may collect data under their privacy policies. We choose partners that align with our privacy standards.
            </p>
          </Section>

          {/* Section 5 */}
          <Section icon={<AlertTriangle className="w-6 h-6 text-purple-600" />} title="5. Your Rights">
            <p>
              You can update or delete your data anytime via your account or by contacting us directly. We respect and support your data control rights.
            </p>
          </Section>

          {/* Section 6 */}
          <Section icon={<RefreshCw className="w-6 h-6 text-purple-600" />} title="6. Updates">
            <p>
              We may revise this policy over time. Continued use of ClientConnect means you accept any updates.
            </p>
          </Section>

          <p className="mt-10 text-sm text-gray-500 text-center">Last updated: July 12, 2025</p>
        </main>

      </div>
      </Layout>
    </>
  );
}

function Section({ icon, title, children }) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-2 bg-purple-100 rounded-full">{icon}</div>
        <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
      </div>
      <div className="text-gray-700">{children}</div>
    </div>
  );
}
