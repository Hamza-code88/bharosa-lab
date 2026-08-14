"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Smartphone, 
  ArrowRight, 
  CheckCircle2, 
  Search, 
  ShieldCheck, 
  Home as HomeIcon, 
  FileText, 
  FlaskConical, 
  Stethoscope, 
  ChevronRight, 
  HeartPulse, 
  Globe2, 
  Users, 
  Building2, 
  Award,
  Microscope
} from 'lucide-react';

interface HeroSlide {
  id: number;
  badge: string;
  badgeColor: string;
  title: string;
  titleGradient: string;
  description: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  isPrimaryExternal: boolean;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  highlights: string[];
  // Mockup card details
  mockupTag: string;
  mockupTitle: string;
  mockupSubtitle: string;
  mockupGradient: string;
  mockupBtn: string;
  mockupIcon: any;
}

const heroSlides: HeroSlide[] = [
  {
    id: 0,
    badge: "Official Mobile Application",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    title: "Healthcare Services, Connected in One App.",
    titleGradient: "from-blue-600 via-teal-600 to-indigo-600",
    description: "Discover laboratory tests, arrange home sample collection, access digital reports, and connect with qualified doctors through the official Bharosa Lab mobile app.",
    primaryCtaText: "Download the App",
    primaryCtaLink: "https://play.google.com/store",
    isPrimaryExternal: true,
    secondaryCtaText: "Explore Platform",
    secondaryCtaLink: "/about",
    highlights: ["Official Google Play App", "Centralized Patient Portal", "Instant Digital Access"],
    mockupTag: "Bharosa Lab App",
    mockupTitle: "Digital Healthcare Hub",
    mockupSubtitle: "All diagnostic & doctor services in one app",
    mockupGradient: "from-blue-600 via-teal-600 to-[#1E3A5F]",
    mockupBtn: "Get Mobile App",
    mockupIcon: Smartphone
  },
  {
    id: 1,
    badge: "Diagnostic Laboratories & Phlebotomy",
    badgeColor: "bg-teal-50 text-teal-800 border-teal-200",
    title: "Accredited Lab Tests & Home Blood Collection.",
    titleGradient: "from-teal-600 via-emerald-600 to-blue-600",
    description: "Avoid unnecessary clinic travel. Request certified sample collectors to visit your home and receive fast, verified digital PDF reports directly on your mobile device.",
    primaryCtaText: "Book a Test in App",
    primaryCtaLink: "https://play.google.com/store",
    isPrimaryExternal: true,
    secondaryCtaText: "Explore Lab Tests",
    secondaryCtaLink: "/services",
    highlights: ["Cold-Chain Sample Transit", "Doorstep Phlebotomist Visits", "Direct PDF Reports"],
    mockupTag: "Home Phlebotomy",
    mockupTitle: "Book Blood Tests at Home",
    mockupSubtitle: "Certified phlebotomist visits at your doorstep",
    mockupGradient: "from-teal-600 via-emerald-600 to-[#1E3A5F]",
    mockupBtn: "Book Test",
    mockupIcon: FlaskConical
  },
  {
    id: 2,
    badge: "Qualified Medical Doctors",
    badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
    title: "Connect with Qualified Doctors in Real Time.",
    titleGradient: "from-indigo-600 via-blue-600 to-teal-600",
    description: "Get professional medical advice, review diagnostic laboratory results, and consult experienced general practitioners and specialists remotely from anywhere.",
    primaryCtaText: "Consult a Doctor",
    primaryCtaLink: "/doctors",
    isPrimaryExternal: false,
    secondaryCtaText: "Join as a Doctor",
    secondaryCtaLink: "/doctors#join-form",
    highlights: ["Licensed Medical Doctors", "Lab Report Review", "Live Tele-Consultations"],
    mockupTag: "Live Telemedicine",
    mockupTitle: "Consult Qualified Doctors",
    mockupSubtitle: "Online medical reviews & clinical guidance",
    mockupGradient: "from-indigo-600 via-blue-600 to-[#1E3A5F]",
    mockupBtn: "Consult Doctor",
    mockupIcon: Stethoscope
  },
  {
    id: 3,
    badge: "Healthcare Impact & Global SDGs",
    badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
    title: "Advancing Accessible Health & Global SDGs.",
    titleGradient: "from-emerald-600 via-teal-600 to-blue-700",
    description: "Leveraging digital health infrastructure and institutional partnerships aligned with SDG 3, 9, 10, and 17 to reduce healthcare inequalities and improve community access.",
    primaryCtaText: "Partner With Us",
    primaryCtaLink: "/partner-with-us",
    isPrimaryExternal: false,
    secondaryCtaText: "View SDG Alignment",
    secondaryCtaLink: "/about",
    highlights: ["SDG 3: Good Health & Well-being", "SDG 9: Innovation", "SDG 17: Partnerships"],
    mockupTag: "Global Health SDGs",
    mockupTitle: "Aligned with Health SDGs",
    mockupSubtitle: "Good Health & Reduced Inequalities (SDG 3 & 10)",
    mockupGradient: "from-emerald-600 via-teal-600 to-[#1E3A5F]",
    mockupBtn: "Explore Impact",
    mockupIcon: Globe2
  }
];

export default function HeroInteractiveSync() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setActiveSlide((prev) => (prev + 1) % heroSlides.length);
        setIsFading(false);
      }, 250);
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  const selectSlide = (index: number) => {
    if (index === activeSlide) return;
    setIsFading(true);
    setTimeout(() => {
      setActiveSlide(index);
      setIsFading(false);
    }, 200);
  };

  const slide = heroSlides[activeSlide];
  const MockupIcon = slide.mockupIcon;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#1E3A5F]/5 via-white to-[#F8FAFC] py-12 sm:py-16 lg:py-20 border-b border-slate-200/80">
      
      {/* Ambient Background Glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-40 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top 4 Interactive Tabs: App Info | Labs Service | Doctors | SDGs */}
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-slate-200/70">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {[
              { label: "App Info", icon: Smartphone },
              { label: "Labs Service", icon: FlaskConical },
              { label: "Doctors", icon: Stethoscope },
              { label: "Health SDGs", icon: Globe2 }
            ].map((tab, idx) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={idx}
                  onClick={() => selectSlide(idx)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    activeSlide === idx
                      ? 'bg-[#1E3A5F] text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <TabIcon size={13} className={activeSlide === idx ? 'text-teal-300' : 'text-slate-400'} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <span className="text-xs text-slate-400 font-semibold hidden sm:inline">
            Ecosystem Sync <span className="text-teal-600 font-bold">•</span>
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center min-h-[460px]">
          
          {/* ========================================================================= */}
          {/* LEFT COLUMN: SYNCHRONIZED TEXT WITH FADE                                  */}
          {/* ========================================================================= */}
          <div className={`lg:col-span-7 space-y-6 text-center lg:text-left transition-all duration-300 transform ${
            isFading ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
          }`}>
            
            {/* Dynamic Badge */}
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold border shadow-xs transition-colors ${slide.badgeColor}`}>
              <HeartPulse className="w-3.5 h-3.5" />
              <span>{slide.badge}</span>
            </div>

            {/* Dynamic Animated Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-black text-[#1E3A5F] tracking-tight leading-[1.12]">
              <span className={`text-transparent bg-clip-text bg-gradient-to-r ${slide.titleGradient}`}>
                {slide.title}
              </span>
            </h1>

            {/* Dynamic Description */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
              {slide.description}
            </p>

            {/* Dynamic Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              {slide.isPrimaryExternal ? (
                <a
                  href={slide.primaryCtaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 text-sm sm:text-base font-bold text-white bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 rounded-2xl transition-all shadow-lg shadow-blue-500/25 active:scale-98 cursor-pointer"
                >
                  <Smartphone className="w-5 h-5" />
                  <span>{slide.primaryCtaText}</span>
                </a>
              ) : (
                <Link
                  href={slide.primaryCtaLink}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 text-sm sm:text-base font-bold text-white bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 rounded-2xl transition-all shadow-lg shadow-blue-500/25 active:scale-98"
                >
                  <span>{slide.primaryCtaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}

              <Link
                href={slide.secondaryCtaLink}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-sm sm:text-base font-bold text-[#1E3A5F] hover:text-teal-700 bg-white hover:bg-slate-50 border border-slate-200 hover:border-teal-300 rounded-2xl transition-all shadow-xs"
              >
                <span>{slide.secondaryCtaText}</span>
                <ArrowRight className="w-4 h-4 text-teal-600" />
              </Link>
            </div>

            {/* Dynamic Highlights */}
            <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs text-slate-600 font-semibold">
              {slide.highlights.map((h, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                  <span>{h}</span>
                </span>
              ))}
            </div>

          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: SYNCHRONIZED SMARTPHONE MOCKUP                              */}
          {/* ========================================================================= */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[340px] sm:max-w-[360px]">
              
              {/* Ambient Glow Halo */}
              <div className="absolute -inset-3 bg-gradient-to-tr from-blue-600/30 via-teal-500/20 to-indigo-600/30 rounded-[48px] blur-xl -z-10" />

              {/* Smartphone Frame */}
              <div className="bg-slate-950 p-3 rounded-[46px] shadow-2xl border-4 border-slate-800 ring-1 ring-slate-700/50">
                
                {/* Screen Container */}
                <div className="bg-[#F8FAFC] rounded-[38px] overflow-hidden border border-slate-200 flex flex-col text-left select-none text-slate-800 shadow-inner">
                  
                  {/* Top Status Bar & Dynamic Island */}
                  <div className="bg-white px-6 pt-3 pb-2 flex justify-between items-center border-b border-slate-100">
                    <span className="text-[11px] font-bold text-slate-800">9:41</span>
                    <div className="w-20 h-4 bg-slate-900 rounded-full flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full bg-slate-800" />
                    </div>
                    <div className="flex items-center gap-1 text-slate-700">
                      <span className="text-[10px] font-bold">5G</span>
                      <div className="w-3.5 h-2 border border-slate-700 rounded-xs p-0.5 flex items-center">
                        <div className="w-full h-full bg-slate-700 rounded-xs" />
                      </div>
                    </div>
                  </div>

                  {/* In-App Header */}
                  <div className="bg-white px-5 pt-3 pb-3 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-400 leading-none">Welcome to</p>
                      <h3 className="text-xl font-black tracking-tight mt-0.5">
                        <span className="text-blue-600">Bharosa</span> <span className="text-[#1E3A5F]">Lab</span>
                      </h3>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-[#1E3A8A] text-white font-black text-sm flex items-center justify-center shadow-xs">
                      U
                    </div>
                  </div>

                  {/* Search Bar + Verified Doctors Channel */}
                  <div className="px-4 py-2 bg-white flex items-center gap-2 border-b border-slate-100">
                    <div className="flex-1 bg-slate-100 rounded-xl px-3 py-2 flex items-center gap-2 text-slate-400 text-xs">
                      <Search size={14} className="text-slate-400" />
                      <span>Search tests, doctors...</span>
                    </div>
                    <div className="px-2.5 py-1.5 rounded-xl bg-teal-50 border border-teal-100 flex flex-col items-center">
                      <Stethoscope size={13} className="text-teal-700" />
                      <span className="text-[9px] font-bold text-teal-800">Doctors</span>
                    </div>
                  </div>

                  {/* Features Quick-Pill Bar */}
                  <div className="px-4 py-2 bg-slate-50 flex items-center justify-between text-[10px] text-slate-600 border-b border-slate-100 font-medium">
                    <span className={`flex items-center gap-1 font-bold ${activeSlide === 1 ? 'text-teal-600' : 'text-slate-600'}`}>
                      <FlaskConical size={11} /> Lab Tests
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className={`flex items-center gap-1 font-bold ${activeSlide === 2 ? 'text-indigo-600' : 'text-slate-600'}`}>
                      <Stethoscope size={11} /> Doctors
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className={`flex items-center gap-1 font-bold ${activeSlide === 3 ? 'text-emerald-600' : 'text-slate-600'}`}>
                      <Globe2 size={11} /> SDGs
                    </span>
                  </div>

                  {/* Synchronized Card inside Phone */}
                  <div className="p-3.5">
                    <div className={`bg-gradient-to-r ${slide.mockupGradient} rounded-2xl p-4 text-white shadow-md relative overflow-hidden transition-all duration-500`}>
                      <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full" />
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                          {slide.mockupTag}
                        </span>
                        <MockupIcon size={16} className="text-white/90" />
                      </div>
                      <p className="text-sm font-extrabold mt-2 leading-tight">
                        {slide.mockupTitle}
                      </p>
                      <p className="text-[10px] text-blue-100 mt-0.5 leading-snug">
                        {slide.mockupSubtitle}
                      </p>
                      
                      <div className="mt-3 flex items-center justify-between">
                        <div className="bg-white text-[#1E3A5F] font-bold text-[10px] px-3 py-1 rounded-lg shadow-xs flex items-center gap-1">
                          <span>{slide.mockupBtn}</span>
                          <ChevronRight size={10} />
                        </div>

                        {/* Slider Progress Dots */}
                        <div className="flex items-center gap-1">
                          {heroSlides.map((_, i) => (
                            <button
                              key={i}
                              onClick={() => selectSlide(i)}
                              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                                activeSlide === i ? 'w-4 bg-white' : 'w-1.5 bg-white/40'
                              }`}
                              aria-label={`Slide ${i + 1}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Partner Labs & Doctors Preview */}
                  <div className="px-4 pb-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-black text-slate-800">Verified Healthcare Network</p>
                      <span className="text-[10px] font-bold text-teal-600">VIEW ALL</span>
                    </div>
                    
                    <div className="space-y-1.5">
                      <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                            <FlaskConical size={16} />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800 leading-none">Diagnostic Partner Lab</p>
                            <p className="text-[9px] text-slate-400 mt-0.5">Accredited Pathology Testing</p>
                          </div>
                        </div>
                        <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md">
                          ★ 4.9
                        </span>
                      </div>

                      <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
                            <Stethoscope size={16} />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800 leading-none">Qualified Medical Doctor</p>
                            <p className="text-[9px] text-slate-400 mt-0.5">Live Tele-Consultation Clinic</p>
                          </div>
                        </div>
                        <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                          Verified
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Mockup Bottom Navigation Bar */}
                  <div className="bg-white px-5 py-2.5 border-t border-slate-100 flex justify-between items-center text-[9px] text-slate-400 font-bold">
                    <div className={`flex flex-col items-center ${activeSlide === 0 ? 'text-blue-600' : 'text-slate-400'}`}>
                      <HomeIcon size={14} />
                      <span>Home</span>
                    </div>
                    <div className={`flex flex-col items-center ${activeSlide === 1 ? 'text-teal-600' : 'text-slate-400'}`}>
                      <FlaskConical size={14} />
                      <span>Tests</span>
                    </div>
                    <div className={`flex flex-col items-center ${activeSlide === 2 ? 'text-indigo-600' : 'text-slate-400'}`}>
                      <Stethoscope size={14} />
                      <span>Doctors</span>
                    </div>
                    <div className={`flex flex-col items-center ${activeSlide === 3 ? 'text-emerald-600' : 'text-slate-400'}`}>
                      <Globe2 size={14} />
                      <span>Impact</span>
                    </div>
                  </div>

                  {/* Home Indicator Bar */}
                  <div className="bg-white py-1 flex justify-center">
                    <div className="w-24 h-1 bg-slate-300 rounded-full" />
                  </div>

                </div>

              </div>

            </div>
          </div>

        </div>

      </div>

    </section>
  );
}
