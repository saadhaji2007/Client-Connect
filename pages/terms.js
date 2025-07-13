import Layout from "./components/layout";
import Head from "next/head";

export default function TermsOfService() {
  return (
    <>
      <Head>
        <title>Terms of Service | ClientConnect</title>
      </Head>
      <Layout>
        <div className="bg-gradient-to-br from-white to-purple-50 min-h-screen text-gray-800 py-12 px-6 md:px-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-extrabold text-purple-700 mb-6 border-b pb-2">
              Terms of Service
            </h1>
            <p className="mb-6">
              These Terms of Service ("Terms") govern your access to and use of
              ClientConnect. By using our platform, you agree to be bound by
              these Terms.
            </p>

            <Section
              title="1. Account Responsibilities"
              content="Users are responsible for maintaining the confidentiality of their account and any activity under it. You agree to provide accurate and complete information during registration."
            />

            <Section
              title="2. Use of Service"
              content="ClientConnect allows you to manage client information and projects. You agree not to misuse the platform by uploading illegal, harmful, or misleading content."
            />

            <Section
              title="3. Prohibited Activities"
              content="You may not reverse-engineer, scrape, or attempt to hack the system. Any violation may result in account suspension or legal action."
            />

            <Section
              title="4. Termination"
              content="We reserve the right to suspend or delete your account if we believe you've violated these terms or harmed the integrity of our platform."
            />

            <Section
              title="5. Limitation of Liability"
              content="ClientConnect is provided 'as-is'. We are not responsible for data loss, errors, or service interruptions. Always back up important information."
            />

            <Section
              title="6. Governing Law"
              content="These terms are governed by the laws of your local jurisdiction. Any disputes will be handled by the appropriate courts."
            />

            <Section
              title="7. Changes to Terms"
              content="We may update these Terms from time to time. Continued use of the service after changes means you agree to the new terms."
            />

            <p className="text-sm text-gray-500 mt-10">Last updated: July 12, 2025</p>
          </div>
        </div>
      </Layout>
    </>
  );
}

function Section({ title, content }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-semibold text-purple-600 mb-2">{title}</h2>
      <p className="text-gray-700 leading-relaxed">{content}</p>
    </div>
  );
}
