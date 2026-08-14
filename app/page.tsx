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
  CalendarCheck 
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
            
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-widest text-teal-700 bg-teal-50 px-3.5 py-1.5 rounded-full border border-teal-200">
                Core Digital Services
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E3A5F] tracking-tight">
                Comprehensive Healthcare Access
              </h2>
              <p className="text-slate-600 text-base">
                Discover the primary services provided through the Bharosa Lab digital platform.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Service 1 */}
              <div className="bg-[#F8FAFC] hover:bg-white rounded-3xl p-7 border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                    <FlaskConical className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1E3A5F]">Lab Tests</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Discover available laboratory tests and book diagnostic services directly through the Bharosa Lab platform.
                  </p>
                </div>
                <div className="pt-6">
                  <Link href="/services" className="text-xs font-bold text-blue-600 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
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
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
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
                    <Stethoscope className="w-6 h-6" />
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
            
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-widest text-blue-700 bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200">
                Patient Journey
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E3A5F] tracking-tight">
                How Bharosa Lab Works
              </h2>
              <p className="text-slate-600 text-base">
                Your seamless 4-step journey to simplified healthcare access.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
              
              {/* Step 1 */}
              <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm space-y-4">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-extrabold text-sm flex items-center justify-center shadow-xs">
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
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-extrabold text-sm flex items-center justify-center shadow-xs">
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
                <span className="text-xs font-extrabold uppercase tracking-widest text-teal-700 bg-teal-50 px-3.5 py-1.5 rounded-full border border-teal-200">
                  For Patients & Families
                </span>
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
                    className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-bold text-white bg-[#1E3A5F] hover:bg-slate-900 rounded-xl transition-all shadow-md cursor-pointer"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Get the Bharosa Lab App</span>
                  </a>
                </div>
              </div>

              <div className="lg:col-span-6 bg-gradient-to-br from-blue-50/70 via-teal-50/40 to-slate-50 rounded-3xl p-8 sm:p-10 border border-teal-100 shadow-lg space-y-6">
                <h3 className="text-xl font-bold text-[#1E3A5F]">Why Patients Trust Bharosa Lab</h3>
                <div className="space-y-4">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-start gap-4">
                    <ShieldCheck className="w-6 h-6 text-blue-600 flex-shrink-0" />
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
                <span className="text-xs font-extrabold uppercase tracking-widest text-teal-300 bg-teal-400/10 px-3.5 py-1.5 rounded-full border border-teal-300/30">
                  Diagnostic Laboratories
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                  Bring Your Laboratory Online.
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
        {/* DOCTORS SHOWCASE WITH REAL CLINICAL DOCTOR PHOTOGRAPHY                 */}
        {/* ========================================================================= */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-br from-[#1E3A5F] via-[#0F172A] to-slate-950 rounded-3xl p-8 sm:p-12 lg:p-14 text-white border border-slate-800 shadow-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                
                <div className="lg:col-span-7 space-y-6">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-teal-300 bg-teal-500/20 px-3.5 py-1.5 rounded-full border border-teal-400/30">
                    Healthcare Professionals
                  </span>
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

                  <div className="pt-4 flex flex-wrap items-center gap-3">
                    <Link
                      href="/doctors"
                      className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-bold text-white bg-teal-600 hover:bg-teal-500 rounded-xl transition-all shadow-lg shadow-teal-600/30"
                    >
                      <span>Join as a Doctor</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      href="/doctors#join-form"
                      className="px-6 py-3.5 text-sm font-bold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl border border-white/15 transition-all"
                    >
                      Doctor Registration Form
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
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
                Sustainable Healthcare Impact
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E3A5F] tracking-tight">
                Global Goals & SDG Alignment
              </h2>
              <p className="text-slate-600 text-base leading-relaxed">
                Bharosa Lab aims to use digital technology and healthcare partnerships to make diagnostic and medical consultation services easier to access across communities.
              </p>
            </div>

            {/* SDG Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
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
            
            <div className="text-center space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-widest text-teal-700 bg-teal-50 px-3.5 py-1.5 rounded-full border border-teal-200">
                Help & Information
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E3A5F] tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="text-slate-600 text-sm sm:text-base">
                Find quick answers to common questions about Bharosa Lab services, lab onboarding, and consultations.
              </p>
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
            
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-teal-200 border border-white/20">
                <HeartPulse className="w-4 h-4 text-teal-300" />
                Bharosa Lab Ecosystem
              </span>
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
                className="px-8 py-4 text-sm sm:text-base font-bold text-[#1E3A5F] bg-white hover:bg-teal-50 rounded-2xl transition-all shadow-lg shadow-black/20 flex items-center gap-2 cursor-pointer"
              >
                <Smartphone className="w-4 h-4 text-teal-600" />
                <span>Download the App</span>
              </a>

              <Link
                href="/login"
                className="px-8 py-4 text-sm sm:text-base font-bold text-white bg-teal-600 hover:bg-teal-500 rounded-2xl transition-all shadow-md flex items-center gap-2"
              >
                <Building2 className="w-4 h-4" />
                <span>Become a Partner Lab</span>
              </Link>

              <Link
                href="/doctors"
                className="px-8 py-4 text-sm sm:text-base font-bold text-white bg-slate-900/80 hover:bg-slate-900 border border-white/20 rounded-2xl transition-all shadow-md flex items-center gap-2"
              >
                <Stethoscope className="w-4 h-4" />
                <span>Join as a Doctor</span>
              </Link>
            </div>

          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}