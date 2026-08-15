import React from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  Building2, 
  Stethoscope, 
  Globe2, 
  ArrowRight, 
  ArrowUpRight,
  ShieldCheck, 
  CheckCircle2, 
  Phone, 
  MessageCircle, 
  Mail, 
  Sparkles,
  HeartPulse,
  Award,
  Layers
} from 'lucide-react';

export const metadata = {
  title: "Partner With Us | Bharosa Lab",
  description: "Collaborate with Bharosa Lab: Onboard your diagnostic laboratory, join our verified doctor network, or partner on institutional healthcare initiatives.",
};

export default function PartnerWithUsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-slate-900">
      <Navbar />

      <main className="flex-1">
        
        {/* Page Header */}
        <section className="bg-gradient-to-b from-[#1E3A5F]/5 via-white to-white py-16 sm:py-20 border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <h1 className="text-3xl sm:text-5xl font-black text-[#1E3A5F] tracking-tight">
              Partner With Bharosa Lab
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              We collaborate with diagnostic laboratories, medical doctors, and institutional health organizations to build connected, transparent, and accessible digital healthcare infrastructure.
            </p>
          </div>
        </section>

        {/* 3 Partnership Tracks */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E3A5F]">
                Three Ways to Collaborate
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Track 1: Partner Laboratory */}
              <div className="bg-[#F8FAFC] rounded-3xl p-8 border border-slate-200 hover:border-teal-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6 group">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#1E3A5F] text-white flex items-center justify-center shadow-md shadow-slate-900/20 group-hover:scale-105 transition-transform">
                    <Building2 className="w-6 h-6 text-teal-300" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1E3A5F]">Diagnostic Laboratories</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Join our diagnostic network to receive patient orders, process doorstep sample collections, and upload digital PDF reports via the dedicated Lab Portal.
                  </p>
                  <ul className="space-y-2.5 text-xs text-slate-700 pt-2 font-medium">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                      <span>Dedicated SaaS Lab Portal Workspace</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                      <span>Dynamic test catalog & pricing control</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                      <span>Direct digital report distribution</span>
                    </li>
                  </ul>
                </div>
                <Link
                  href="/login"
                  className="w-full py-3.5 text-center text-sm font-bold text-white bg-[#1E3A5F] hover:bg-slate-900 rounded-xl transition-colors shadow-md shadow-slate-900/20 flex items-center justify-center gap-2"
                >
                  <span>Onboard Your Lab</span>
                  <ArrowRight className="w-4 h-4 text-teal-400" />
                </Link>
              </div>

              {/* Track 2: Healthcare Professionals / Doctors */}
              <div className="bg-[#F8FAFC] rounded-3xl p-8 border border-slate-200 hover:border-teal-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6 group">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-600/20 group-hover:scale-105 transition-transform">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1E3A5F]">Medical Doctors</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Provide telemedicine consultations, review diagnostic laboratory findings, and connect with patients seeking expert clinical reviews.
                  </p>
                  <ul className="space-y-2.5 text-xs text-slate-700 pt-2 font-medium">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>Custom consultation fees & schedule slots</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>Direct tele-consultation platform</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>Lab test results review access</span>
                    </li>
                  </ul>
                </div>
                <a
                  href="https://bharosa-doctor.vercel.app/auth"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 text-center text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-colors shadow-md shadow-teal-600/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Doctor Portal Login</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>

              {/* Track 3: Institutional & Health SDGs */}
              <div className="bg-[#F8FAFC] rounded-3xl p-8 border border-slate-200 hover:border-emerald-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6 group">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#4C9F38] text-white flex items-center justify-center shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
                    <Globe2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1E3A5F]">Institutional & SDGs</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Collaborate on community healthcare access, corporate employee health packages, mobile diagnostic outreach, and measurable SDG health impacts.
                  </p>
                  <ul className="space-y-2.5 text-xs text-slate-700 pt-2 font-medium">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>Strategic focus on SDG 3, 9, 10 & 17</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>Corporate & community screening programs</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>Healthcare equality outreach</span>
                    </li>
                  </ul>
                </div>
                <a
                  href="https://wa.me/923141811158"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 text-center text-sm font-bold text-white bg-[#4C9F38] hover:bg-emerald-700 rounded-xl transition-colors shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Discuss Institutional Partnership</span>
                </a>
              </div>

            </div>

          </div>
        </section>


        {/* Direct Institutional Partnership & Contact Center */}
        <section className="py-16 bg-[#F8FAFC] border-t border-slate-200/80">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="bg-gradient-to-br from-[#1E3A5F] via-[#112233] to-[#0D9488]/40 rounded-3xl p-8 sm:p-12 text-white border border-teal-500/30 shadow-2xl space-y-8">
              
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                  Connect Directly With Our Partnership Team
                </h2>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  Whether you represent a clinical diagnostic laboratory, medical center, corporate entity, or healthcare initiative, reach out directly to explore collaboration.
                </p>
              </div>

              {/* 3 Direct Contact Action Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                
                {/* WhatsApp */}
                <a
                  href="https://wa.me/923141811158"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-6 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-teal-500/30 hover:border-teal-400 transition-all text-center space-y-3 group shadow-md"
                >
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform border border-emerald-500/30">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">WhatsApp Chat</h4>
                    <p className="text-xs text-slate-400 mt-1">Instant partnership inquiries</p>
                  </div>
                  <span className="inline-block text-xs font-mono font-bold text-teal-300 bg-teal-950/60 px-3 py-1 rounded-lg border border-teal-800">
                    03141811158
                  </span>
                </a>

                {/* Phone Call */}
                <a
                  href="tel:03141811158"
                  className="p-6 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-teal-500/30 hover:border-teal-400 transition-all text-center space-y-3 group shadow-md"
                >
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform border border-blue-500/30">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">Direct Helpline</h4>
                    <p className="text-xs text-slate-400 mt-1">Call our support desk</p>
                  </div>
                  <span className="inline-block text-xs font-mono font-bold text-teal-300 bg-teal-950/60 px-3 py-1 rounded-lg border border-teal-800">
                    03141811158
                  </span>
                </a>

                {/* Email Support */}
                <Link
                  href="/contact"
                  className="p-6 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-teal-500/30 hover:border-teal-400 transition-all text-center space-y-3 group shadow-md"
                >
                  <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform border border-teal-500/30">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">Contact Desk</h4>
                    <p className="text-xs text-slate-400 mt-1">Submit institutional query</p>
                  </div>
                  <span className="inline-block text-xs font-bold text-teal-300 bg-teal-950/60 px-3 py-1 rounded-lg border border-teal-800">
                    Contact Page →
                  </span>
                </Link>

              </div>

            </div>

          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
