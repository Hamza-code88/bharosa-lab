import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  Stethoscope, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  ArrowUpRight,
  Users, 
  Calendar, 
  FileText, 
  HeartPulse, 
  Sparkles,
  PhoneCall,
  Clock,
  Award
} from 'lucide-react';

export const metadata = {
  title: "Qualified Doctors | Bharosa Lab",
  description: "Connect with verified doctors, arrange online medical reviews, and join the Bharosa Lab digital telemedicine network.",
};

export default function DoctorsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-slate-900 selection:bg-teal-500 selection:text-white">
      <Navbar />

      <main className="flex-1">
        
        {/* ========================================================================= */}
        {/* HERO SECTION FOR DOCTORS                                                  */}
        {/* ========================================================================= */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#1E3A5F]/5 via-white to-[#F8FAFC] py-16 sm:py-20 border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                <h1 className="text-3xl sm:text-5xl lg:text-[48px] font-black text-[#1E3A5F] tracking-tight leading-[1.15]">
                  Connect with Qualified Doctors in Real Time
                </h1>
                <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  Bharosa Lab provides participating healthcare professionals with a digital workspace to offer online consultations, interpret diagnostic test reports, and expand their clinical reach.
                </p>

                {/* Primary CTA redirecting to doctor portal */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <a
                    href="https://bharosa-doctor.vercel.app/auth"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 text-sm sm:text-base font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-2xl transition-all shadow-lg shadow-teal-600/25 active:scale-98 cursor-pointer"
                  >
                    <Stethoscope className="w-5 h-5" />
                    <span>Join as a Doctor</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                  
                  <a
                    href="https://bharosa-doctor.vercel.app/auth"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 text-sm sm:text-base font-bold text-[#1E3A5F] hover:text-teal-700 bg-white hover:bg-slate-50 border border-slate-200 hover:border-teal-300 rounded-2xl transition-all shadow-xs cursor-pointer"
                  >
                    <span>Doctor Portal Login</span>
                    <ArrowRight className="w-4 h-4 text-teal-600" />
                  </a>
                </div>

                <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-600 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Verified Tele-Practice
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Custom Availability & Fees
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Integrated Lab Result Review
                  </span>
                </div>
              </div>

              <div className="lg:col-span-5 relative flex justify-center">
                <div className="relative w-full max-w-md h-[320px] sm:h-[380px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                  <Image
                    src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&auto=format&fit=crop&q=75"
                    alt="Qualified Medical Doctor with Stethoscope"
                    fill
                    unoptimized
                    priority
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/95 backdrop-blur-md text-xs font-bold text-[#1E3A5F] flex items-center justify-between border border-white/50 shadow-sm">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-teal-600 flex-shrink-0" />
                      <div>
                        <p className="font-bold text-slate-900">Doctor Network</p>
                        <p className="text-[10px] text-slate-500 font-normal">Dedicated Practitioner Portal</p>
                      </div>
                    </div>
                    <span className="text-teal-800 bg-teal-50 px-2.5 py-1 rounded-lg text-[11px] font-extrabold border border-teal-200">
                      PMDC Required
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>


        {/* ========================================================================= */}
        {/* DOCTOR CAPABILITIES & PORTAL FEATURES                                     */}
        {/* ========================================================================= */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E3A5F] tracking-tight">
                Doctor Capabilities on Bharosa Lab
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-[#F8FAFC] hover:bg-white rounded-3xl p-7 border border-slate-200 hover:border-teal-300 hover:shadow-xl transition-all duration-300 space-y-4 group">
                <div className="w-12 h-12 rounded-2xl bg-[#1E3A5F] text-white flex items-center justify-center shadow-md shadow-slate-900/20 group-hover:scale-105 transition-transform">
                  <Users className="w-6 h-6 text-teal-300" />
                </div>
                <h3 className="text-lg font-bold text-[#1E3A5F]">Doctor Profile & Bio</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Showcase your medical specialization, PMDC credentials, qualifications, and clinical experience to patients seeking care.
                </p>
              </div>

              <div className="bg-[#F8FAFC] hover:bg-white rounded-3xl p-7 border border-slate-200 hover:border-teal-300 hover:shadow-xl transition-all duration-300 space-y-4 group">
                <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-600/20 group-hover:scale-105 transition-transform">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#1E3A5F]">Flexible Scheduling</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Define weekly consultation hours, appointment durations, and booking slots that seamlessly align with your hospital or clinic routine.
                </p>
              </div>

              <div className="bg-[#F8FAFC] hover:bg-white rounded-3xl p-7 border border-slate-200 hover:border-emerald-300 hover:shadow-xl transition-all duration-300 space-y-4 group">
                <div className="w-12 h-12 rounded-2xl bg-[#4C9F38] text-white flex items-center justify-center shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#1E3A5F]">Live Tele-Consultation</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Interact with patients remotely, address health queries, and deliver expert clinical guidance via secure channels.
                </p>
              </div>

              <div className="bg-[#F8FAFC] hover:bg-white rounded-3xl p-7 border border-slate-200 hover:border-[#1E3A5F] hover:shadow-xl transition-all duration-300 space-y-4 group">
                <div className="w-12 h-12 rounded-2xl bg-[#1E3A5F] text-white flex items-center justify-center shadow-md shadow-slate-900/20 group-hover:scale-105 transition-transform">
                  <FileText className="w-6 h-6 text-teal-300" />
                </div>
                <h3 className="text-lg font-bold text-[#1E3A5F]">Lab Report Review</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Access patient diagnostic results uploaded by partner laboratories to provide informed, evidence-based recommendations.
                </p>
              </div>

            </div>

          </div>
        </section>


        {/* ========================================================================= */}
        {/* DEDICATED DOCTOR ONBOARDING & PORTAL REDIRECT SECTION                     */}
        {/* ========================================================================= */}
        <section className="py-20 bg-[#F8FAFC] border-t border-slate-200/80">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="bg-gradient-to-br from-[#1E3A5F] via-[#112233] to-[#0D9488]/50 rounded-3xl p-8 sm:p-14 text-white border border-teal-500/30 shadow-2xl space-y-8 text-center relative overflow-hidden">
              
              {/* Decorative background blur */}
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 max-w-2xl mx-auto space-y-4">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  Ready to Practice on Bharosa Lab?
                </h2>
                
                <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                  Join our verified practitioner portal. Authenticate your account, set up your bio & consultation slots, and start consulting patients across the digital healthcare ecosystem.
                </p>
              </div>

              {/* 3 Step onboarding highlights */}
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4 text-left pt-2">
                <div className="bg-slate-900/70 backdrop-blur-md p-5 rounded-2xl border border-slate-700/80 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 font-black text-sm flex items-center justify-center border border-teal-500/30">
                    1
                  </div>
                  <h4 className="text-sm font-bold text-white">Sign In to Portal</h4>
                  <p className="text-xs text-slate-300">Access the doctor workspace with secure authentication.</p>
                </div>

                <div className="bg-slate-900/70 backdrop-blur-md p-5 rounded-2xl border border-slate-700/80 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 font-black text-sm flex items-center justify-center border border-teal-500/30">
                    2
                  </div>
                  <h4 className="text-sm font-bold text-white">Verify Credentials</h4>
                  <p className="text-xs text-slate-300">Add your PMDC license, medical degrees, and specialization.</p>
                </div>

                <div className="bg-slate-900/70 backdrop-blur-md p-5 rounded-2xl border border-slate-700/80 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 font-black text-sm flex items-center justify-center border border-teal-500/30">
                    3
                  </div>
                  <h4 className="text-sm font-bold text-white">Accept Consultations</h4>
                  <p className="text-xs text-slate-300">Set your consultation fees and receive patient bookings.</p>
                </div>
              </div>

              {/* Large High-Contrast CTA Button */}
              <div className="relative z-10 pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="https://bharosa-doctor.vercel.app/auth"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-4.5 text-base sm:text-lg font-black text-[#1E3A5F] bg-teal-400 hover:bg-teal-300 rounded-2xl transition-all shadow-xl shadow-teal-500/30 active:scale-98 cursor-pointer"
                >
                  <Stethoscope className="w-5 h-5" />
                  <span>Join as a Doctor Portal</span>
                  <ArrowUpRight className="w-5 h-5" />
                </a>
              </div>

              <p className="relative z-10 text-[11px] text-slate-400 max-w-lg mx-auto">
                Direct authentication link: <strong className="text-teal-300 font-mono">https://bharosa-doctor.vercel.app/auth</strong>
              </p>

            </div>

          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
