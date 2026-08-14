import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ShieldCheck, Lock } from 'lucide-react';

export const metadata = {
  title: "Privacy Policy | Bharosa Lab",
  description: "Learn how Bharosa Lab protects and handles your personal and medical information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-slate-900">
      <Navbar />

      <main className="flex-1 py-16 sm:py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-8">
            
            <div className="border-b border-slate-100 pb-6 space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                <ShieldCheck className="w-3.5 h-3.5" />
                Data Protection & Privacy
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Privacy Policy
              </h1>
              <p className="text-xs text-slate-400">
                Official Policy • Bharosa Lab Digital Healthcare Platform
              </p>
            </div>

            <div className="space-y-6 text-sm text-slate-600 leading-relaxed">
              
              <section className="space-y-2">
                <h2 className="text-lg font-bold text-slate-900">1. Introduction</h2>
                <p>
                  Welcome to <strong>Bharosa Lab</strong> (“Where Trust Makes Life Easier”). We value your trust and are committed to safeguarding your personal and medical diagnostic data. This Privacy Policy outlines our standards for collecting, managing, and securing information across our mobile applications, web portals, and diagnostic booking channels.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-lg font-bold text-slate-900">2. Information We Collect</h2>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li><strong>Personal Identification:</strong> Name, contact phone/WhatsApp, age, and gender to identify patients and coordinate sample collection.</li>
                  <li><strong>Address & Location Data:</strong> Explicit address and approximate GPS coordinates provided solely to facilitate phlebotomist visits for home sample collection.</li>
                  <li><strong>Diagnostic Test Data:</strong> Booked test names, requested dates, and digital laboratory test reports uploaded by authorized partner laboratories.</li>
                  <li><strong>Professional Practitioner Data:</strong> Qualifications, specialization, and contact details for registered participating doctors and lab partners.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h2 className="text-lg font-bold text-slate-900">3. Purpose and Use of Data</h2>
                <p>Collected data is processed strictly for the following functional purposes:</p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>Routing test bookings and sample collection requests to selected partner laboratories and trained collection personnel.</li>
                  <li>Delivering verified digital PDF diagnostic reports to the patient&apos;s authenticated account.</li>
                  <li>Enabling secure tele-consultation between patients and participating healthcare professionals.</li>
                  <li>Communicating operational status updates via SMS, push notifications, or WhatsApp.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h2 className="text-lg font-bold text-slate-900">4. Confidentiality & Security</h2>
                <p>
                  Bharosa Lab does not sell, lease, or monetize personal health information to third-party advertisers. All diagnostic records are accessible strictly to authorized partner laboratories fulfilling the test, consulting doctors assigned by the patient, and the patient themselves. We implement encrypted data transit and modern access controls to protect against unauthorized data disclosure.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-lg font-bold text-slate-900">5. Account Deletion & Rights</h2>
                <p>
                  Users retain the right to request deletion of their account profile and personal data at any time. Requests can be submitted via the contact channels on our website or by contacting support at <strong>03141811158</strong>. Identifiable medical reports are purged from active indexing within standard retention limits, barring mandatory statutory auditing records.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-lg font-bold text-slate-900">6. Contact Information</h2>
                <p>
                  For questions or privacy concerns regarding this policy, please contact our administrative team at <strong>03141811158</strong> or through our official contact page.
                </p>
              </section>

            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
