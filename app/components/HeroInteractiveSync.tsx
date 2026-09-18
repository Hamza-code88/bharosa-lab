"use client";

import React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  FlaskConical, 
  Home as HomeIcon, 
  FileText, 
  Stethoscope, 
  Building2, 
  Sparkles
} from 'lucide-react';

export default function HeroInteractiveSync() {
  const ecosystemPillars = [
    { label: "Diagnostic Labs", icon: FlaskConical },
    { label: "Home Sampling", icon: HomeIcon },
    { label: "Digital Reports", icon: FileText },
    { label: "Doctor Consultations", icon: Stethoscope },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F8FAFC] via-white to-white py-20 sm:py-28 lg:py-32 font-sans">
      {/* Soft Ambient Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[850px] h-[450px] bg-gradient-to-tr from-teal-500/10 via-blue-500/10 to-indigo-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-9">
        
        {/* Top Minimal Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100/90 border border-slate-200 text-slate-700 text-xs font-semibold backdrop-blur-sm shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>Complete Digital Healthcare Platform</span>
        </div>

        {/* Big, Modern Minimalist Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.08]">
          Modern healthcare,{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-blue-600 to-[#1E3A5F]">
            connected in one platform.
          </span>
        </h1>

        {/* Comprehensive, Clean Subtitle */}
        <p className="text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto font-normal leading-relaxed">
          Access certified pathology laboratories, professional doorstep sample collection, instant digital test reports, and qualified medical doctors — all in one unified ecosystem.
        </p>

        {/* Action Buttons: App Download, Services & Partner Portal */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
          {/* Primary CTA: App Download */}
          <a
            href="https://play.google.com/store/apps/details?id=com.hamzacode.bharosalab"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-[#1E3A5F] hover:bg-slate-900 text-white font-bold text-sm sm:text-base shadow-lg shadow-slate-900/10 hover:shadow-xl transition-all active:scale-98 cursor-pointer"
          >
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none">
              <path d="M4.06 2.15C3.76 2.47 3.59 2.97 3.59 3.63V20.37C3.59 21.03 3.76 21.53 4.06 21.85L4.13 21.92L13.51 12.54V12.46V12.38L4.13 3L4.06 2.15Z" fill="#00D3FF"/>
              <path d="M16.63 15.66L13.51 12.54V12.38L16.63 9.26L16.73 9.32L20.43 11.42C21.49 12.02 21.49 13.01 20.43 13.61L16.73 15.71L16.63 15.66Z" fill="#FFD300"/>
              <path d="M16.73 15.71L13.51 12.46L4.06 21.92C4.41 22.29 5.01 22.34 5.69 21.95L16.73 15.71Z" fill="#FF3A44"/>
              <path d="M16.73 9.32L5.69 3.08C5.01 2.69 4.41 2.74 4.06 3.11L13.51 12.57L16.73 9.32Z" fill="#00E676"/>
            </svg>
            <span>Download Patient App</span>
            <ArrowRight className="w-4 h-4 text-teal-300 ml-0.5" />
          </a>

          {/* Secondary CTA: Explore Platform Services */}
          <Link
            href="/services"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-800 font-bold text-sm sm:text-base transition-all shadow-xs"
          >
            <span>Explore Services</span>
          </Link>

          {/* Partner with Us CTA */}
          <Link
            href="/partner-with-us"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-slate-100/80 hover:bg-slate-200/70 text-slate-700 font-bold text-sm sm:text-base transition-all border border-slate-200/60"
          >
            <Building2 className="w-4 h-4 text-slate-500" />
            <span>Partner With Us</span>
          </Link>
        </div>

        {/* Minimalist 4 Ecosystem Pillars (Clean Pills, No Test Lists/Prices) */}
        <div className="pt-10 border-t border-slate-200/70 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm font-semibold text-slate-600">
          {ecosystemPillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div 
                key={idx}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200/60 hover:border-teal-300 transition-colors"
              >
                <Icon className="w-4 h-4 text-teal-600 flex-shrink-0" />
                <span className="text-slate-700">{pillar.label}</span>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
