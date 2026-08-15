import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  Building2, 
  CheckCircle2, 
  ArrowRight, 
  Microscope,
  FileCheck,
  TrendingUp,
  ShieldCheck,
  Smartphone,
  ChevronRight
} from 'lucide-react';

export const metadata = {
  title: "Partner Labs | Bharosa Lab",
  description: "Grow your laboratory with Bharosa Lab. Digital presence, test catalog management, order processing, and digital report delivery.",
};

const tenBenefits = [
  {
    num: "01",
    title: "New Patient Reach",
    desc: "Connect with patients searching for diagnostic tests and home sample collection across your serviced areas."
  },
  {
    num: "02",
    title: "Digital Lab Profile",
    desc: "Build an official digital presence for your pathology laboratory with verified branding and location details."
  },
  {
    num: "03",
    title: "Test & Service Management",
    desc: "Maintain your catalog of tests, diagnostic profiles, and customize pricing directly from your dashboard."
  },
  {
    num: "04",
    title: "Patient & Test Orders",
    desc: "Receive structured booking notifications with patient details and requested diagnostic services."
  },
  {
    num: "05",
    title: "Digital Report Submission",
    desc: "Upload secure PDF diagnostic reports directly to the patient's digital account once testing is completed."
  },
  {
    num: "06",
    title: "Dedicated Lab Portal",
    desc: "A purpose-built SaaS workspace allowing your team to oversee test workflow and status transitions."
  },
  {
    num: "07",
    title: "Order Tracking",
    desc: "Monitor bookings across lifecycle states: pending, sample collected, report uploaded, and completed."
  },
  {
    num: "08",
    title: "Earnings Tracking",
    desc: "Clear visibility over platform-generated test revenue and commission breakdowns per billing period."
  },
  {
    num: "09",
    title: "Earning History",
    desc: "Access historical ledger records and archived payment summaries for complete financial clarity."
  },
  {
    num: "10",
    title: "Centralized Lab Management",
    desc: "Keep all your digital operations, tests, and patient communications organized under one simple dashboard."
  }
];

export default function PartnerLabsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-slate-900">
      <Navbar />

      <main className="flex-1">
        
        {/* Hero Section with Laboratory Photography */}
        <section className="bg-gradient-to-b from-[#1E3A5F] via-slate-900 to-slate-950 text-white py-16 sm:py-24 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                  Grow Your Laboratory With Bharosa Lab
                </h1>

                <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0">
                  Bharosa Lab provides laboratories with a digital channel to reach patients, manage laboratory information, process orders, submit reports, and track their activity and earnings.
                </p>

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                  <Link
                    href="/login"
                    className="px-8 py-4 text-base font-bold text-[#1E3A5F] bg-teal-400 hover:bg-teal-300 rounded-2xl transition-all shadow-xl shadow-teal-500/20 cursor-pointer"
                  >
                    Become a Partner Lab
                  </Link>
                  <Link
                    href="#workflow"
                    className="px-8 py-4 text-base font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-2xl transition-all"
                  >
                    View Workflow
                  </Link>
                </div>
              </div>

              {/* Lab Visual Card */}
              <div className="lg:col-span-5 relative">
                <div className="relative h-[300px] sm:h-[340px] rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-700/80 group">
                  <Image
                    src="https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&auto=format&fit=crop&q=75"
                    alt="Clinical Medical Laboratory Instruments"
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
                  
                  <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-700 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <Microscope className="w-5 h-5 text-teal-400" />
                      <span className="font-bold text-white">Diagnostic Laboratory Portal</span>
                    </div>
                    <span className="text-[10px] font-bold text-teal-400 bg-teal-950 px-2 py-0.5 rounded border border-teal-800">
                      SaaS Active
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Strong Statement Card */}
        <section className="py-10 bg-teal-50/60 border-b border-teal-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-base sm:text-lg font-semibold text-[#1E3A5F] leading-relaxed">
              &ldquo;You continue running your laboratory operations while Bharosa Lab provides an additional digital channel for patient access and workflow management.&rdquo;
            </p>
          </div>
        </section>

        {/* 10 Core Benefits Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
            
            <div className="text-center max-w-3xl mx-auto space-y-2">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E3A5F] tracking-tight">
                10 Core Advantages for Partner Labs
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tenBenefits.map((benefit) => (
                <div 
                  key={benefit.num}
                  className="bg-[#F8FAFC] hover:bg-white rounded-3xl p-7 border border-slate-200 hover:border-teal-300 hover:shadow-xl transition-all duration-200 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <span className="text-xs font-black text-teal-600 font-mono tracking-widest">
                      {benefit.num}
                    </span>
                    <h3 className="text-lg font-bold text-[#1E3A5F]">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {benefit.desc}
                    </p>
                  </div>
                  <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold text-teal-700">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Included in Partner Portal</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* Workflow Diagram Section */}
        <section id="workflow" className="py-20 bg-[#1E3A5F] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            
            <div className="text-center max-w-3xl mx-auto space-y-2">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                How The Partner Workflow Operates
              </h2>
            </div>

            {/* Visual Workflow Steps */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              
              <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-700 text-center space-y-2">
                <span className="text-xs font-bold text-teal-400 uppercase">Step 1</span>
                <p className="text-sm font-extrabold text-white">Patient</p>
                <p className="text-[11px] text-slate-400">Selects diagnostic test</p>
              </div>

              <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-700 text-center space-y-2">
                <span className="text-xs font-bold text-teal-400 uppercase">Step 2</span>
                <p className="text-sm font-extrabold text-white">Bharosa Lab</p>
                <p className="text-[11px] text-slate-400">Routes booking order</p>
              </div>

              <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-700 text-center space-y-2">
                <span className="text-xs font-bold text-teal-400 uppercase">Step 3</span>
                <p className="text-sm font-extrabold text-white">Partner Lab</p>
                <p className="text-[11px] text-slate-400">Accepts sample & order</p>
              </div>

              <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-700 text-center space-y-2">
                <span className="text-xs font-bold text-teal-400 uppercase">Step 4</span>
                <p className="text-sm font-extrabold text-white">Test Processing</p>
                <p className="text-[11px] text-slate-400">Lab conducts diagnostic analysis</p>
              </div>

              <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-700 text-center space-y-2">
                <span className="text-xs font-bold text-teal-400 uppercase">Step 5</span>
                <p className="text-sm font-extrabold text-white">Report Upload</p>
                <p className="text-[11px] text-slate-400">Lab submits PDF via portal</p>
              </div>

              <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-700 text-center space-y-2">
                <span className="text-xs font-bold text-emerald-400 uppercase">Step 6</span>
                <p className="text-sm font-extrabold text-emerald-400">Patient</p>
                <p className="text-[11px] text-slate-400">Receives verified digital result</p>
              </div>

            </div>

            <div className="text-center pt-6">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-8 py-4 text-base font-bold text-[#1E3A5F] bg-teal-400 hover:bg-teal-300 rounded-2xl transition-all shadow-xl shadow-teal-500/20"
              >
                <span>Become a Partner Lab</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
