"use client";

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Sparkles, 
  ShieldCheck, 
  Home as HomeIcon, 
  FileText, 
  FlaskConical, 
  Stethoscope, 
  Star,
  ChevronRight,
  Activity,
  Bot
} from 'lucide-react';

interface MockupCard {
  id: number;
  tag: string;
  title: string;
  subtitle: string;
  bgGradient: string;
  btnText: string;
  icon: any;
}

const mockupCards: MockupCard[] = [
  {
    id: 1,
    tag: "Home Phlebotomy",
    title: "Book Blood Tests at Home",
    subtitle: "Certified phlebotomist visits at your doorstep",
    bgGradient: "from-blue-600 via-teal-600 to-[#1E3A5F]",
    btnText: "Book in App",
    icon: HomeIcon
  },
  {
    id: 2,
    tag: "Live Telemedicine",
    title: "Consult Qualified Doctors",
    subtitle: "Online medical reviews & diagnostic advice",
    bgGradient: "from-indigo-600 via-blue-600 to-[#1E3A5F]",
    btnText: "Consult Doctor",
    icon: Stethoscope
  },
  {
    id: 3,
    tag: "Instant Digital PDF",
    title: "Verified Digital Reports",
    subtitle: "Direct access to pathology test results",
    bgGradient: "from-teal-600 via-emerald-600 to-[#1E3A5F]",
    btnText: "View Reports",
    icon: FileText
  },
  {
    id: 4,
    tag: "AI Health Assistant",
    title: "24/7 AI Medical Doctor",
    subtitle: "Ask symptom questions & test suggestions",
    bgGradient: "from-purple-600 via-indigo-600 to-blue-700",
    btnText: "Ask AI Doctor",
    icon: Sparkles
  }
];

export default function MobileAppMockupSlider() {
  const [activeSlide, setActiveSlide] = useState(0);

  // Smooth auto-slide every 3.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % mockupCards.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const card = mockupCards[activeSlide];
  const IconComponent = card.icon;

  return (
    <div className="relative w-full max-w-[340px] sm:max-w-[360px] mx-auto">
      
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

          {/* Search Bar + AI Doctor widget */}
          <div className="px-4 py-2 bg-white flex items-center gap-2 border-b border-slate-100">
            <div className="flex-1 bg-slate-100 rounded-xl px-3 py-2 flex items-center gap-2 text-slate-400 text-xs">
              <Search size={14} className="text-slate-400" />
              <span>Search tests, labs...</span>
            </div>
            <div className="px-2.5 py-1.5 rounded-xl bg-blue-50 border border-blue-100 flex flex-col items-center">
              <Sparkles size={13} className="text-blue-600" />
              <span className="text-[9px] font-bold text-blue-700">AI Doctor</span>
            </div>
          </div>

          {/* Features Bar */}
          <div className="px-4 py-2 bg-slate-50 flex items-center justify-between text-[10px] text-slate-600 border-b border-slate-100 font-medium">
            <span className="flex items-center gap-1 text-blue-600 font-bold">
              <ShieldCheck size={11} /> Bharosa Tests
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1">
              <HomeIcon size={11} className="text-teal-600" /> Home Sample
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1">
              <FileText size={11} className="text-emerald-600" /> Reports
            </span>
          </div>

          {/* ======================================================= */}
          {/* AUTO-SLIDING DYNAMIC CARD INSIDE SMARTPHONE SCREEN      */}
          {/* ======================================================= */}
          <div className="p-3.5">
            <div className={`bg-gradient-to-r ${card.bgGradient} rounded-2xl p-4 text-white shadow-md relative overflow-hidden transition-all duration-500`}>
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full" />
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                  {card.tag}
                </span>
                <IconComponent size={16} className="text-white/80" />
              </div>
              <p className="text-sm font-extrabold mt-2 leading-tight">
                {card.title}
              </p>
              <p className="text-[10px] text-blue-100 mt-0.5 leading-snug">
                {card.subtitle}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <div className="bg-white text-[#1E3A5F] font-bold text-[10px] px-3 py-1 rounded-lg shadow-xs flex items-center gap-1">
                  <span>{card.btnText}</span>
                  <ChevronRight size={10} />
                </div>

                {/* Slider Dots inside card */}
                <div className="flex items-center gap-1">
                  {mockupCards.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveSlide(i)}
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

          {/* Partner Labs Preview */}
          <div className="px-4 pb-3 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-black text-slate-800">Partner Laboratories</p>
              <span className="text-[10px] font-bold text-teal-600">VIEW ALL</span>
            </div>
            
            <div className="space-y-1.5">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                    <FlaskConical size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 leading-none">Bharosa Central Lab</p>
                    <p className="text-[9px] text-slate-400 mt-0.5">Verified Diagnostic Center</p>
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
                    <p className="text-xs font-bold text-slate-800 leading-none">Online Doctor Clinic</p>
                    <p className="text-[9px] text-slate-400 mt-0.5">Qualified Tele-Consultations</p>
                  </div>
                </div>
                <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                  Live
                </span>
              </div>
            </div>
          </div>

          {/* Mockup Bottom Navigation Bar */}
          <div className="bg-white px-5 py-2.5 border-t border-slate-100 flex justify-between items-center text-[9px] text-slate-400 font-bold">
            <div className="flex flex-col items-center text-blue-600">
              <HomeIcon size={14} />
              <span>Home</span>
            </div>
            <div className="flex flex-col items-center hover:text-slate-600">
              <FlaskConical size={14} />
              <span>Tests</span>
            </div>
            <div className="flex flex-col items-center hover:text-slate-600">
              <FileText size={14} />
              <span>Reports</span>
            </div>
            <div className="flex flex-col items-center hover:text-slate-600">
              <Stethoscope size={14} />
              <span>Doctors</span>
            </div>
          </div>

          {/* Home Indicator Bar */}
          <div className="bg-white py-1 flex justify-center">
            <div className="w-24 h-1 bg-slate-300 rounded-full" />
          </div>

        </div>

      </div>

    </div>
  );
}
