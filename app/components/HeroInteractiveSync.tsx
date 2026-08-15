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
  Microscope,
  ArrowUpRight
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
    badgeColor: "bg-teal-50 text-teal-800 border-teal-200",
    title: "Healthcare Services, Connected in One App.",
    titleGradient: "from-[#1E3A5F] via-blue-600 to-teal-600",
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
    mockupGradient: "from-[#1E3A5F] via-blue-700 to-teal-600",
    mockupBtn: "Get Mobile App",
    mockupIcon: Smartphone
  },
  {
    id: 1,
    badge: "Diagnostic Laboratories & Phlebotomy",
    badgeColor: "bg-teal-50 text-teal-800 border-teal-200",
    title: "Accredited Lab Tests & Home Blood Collection.",
    titleGradient: "from-teal-600 via-emerald-600 to-[#1E3A5F]",
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
    badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
    title: "Connect with Qualified Doctors in Real Time.",
    titleGradient: "from-teal-600 via-blue-700 to-[#1E3A5F]",
    description: "Get professional medical advice, review diagnostic laboratory results, and consult experienced general practitioners and specialists remotely from anywhere.",
    primaryCtaText: "Consult a Doctor",
    primaryCtaLink: "/doctors",
    isPrimaryExternal: false,
    secondaryCtaText: "Join as a Doctor",
    secondaryCtaLink: "https://bharosa-doctor.vercel.app/auth",
    highlights: ["Licensed Medical Doctors", "Lab Report Review", "Live Tele-Consultations"],
    mockupTag: "Live Telemedicine",
    mockupTitle: "Consult Qualified Doctors",
    mockupSubtitle: "Online medical reviews & clinical guidance",
    mockupGradient: "from-teal-600 via-blue-600 to-[#1E3A5F]",
    mockupBtn: "Consult Doctor",
    mockupIcon: Stethoscope
  },
  {
    id: 3,
    badge: "Healthcare Impact & Global SDGs",
    badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
    title: "Advancing Accessible Health & Global SDGs.",
    titleGradient: "from-emerald-600 via-teal-600 to-[#1E3A5F]",
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
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 text-sm sm:text-base font-bold text-white bg-gradient-to-r from-[#1E3A5F] to-teal-600 hover:from-slate-900 hover:to-teal-700 rounded-2xl transition-all shadow-lg shadow-slate-900/15 active:scale-98 cursor-pointer"
                >
                  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none">
                    <path d="M4.06 2.15C3.76 2.47 3.59 2.97 3.59 3.63V20.37C3.59 21.03 3.76 21.53 4.06 21.85L4.13 21.92L13.51 12.54V12.46V12.38L4.13 3L4.06 2.15Z" fill="#00D3FF"/>
                    <path d="M16.63 15.66L13.51 12.54V12.38L16.63 9.26L16.73 9.32L20.43 11.42C21.49 12.02 21.49 13.01 20.43 13.61L16.73 15.71L16.63 15.66Z" fill="#FFD300"/>
                    <path d="M16.73 15.71L13.51 12.46L4.06 21.92C4.41 22.29 5.01 22.34 5.69 21.95L16.73 15.71Z" fill="#FF3A44"/>
                    <path d="M16.73 9.32L5.69 3.08C5.01 2.69 4.41 2.74 4.06 3.11L13.51 12.57L16.73 9.32Z" fill="#00E676"/>
                  </svg>
                  <span>{slide.primaryCtaText}</span>
                </a>
              ) : (
                <Link
                  href={slide.primaryCtaLink}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 text-sm sm:text-base font-bold text-white bg-gradient-to-r from-[#1E3A5F] to-teal-600 hover:from-slate-900 hover:to-teal-700 rounded-2xl transition-all shadow-lg shadow-slate-900/15 active:scale-98"
                >
                  <span>{slide.primaryCtaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}

              {slide.secondaryCtaLink.startsWith('http') ? (
                <a
                  href={slide.secondaryCtaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-sm sm:text-base font-bold text-[#1E3A5F] hover:text-teal-700 bg-white hover:bg-slate-50 border border-slate-200 hover:border-teal-300 rounded-2xl transition-all shadow-xs cursor-pointer"
                >
                  <span>{slide.secondaryCtaText}</span>
                  <ArrowUpRight className="w-4 h-4 text-teal-600" />
                </a>
              ) : (
                <Link
                  href={slide.secondaryCtaLink}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-sm sm:text-base font-bold text-[#1E3A5F] hover:text-teal-700 bg-white hover:bg-slate-50 border border-slate-200 hover:border-teal-300 rounded-2xl transition-all shadow-xs"
                >
                  <span>{slide.secondaryCtaText}</span>
                  <ArrowRight className="w-4 h-4 text-teal-600" />
                </Link>
              )}
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
              <div className="absolute -inset-3 bg-gradient-to-tr from-blue-600/20 via-teal-500/20 to-slate-900/30 rounded-[48px] blur-xl -z-10" />

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
                        <span className="text-[#1E3A5F]">Bharosa</span> <span className="text-teal-600">Lab</span>
                      </h3>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-[#1E3A5F] text-white font-black text-sm flex items-center justify-center shadow-xs">
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
                    <span className={`flex items-center gap-1 font-bold ${activeSlide === 2 ? 'text-teal-600' : 'text-slate-600'}`}>
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
                      <p className="text-[10px] text-teal-100 mt-0.5 leading-snug">
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
                          <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
                            <FlaskConical size={16} />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800 leading-none">Diagnostic Partner Lab</p>
                            <p className="text-[9px] text-slate-400 mt-0.5">Accredited Pathology Testing</p>
                          </div>
                        </div>
                        <span className="flex items-center gap-1 text-[10px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded-md">
                          ★ 4.9
                        </span>
                      </div>

                      <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                            <Stethoscope size={16} />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800 leading-none">Qualified Medical Doctor</p>
                            <p className="text-[9px] text-slate-400 mt-0.5">Live Tele-Consultation Clinic</p>
                          </div>
                        </div>
                        <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                          Verified
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Mockup Bottom Navigation Bar */}
                  <div className="bg-white px-5 py-2.5 border-t border-slate-100 flex justify-between items-center text-[9px] text-slate-400 font-bold">
                    <div className={`flex flex-col items-center ${activeSlide === 0 ? 'text-teal-600' : 'text-slate-400'}`}>
                      <HomeIcon size={14} />
                      <span>Home</span>
                    </div>
                    <div className={`flex flex-col items-center ${activeSlide === 1 ? 'text-teal-600' : 'text-slate-400'}`}>
                      <FlaskConical size={14} />
                      <span>Tests</span>
                    </div>
                    <div className={`flex flex-col items-center ${activeSlide === 2 ? 'text-teal-600' : 'text-slate-400'}`}>
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
