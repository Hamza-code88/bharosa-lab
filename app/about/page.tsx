import React from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  Building2, 
  Stethoscope, 
  Globe2, 
  Users, 
  Activity, 
  Sparkles, 
  HeartHandshake,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export const metadata = {
  title: "About Us | Bharosa Lab",
  description: "Learn about Bharosa Lab's mission to make healthcare access simpler, connected, and reliable through technology and healthcare partnerships.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-slate-900">
      <Navbar />

      <main className="flex-1">
        
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-[#1E3A5F]/5 via-white to-white py-16 sm:py-24 border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <h1 className="text-3xl sm:text-5xl font-black text-[#1E3A5F] tracking-tight">
              What is Bharosa Lab?
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Bharosa Lab is a digital healthcare platform connecting patients, diagnostic laboratories, and healthcare professionals into a unified healthcare ecosystem.
            </p>
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Mission Card */}
              <div className="bg-[#F8FAFC] rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#1E3A5F] text-white flex items-center justify-center shadow-md">
                  <Activity className="w-6 h-6 text-teal-300" />
                </div>
                <h2 className="text-2xl font-bold text-[#1E3A5F]">Our Mission</h2>
                <p className="text-base text-slate-600 leading-relaxed">
                  “To make healthcare access simpler, more connected, and more convenient through technology and trusted healthcare partnerships.”
                </p>
              </div>

              {/* Vision Card */}
              <div className="bg-[#1E3A5F] text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-xl space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-500 text-[#1E3A5F] flex items-center justify-center shadow-md font-black">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-white">Our Vision</h2>
                <p className="text-base text-slate-300 leading-relaxed">
                  “To build a connected healthcare ecosystem where people can access essential diagnostic and medical services through a simple digital platform.”
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* The 4-Pillar Ecosystem */}
        <section className="py-20 bg-[#F8FAFC] border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            
            <div className="text-center max-w-3xl mx-auto space-y-2">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E3A5F] tracking-tight">
                The Bharosa Lab Ecosystem
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* 1. Patients */}
              <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm space-y-4 text-center sm:text-left">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 text-teal-600 flex items-center justify-center mx-auto sm:mx-0">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#1E3A5F]">Patients & Families</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Receive streamlined access to book tests, arrange home collections, download digital reports, and consult doctors.
                </p>
              </div>

              {/* 2. Partner Labs */}
              <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm space-y-4 text-center sm:text-left">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 text-[#1E3A5F] flex items-center justify-center mx-auto sm:mx-0">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#1E3A5F]">Diagnostic Labs</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Digitize their catalog, manage patient sample orders, upload results, and track operational metrics in one portal.
                </p>
              </div>

              {/* 3. Doctors */}
              <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm space-y-4 text-center sm:text-left">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center mx-auto sm:mx-0">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#1E3A5F]">Doctors</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Offer remote consultations, review diagnostic findings, and provide structured clinical guidance to patients.
                </p>
              </div>

              {/* 4. Healthcare Partners */}
              <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm space-y-4 text-center sm:text-left">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 text-teal-700 flex items-center justify-center mx-auto sm:mx-0">
                  <Globe2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#1E3A5F]">Healthcare Partners</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Collaborate on community healthcare access, tech-enabled clinical outreach, and health SDG initiatives.
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* Global Impact Summary */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E3A5F] tracking-tight">
              Building Trust in Healthcare
            </h2>
            <p className="text-slate-600 text-base leading-relaxed">
              Bharosa Lab is not replacing laboratories or doctors. It connects patients with healthcare providers and gives partner laboratories and doctors digital tools to participate in a connected healthcare ecosystem.
            </p>
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/partner-with-us"
                className="px-6 py-3.5 text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-all shadow-md"
              >
                Join Our Network
              </Link>
              <Link
                href="/contact"
                className="px-6 py-3.5 text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
              >
                Contact Our Team
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
