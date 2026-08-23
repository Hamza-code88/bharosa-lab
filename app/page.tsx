import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HeroInteractiveSync from './components/HeroInteractiveSync';
import FAQAccordion from './components/FAQAccordion';
import { allFaqs } from '@/lib/faqData';
import { 
  FlaskConical, 
  Home as HomeIcon, 
  FileText, 
  Stethoscope, 
  Smartphone, 
  ArrowRight, 
  CheckCircle2, 
  Building2, 
  UserCheck, 
  Globe2, 
  ShieldCheck, 
  Clock, 
  Layers, 
  TrendingUp, 
  Activity, 
  HeartPulse, 
  Laptop, 
  Search, 
  Bot, 
  Star, 
  Sparkles, 
  Award, 
  ChevronRight, 
  Shield, 
  Microscope, 
  PhoneCall, 
  CalendarCheck,
  ArrowUpRight
} from 'lucide-react';
import logo from '../public/logo.png';

export const metadata = {
  title: "Bharosa Lab | Where Trust Makes Life Easier",
  description: "Discover laboratory tests, arrange home sample collection, access digital reports, and connect with qualified doctors through Bharosa Lab's digital healthcare platform.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] font-sans text-slate-900 selection:bg-teal-500 selection:text-white">
      <Navbar />

      <main className="flex-1">
        
        {/* ========================================================================= */}
        {/* HERO SECTION WITH SYNCHRONIZED FADE-IN TEXT & SMARTPHONE SLIDER           */}
        {/* ========================================================================= */}
        <HeroInteractiveSync />


        {/* ========================================================================= */}
        {/* CORE SERVICES SECTION                                                     */}
        {/* ========================================================================= */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            
            <div className="text-center max-w-3xl mx-auto space-y-2">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E3A5F] tracking-tight">
                Our Healthcare Services
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Service 1 */}
              <div className="bg-[#F8FAFC] hover:bg-white rounded-3xl p-7 border border-slate-200 hover:border-teal-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#1E3A5F] text-white flex items-center justify-center shadow-md shadow-slate-900/20 group-hover:scale-105 transition-transform">
                    <FlaskConical className="w-6 h-6 text-teal-300" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1E3A5F]">Lab Tests</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Discover available laboratory tests and book diagnostic services directly through the Bharosa Lab platform.
                  </p>
                </div>
                <div className="pt-6">
                  <Link href="/services" className="text-xs font-bold text-teal-600 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                    <span>Learn More</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Service 2 */}
              <div className="bg-[#F8FAFC] hover:bg-white rounded-3xl p-7 border border-slate-200 hover:border-teal-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
                    <HomeIcon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1E3A5F]">Home Sample Collection</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    For eligible diagnostic tests, request professional sample collection directly from your home.
                  </p>
                </div>
                <div className="pt-6">
                  <Link href="/services" className="text-xs font-bold text-teal-600 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                    <span>Learn More</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Service 3 */}
              <div className="bg-[#F8FAFC] hover:bg-white rounded-3xl p-7 border border-slate-200 hover:border-emerald-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#4C9F38] text-white flex items-center justify-center shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1E3A5F]">Digital Reports</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Receive and access verified laboratory test reports digitally through the platform according to implemented workflows.
                  </p>
                </div>
                <div className="pt-6">
                  <Link href="/services" className="text-xs font-bold text-emerald-600 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                    <span>Learn More</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Service 4 */}
              <div className="bg-[#F8FAFC] hover:bg-white rounded-3xl p-7 border border-slate-200 hover:border-[#1E3A5F] hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#1E3A5F] text-white flex items-center justify-center shadow-md shadow-slate-900/20 group-hover:scale-105 transition-transform">
                    <Stethoscope className="w-6 h-6 text-teal-300" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1E3A5F]">Doctor Consultation</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Connect with participating qualified doctors for online medical consultations and health guidance.
                  </p>
                </div>
                <div className="pt-6">
                  <Link href="/doctors" className="text-xs font-bold text-[#1E3A5F] inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                    <span>Learn More</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

            </div>

          </div>
        </section>


        {/* ========================================================================= */}
        {/* HOW BHAROSA LAB WORKS (4-Step Patient Journey)                           */}
        {/* ========================================================================= */}
        <section className="py-20 bg-[#F8FAFC] border-y border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
            
            <div className="text-center max-w-3xl mx-auto space-y-2">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E3A5F] tracking-tight">
                How Bharosa Lab Works
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
              
              {/* Step 1 */}
              <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm space-y-4">
                <div className="w-10 h-10 rounded-xl bg-[#1E3A5F] text-white font-extrabold text-sm flex items-center justify-center shadow-xs">
                  1
                </div>
                <h3 className="text-lg font-bold text-[#1E3A5F]">Choose a Service</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Browse available diagnostic tests, home collection options, or participating doctor consultation slots.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm space-y-4">
                <div className="w-10 h-10 rounded-xl bg-teal-600 text-white font-extrabold text-sm flex items-center justify-center shadow-xs">
                  2
                </div>
                <h3 className="text-lg font-bold text-[#1E3A5F]">Book via Platform</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Place your booking securely through the Bharosa Lab platform with your required details.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm space-y-4">
                <div className="w-10 h-10 rounded-xl bg-[#4C9F38] text-white font-extrabold text-sm flex items-center justify-center shadow-xs">
                  3
                </div>
                <h3 className="text-lg font-bold text-[#1E3A5F]">Receive the Service</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Have samples collected at home (where eligible) or visit the partner lab, or attend your scheduled consultation.
                </p>
              </div>

              {/* Step 4 */}
              <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm space-y-4">
                <div className="w-10 h-10 rounded-xl bg-[#1E3A5F] text-white font-extrabold text-sm flex items-center justify-center shadow-xs">
                  4
                </div>
                <h3 className="text-lg font-bold text-[#1E3A5F]">Access Reports & Advice</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Retrieve verified digital reports directly on your device and review advice with your medical practitioner.
                </p>
              </div>

            </div>

          </div>
        </section>


        {/* ========================================================================= */}
        {/* PATIENTS SECTION: Healthcare Made Easier for You                          */}
        {/* ========================================================================= */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              <div className="lg:col-span-6 space-y-6">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E3A5F] tracking-tight leading-tight">
                  Healthcare Made Easier for You
                </h2>
                <p className="text-slate-600 text-base leading-relaxed">
                  We bridge the distance between you and trusted medical diagnostics. Manage essential health appointments without unnecessary clinic travel or paperwork stress.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                  {[
                    "Convenient access to healthcare services",
                    "Less unnecessary clinic travel",
                    "Easy laboratory test booking",
                    "Home sample collection where available",
                    "Verified digital test reports",
                    "Live online doctor consultations",
                    "Centralized access through Bharosa Lab app"
                  ].map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-sm text-slate-700 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <a
                    href="https://play.google.com/store"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 px-7 py-3.5 text-sm font-bold text-white bg-[#1E3A5F] hover:bg-slate-900 rounded-xl transition-all shadow-md cursor-pointer active:scale-95"
                  >
                    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none">
                      <path d="M4.06 2.15C3.76 2.47 3.59 2.97 3.59 3.63V20.37C3.59 21.03 3.76 21.53 4.06 21.85L4.13 21.92L13.51 12.54V12.46V12.38L4.13 3L4.06 2.15Z" fill="#00D3FF"/>
                      <path d="M16.63 15.66L13.51 12.54V12.38L16.63 9.26L16.73 9.32L20.43 11.42C21.49 12.02 21.49 13.01 20.43 13.61L16.73 15.71L16.63 15.66Z" fill="#FFD300"/>
                      <path d="M16.73 15.71L13.51 12.46L4.06 21.92C4.41 22.29 5.01 22.34 5.69 21.95L16.73 15.71Z" fill="#FF3A44"/>
                      <path d="M16.73 9.32L5.69 3.08C5.01 2.69 4.41 2.74 4.06 3.11L13.51 12.57L16.73 9.32Z" fill="#00E676"/>
                    </svg>
                    <span>Get the Bharosa Lab App</span>
                  </a>
                </div>
              </div>

              <div className="lg:col-span-6 bg-[#F8FAFC] rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-lg space-y-6">
                <h3 className="text-xl font-bold text-[#1E3A5F]">Why Patients Trust Bharosa Lab</h3>
                <div className="space-y-4">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-start gap-4">
                    <ShieldCheck className="w-6 h-6 text-[#1E3A5F] flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">Reliable Diagnostic Network</h4>
                      <p className="text-xs text-slate-500 mt-1">Book tests with recognized and registered laboratory partners.</p>
                    </div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-start gap-4">
                    <Clock className="w-6 h-6 text-teal-600 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">Time & Travel Efficiency</h4>
                      <p className="text-xs text-slate-500 mt-1">Save valuable time by arranging home visits and digital report delivery.</p>
                    </div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-start gap-4">
                    <Layers className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">All-in-One Digital History</h4>
                      <p className="text-xs text-slate-500 mt-1">Keep track of your family&apos;s reports and medical appointments in one place.</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>


        {/* ========================================================================= */}
        {/* PARTNER LAB SECTION: Bring Your Laboratory Online                        */}
        {/* ========================================================================= */}
        <section className="py-20 bg-[#1E3A5F] text-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              <div className="lg:col-span-7 space-y-6">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                  Bring Your Laboratory Online
                </h2>
                <p className="text-slate-200 text-base sm:text-lg leading-relaxed">
                  Join Bharosa Lab as a Partner Lab and gain access to a dedicated digital platform to manage your online presence, expand patient reach, and streamline report submissions.
                </p>

                {/* Benefits checklist */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                  {[
                    "Reach new potential patients",
                    "Create & manage digital lab profile",
                    "Manage available tests and services",
                    "Receive patient sample orders",
                    "Submit reports through the Lab Portal",
                    "Track completed tests & order history",
                    "Track Bharosa Lab-related earnings",
                    "Centralized laboratory information"
                  ].map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-sm text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-4">
                  <Link
                    href="/login"
                    className="px-7 py-3.5 text-sm font-bold text-[#1E3A5F] bg-teal-400 hover:bg-teal-300 rounded-xl transition-all shadow-lg shadow-teal-500/20"
                  >
                    Become a Partner Lab
                  </Link>
                  <Link
                    href="/partner-labs"
                    className="px-7 py-3.5 text-sm font-bold text-white bg-slate-900/60 hover:bg-slate-900 border border-slate-600 rounded-xl transition-all"
                  >
                    Explore Lab Features
                  </Link>
                </div>
              </div>

              {/* Lab Visual Card with Real Clinical Laboratory Image */}
              <div className="lg:col-span-5 space-y-4">
                <div className="relative h-[260px] sm:h-[300px] rounded-3xl overflow-hidden shadow-2xl border-2 border-teal-500/30">
                  <Image
                    src="https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&auto=format&fit=crop&q=75"
                    alt="Clinical Medical Laboratory Instruments"
                    fill
                    unoptimized
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/30 to-transparent" />
                  
                  <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-teal-500 text-white flex items-center justify-center">
                        <Microscope size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">Diagnostic Laboratory Portal</p>
                        <p className="text-[10px] text-slate-400">Order management & PDF report uploads</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-teal-400 bg-teal-950 px-2 py-0.5 rounded border border-teal-800">
                      SaaS Active
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700 text-xs text-slate-300 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Enterprise Workflow:</strong> You continue operating your laboratory while Bharosa Lab delivers incoming sample orders and digital distribution channels.
                  </span>
                </div>
              </div>

            </div>

          </div>
        </section>


        {/* ========================================================================= */}
        {/* DOCTORS SHOWCASE WITH DIRECT DOCTOR PORTAL REDIRECT                    */}
        {/* ========================================================================= */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-br from-[#1E3A5F] via-[#0F172A] to-slate-950 rounded-3xl p-8 sm:p-12 lg:p-14 text-white border border-slate-800 shadow-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                
                <div className="lg:col-span-7 space-y-6">
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                    Join the Bharosa Lab Healthcare Network
                  </h2>
                  <p className="text-slate-300 text-base leading-relaxed">
                    Qualified participating doctors can offer online consultations through the Bharosa Lab digital channel, connecting with patients seeking professional medical guidance and diagnostic test interpretation.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-300 pt-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-400" />
                      <span>Doctor Profile & Bio</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-400" />
                      <span>Consultation Availability Controls</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-400" />
                      <span>Online Tele-Consultation Channel</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-400" />
                      <span>Patient Consultation Management</span>
                    </div>
                  </div>

                  {/* Direct portal redirect */}
                  <div className="pt-4 flex flex-wrap items-center gap-3">
                    <a
                      href="https://bharosa-doctor.vercel.app/auth"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2.5 px-7 py-3.5 text-sm font-bold text-[#1E3A5F] bg-teal-400 hover:bg-teal-300 rounded-xl transition-all shadow-lg shadow-teal-500/25 cursor-pointer active:scale-98"
                    >
                      <Stethoscope className="w-4 h-4" />
                      <span>Join as a Doctor</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                    
                    <Link
                      href="/doctors"
                      className="px-6 py-3.5 text-sm font-bold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl border border-white/15 transition-all flex items-center gap-1.5"
                    >
                      <span>Doctor Network Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Doctor Visual Card */}
                <div className="lg:col-span-5 relative">
                  <div className="relative h-[320px] sm:h-[360px] rounded-3xl overflow-hidden shadow-2xl border-2 border-teal-500/30 group">
                    <Image
                      src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&auto=format&fit=crop&q=75"
                      alt="Qualified Medical Doctor with Stethoscope"
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
                    
                    <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-700 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-teal-500 text-white flex items-center justify-center">
                          <Stethoscope size={18} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">Telemedicine Network</p>
                          <p className="text-[10px] text-slate-400">Verified doctor consultations</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                        PMDC Verified
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>


        {/* ========================================================================= */}
        {/* HEALTHCARE IMPACT & SDG THEMATIC CARDS                                */}
        {/* ========================================================================= */}
        <section className="py-20 bg-gradient-to-b from-slate-50 to-white border-t border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E3A5F] tracking-tight">
                Global Goals & SDG Alignment
              </h2>
              <p className="text-slate-600 text-base leading-relaxed">
                Bharosa Lab aims to use digital technology and healthcare partnerships to make diagnostic and medical consultation services easier to access across communities.
              </p>
            </div>

            {/* SDG Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              
              {/* SDG 1 */}
              <div className="bg-white rounded-3xl p-6 border-2 border-red-200 shadow-sm hover:shadow-md transition-all space-y-4 relative overflow-hidden group">
                <div className="h-1.5 bg-[#E5243B] absolute top-0 left-0 right-0" />
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#E5243B] text-white font-black text-sm flex items-center justify-center shadow-md shadow-red-600/20">
                    SDG 1
                  </div>
                  <span className="text-[10px] font-bold text-[#E5243B] uppercase tracking-wider bg-red-50 px-2 py-0.5 rounded-md">
                    2% Healthcare Pledge
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">No Poverty</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Pledging 2% of future platform earnings to sponsor essential diagnostic tests and consultations for underprivileged families.
                  </p>
                </div>
              </div>

              {/* SDG 3 */}
              <div className="bg-white rounded-3xl p-6 border-2 border-emerald-200 shadow-sm hover:shadow-md transition-all space-y-4 relative overflow-hidden group">
                <div className="h-1.5 bg-[#4C9F38] absolute top-0 left-0 right-0" />
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#4C9F38] text-white font-black text-sm flex items-center justify-center shadow-md shadow-emerald-600/20">
                    SDG 3
                  </div>
                  <span className="text-[10px] font-bold text-[#4C9F38] uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-md">
                    Primary Focus
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Good Health & Well-Being</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Expanding convenient access to timely diagnostic testing and qualified medical consultation.
                  </p>
                </div>
              </div>

              {/* SDG 9 */}
              <div className="bg-white rounded-3xl p-6 border-2 border-amber-200 shadow-sm hover:shadow-md transition-all space-y-4 relative overflow-hidden group">
                <div className="h-1.5 bg-[#F36D25] absolute top-0 left-0 right-0" />
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#F36D25] text-white font-black text-sm flex items-center justify-center shadow-md shadow-amber-600/20">
                    SDG 9
                  </div>
                  <span className="text-[10px] font-bold text-[#F36D25] uppercase tracking-wider bg-amber-50 px-2 py-0.5 rounded-md">
                    Infrastructure
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Industry & Innovation</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Providing modern digital infrastructure for local pathology laboratories to operate digitally.
                  </p>
                </div>
              </div>

              {/* SDG 10 */}
              <div className="bg-white rounded-3xl p-6 border-2 border-rose-200 shadow-sm hover:shadow-md transition-all space-y-4 relative overflow-hidden group">
                <div className="h-1.5 bg-[#DD1367] absolute top-0 left-0 right-0" />
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#DD1367] text-white font-black text-sm flex items-center justify-center shadow-md shadow-rose-600/20">
                    SDG 10
                  </div>
                  <span className="text-[10px] font-bold text-[#DD1367] uppercase tracking-wider bg-rose-50 px-2 py-0.5 rounded-md">
                    Equitable Access
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Reduced Inequalities</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Mitigating geographic and travel barriers for elderly, busy, or remote patient populations.
                  </p>
                </div>
              </div>

              {/* SDG 17 */}
              <div className="bg-white rounded-3xl p-6 border-2 border-blue-200 shadow-sm hover:shadow-md transition-all space-y-4 relative overflow-hidden group">
                <div className="h-1.5 bg-[#19486A] absolute top-0 left-0 right-0" />
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#19486A] text-white font-black text-sm flex items-center justify-center shadow-md shadow-blue-900/20">
                    SDG 17
                  </div>
                  <span className="text-[10px] font-bold text-[#19486A] uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded-md">
                    Collaboration
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Partnerships for Goals</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Fostering collaborative partnerships between laboratories, medical professionals, and institutions.
                  </p>
                </div>
              </div>

            </div>

            <p className="text-center text-xs text-slate-500 italic max-w-2xl mx-auto">
              *The Sustainable Development Goals (SDGs) are referenced solely as thematic areas of strategic alignment and do not imply official United Nations endorsement or certification.
            </p>

          </div>
        </section>


        {/* ========================================================================= */}
        {/* FAQ PREVIEW                                                               */}
        {/* ========================================================================= */}
        <section className="py-20 bg-white border-t border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            
            <div className="text-center space-y-2">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E3A5F] tracking-tight">
                Frequently Asked Questions
              </h2>
            </div>

            <FAQAccordion items={allFaqs} limit={5} />

            <div className="text-center pt-4">
              <Link
                href="/faq"
                className="inline-flex items-center gap-2 text-sm font-bold text-teal-700 hover:text-teal-800 hover:underline"
              >
                <span>View all frequently asked questions</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </section>


        {/* ========================================================================= */}
        {/* FINAL CONVERSION BANNER                                                */}
        {/* ========================================================================= */}
        <section className="py-20 bg-gradient-to-r from-[#1E3A5F] via-[#112233] to-[#0D9488] text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
            
            <div className="space-y-3">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                Make Healthcare Easier Today
              </h2>
              <p className="text-slate-200 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                Connect with our unified healthcare platform as a patient, partner laboratory, or participating doctor.
              </p>
            </div>

            {/* 3 Conversion Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <a
                href="https://play.google.com/store"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 text-sm sm:text-base font-bold text-[#1E3A5F] bg-white hover:bg-teal-50 rounded-2xl transition-all shadow-lg shadow-black/20 flex items-center gap-2.5 cursor-pointer active:scale-95"
              >
                <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none">
                  <path d="M4.06 2.15C3.76 2.47 3.59 2.97 3.59 3.63V20.37C3.59 21.03 3.76 21.53 4.06 21.85L4.13 21.92L13.51 12.54V12.46V12.38L4.13 3L4.06 2.15Z" fill="#00D3FF"/>
                  <path d="M16.63 15.66L13.51 12.54V12.38L16.63 9.26L16.73 9.32L20.43 11.42C21.49 12.02 21.49 13.01 20.43 13.61L16.73 15.71L16.63 15.66Z" fill="#FFD300"/>
                  <path d="M16.73 15.71L13.51 12.46L4.06 21.92C4.41 22.29 5.01 22.34 5.69 21.95L16.73 15.71Z" fill="#FF3A44"/>
                  <path d="M16.73 9.32L5.69 3.08C5.01 2.69 4.41 2.74 4.06 3.11L13.51 12.57L16.73 9.32Z" fill="#00E676"/>
                </svg>
                <span>Download the App</span>
              </a>

              <Link
                href="/login"
                className="px-8 py-4 text-sm sm:text-base font-bold text-white bg-teal-600 hover:bg-teal-500 rounded-2xl transition-all shadow-md flex items-center gap-2"
              >
                <Building2 className="w-4 h-4" />
                <span>Become a Partner Lab</span>
              </Link>

              <a
                href="https://bharosa-doctor.vercel.app/auth"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 text-sm sm:text-base font-bold text-white bg-slate-900/80 hover:bg-slate-900 border border-white/20 rounded-2xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Stethoscope className="w-4 h-4" />
                <span>Join as a Doctor</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>

          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}