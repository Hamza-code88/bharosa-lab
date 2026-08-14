import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FileCheck, ShieldAlert } from 'lucide-react';

export const metadata = {
  title: "Terms & Conditions | Bharosa Lab",
  description: "Terms and conditions governing the use of the Bharosa Lab digital healthcare platform.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-slate-900">
      <Navbar />

      <main className="flex-1 py-16 sm:py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-8">
            
            <div className="border-b border-slate-100 pb-6 space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                <FileCheck className="w-3.5 h-3.5" />
                Platform Legal Agreement
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Terms & Conditions
              </h1>
              <p className="text-xs text-slate-400">
                Official Terms • Bharosa Lab Digital Healthcare Platform
              </p>
            </div>

            <div className="space-y-6 text-sm text-slate-600 leading-relaxed">
              
              <section className="space-y-2">
                <h2 className="text-lg font-bold text-slate-900">1. Acceptance of Terms</h2>
                <p>
                  By accessing or utilizing the Bharosa Lab website, mobile application, or partner portals, you agree to comply with and be bound by these Terms and Conditions. If you do not agree to these terms, please refrain from using the platform.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-lg font-bold text-slate-900">2. Nature of Platform & Medical Scope</h2>
                <p>
                  Bharosa Lab operates as a digital healthcare platform that connects patients with licensed third-party diagnostic laboratories and qualified healthcare professionals. 
                </p>
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Medical Disclaimer:</strong> Bharosa Lab does not independently operate a physical medical laboratory or prescribe clinical treatments. All laboratory diagnostics and tele-consultation advice are rendered solely by independent, licensed partner laboratories and medical practitioners. The platform is not intended for acute emergency medical care.
                  </span>
                </div>
              </section>

              <section className="space-y-2">
                <h2 className="text-lg font-bold text-slate-900">3. Diagnostic Bookings & Home Sample Collection</h2>
                <p>
                  Patients booking tests through the platform agree to provide accurate identification and contact details. For home sample collections, personnel operate under standard handling protocols; however, service availability remains subject to geographic and operational coverage.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-lg font-bold text-slate-900">4. Partner Laboratory & Doctor Responsibilities</h2>
                <p>
                  Participating partner laboratories and medical professionals agree to maintain valid licensing, execute diagnostic testing in accordance with medical standards, and upload authentic and timely reports to the digital portal.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-lg font-bold text-slate-900">5. Modifications and Contact</h2>
                <p>
                  Bharosa Lab reserves the right to amend these Terms to reflect ongoing platform enhancements. For any queries concerning these Terms, contact our administration at <strong>03141811158</strong>.
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
