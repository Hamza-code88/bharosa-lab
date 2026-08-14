"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Smartphone, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  FlaskConical, 
  Home as HomeIcon, 
  FileText, 
  Stethoscope, 
  Building2, 
  CheckCircle2, 
  ShieldCheck, 
  Search, 
  Sparkles,
  Users,
  Activity,
  HeartPulse,
  Play,
  Pause
} from 'lucide-react';

interface SlideData {
  id: number;
  badge: string;
  badgeColor: string;
  title: string;
  titleGradient: string;
  description: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  isPrimaryExternal?: boolean;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  imageUrl: string;
  imageAlt: string;
  highlights: string[];
}

const slides: SlideData[] = [
  {
    id: 1,
    badge: "Connected Healthcare Platform",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    title: "Healthcare Services, Connected in One Place.",
    titleGradient: "from-blue-600 via-teal-600 to-indigo-600",
    description: "Discover laboratory tests, arrange home sample collection, access digital reports, and connect with qualified doctors through one digital healthcare platform.",
    primaryCtaText: "Download the App",
    primaryCtaLink: "https://play.google.com/store",
    isPrimaryExternal: true,
    secondaryCtaText: "Partner With Us",
    secondaryCtaLink: "/partner-with-us",
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=75",
    imageAlt: "Digital Healthcare Telemedicine & Diagnostics",
    highlights: ["Verified Diagnostic Labs", "Secure Digital Reports", "Live Tele-Doctors"]
  },
  {
    id: 2,
    badge: "Diagnostic Testing & Phlebotomy",
    badgeColor: "bg-teal-50 text-teal-800 border-teal-200",
    title: "Book Diagnostic Tests with Home Sample Collection.",
    titleGradient: "from-teal-600 via-emerald-600 to-blue-600",
    description: "Avoid unnecessary clinic travel. Request certified sample collectors to visit your home and receive fast, verified digital PDF reports directly on your mobile device.",
    primaryCtaText: "Book a Test in App",
    primaryCtaLink: "https://play.google.com/store",
    isPrimaryExternal: true,
    secondaryCtaText: "Explore Test Services",
    secondaryCtaLink: "/services",
    imageUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=75",
    imageAlt: "Home Sample Collection Phlebotomy",
    highlights: ["Safe Cold-Chain Handling", "Convenient Home Visits", "Accurate Digital Results"]
  },
  {
    id: 3,
    badge: "Online Medical Telemedicine",
    badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
    title: "Connect with Qualified Doctors in Real Time.",
    titleGradient: "from-indigo-600 via-blue-600 to-teal-600",
    description: "Get professional medical advice, review diagnostic laboratory results, and consult experienced general practitioners and specialists remotely.",
    primaryCtaText: "Consult a Doctor",
    primaryCtaLink: "/doctors",
    isPrimaryExternal: false,
    secondaryCtaText: "Join as a Doctor",
    secondaryCtaLink: "/doctors#join-form",
    imageUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&auto=format&fit=crop&q=75",
    imageAlt: "Qualified Doctor Consultation",
    highlights: ["Licensed Practitioners", "Lab Result Interpretation", "Flexible Tele-Slots"]
  },
  {
    id: 4,
    badge: "Enterprise SaaS for Labs",
    badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
    title: "Grow Your Diagnostic Laboratory Online.",
    titleGradient: "from-blue-700 via-teal-600 to-slate-900",
    description: "Empower your pathology lab with a dedicated portal to manage test offerings, process incoming patient orders, submit digital reports, and monitor earnings.",
    primaryCtaText: "Become a Partner Lab",
    primaryCtaLink: "/login",
    isPrimaryExternal: false,
    secondaryCtaText: "Learn About Portal",
    secondaryCtaLink: "/partner-labs",
    imageUrl: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&auto=format&fit=crop&q=75",
    imageAlt: "Modern Diagnostic Pathology Lab",
    highlights: ["Dedicated SaaS Portal", "Real-Time Order Routing", "Transparent Ledgers"]
  }
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [progress, setProgress] = useState(0);

  // Auto-slide effect with progress tracking
  useEffect(() => {
    if (!isAutoPlay) return;
    
    const duration = 4500; // 4.5 seconds per slide
    const intervalTime = 50; // update progress every 50ms
    const step = (intervalTime / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentSlide((curr) => (curr + 1) % slides.length);
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isAutoPlay, currentSlide]);

  const selectSlide = (index: number) => {
    setCurrentSlide(index);
    setProgress(0);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    setProgress(0);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setProgress(0);
  };

  const slide = slides[currentSlide];

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#1E3A5F]/5 via-white to-[#F8FAFC] py-8 sm:py-14 lg:py-18 border-b border-slate-200/80">
      
      {/* Background ambient lighting */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-40 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Controls Bar with Auto-Slide status */}
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-200/70 gap-4">
          
          {/* Slide Tab Buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar py-1">
            {slides.map((s, index) => (
              <button
                key={s.id}
                onClick={() => selectSlide(index)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  currentSlide === index
                    ? 'bg-[#1E3A5F] text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span className="text-[10px] opacity-70">0{index + 1}</span>
                <span>{s.badge.split(' ')[0]} {s.badge.split(' ')[1] || ''}</span>
              </button>
            ))}
          </div>

          {/* Auto-play toggle & Arrows */}
          <div className="flex items-center gap-2 flex-shrink-0">
            
            <button
              onClick={() => setIsAutoPlay(!isAutoPlay)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-colors flex items-center gap-1.5 cursor-pointer ${
                isAutoPlay 
                  ? 'bg-teal-50 text-teal-800 border-teal-200' 
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}
              title="Toggle Auto Slide"
            >
              {isAutoPlay ? <Pause size={12} className="text-teal-600" /> : <Play size={12} className="text-slate-600" />}
              <span className="hidden sm:inline">{isAutoPlay ? 'Auto Slide ON' : 'Auto Slide OFF'}</span>
            </button>

            <button
              onClick={prevSlide}
              className="w-8 h-8 rounded-full bg-white border border-slate-200 hover:border-teal-400 text-slate-700 flex items-center justify-center transition-all shadow-xs hover:bg-teal-50 cursor-pointer"
              aria-label="Previous slide"
            >
              <ChevronLeft size={16} />
            </button>
            
            <button
              onClick={nextSlide}
              className="w-8 h-8 rounded-full bg-white border border-slate-200 hover:border-teal-400 text-slate-700 flex items-center justify-center transition-all shadow-xs hover:bg-teal-50 cursor-pointer"
              aria-label="Next slide"
            >
              <ChevronRight size={16} />
            </button>
          </div>

        </div>

        {/* Carousel Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center min-h-[420px]">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left transition-all duration-300">
            
            <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shadow-xs ${slide.badgeColor}`}>
              <HeartPulse className="w-3.5 h-3.5" />
              <span>{slide.badge}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-black text-[#1E3A5F] tracking-tight leading-[1.15]">
              <span className={`text-transparent bg-clip-text bg-gradient-to-r ${slide.titleGradient}`}>
                {slide.title}
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
              {slide.description}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-1">
              {slide.isPrimaryExternal ? (
                <a
                  href={slide.primaryCtaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 text-sm sm:text-base font-bold text-white bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 rounded-2xl transition-all shadow-md shadow-blue-500/20 active:scale-98 cursor-pointer"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>{slide.primaryCtaText}</span>
                </a>
              ) : (
                <Link
                  href={slide.primaryCtaLink}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 text-sm sm:text-base font-bold text-white bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 rounded-2xl transition-all shadow-md shadow-blue-500/20"
                >
                  <span>{slide.primaryCtaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}

              <Link
                href={slide.secondaryCtaLink}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm sm:text-base font-bold text-[#1E3A5F] hover:text-teal-700 bg-white hover:bg-slate-50 border border-slate-200 hover:border-teal-300 rounded-2xl transition-all shadow-xs"
              >
                <span>{slide.secondaryCtaText}</span>
                <ArrowRight className="w-4 h-4 text-teal-600" />
              </Link>
            </div>

            {/* Micro Feature Indicators */}
            <div className="pt-3 border-t border-slate-200/80 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs text-slate-600 font-semibold">
              {slide.highlights.map((h, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                  <span>{h}</span>
                </span>
              ))}
            </div>

          </div>

          {/* Right Visual Column: Fast CDN Image with Fallback and Instant Loading */}
          <div className="lg:col-span-5 relative flex justify-center">
            
            <div className="relative w-full max-w-md lg:max-w-none h-[300px] sm:h-[360px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900 group">
              <Image
                src={slide.imageUrl}
                alt={slide.imageAlt}
                fill
                unoptimized
                priority
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent" />
              
              {/* Card Caption Badge */}
              <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-white/40 shadow-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-500 text-white flex items-center justify-center flex-shrink-0 font-bold">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Bharosa Verified</p>
                    <p className="text-xs sm:text-sm font-extrabold text-[#1E3A5F]">{slide.imageAlt}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                  Active
                </span>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Slide Progress Bar */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {slides.map((_, dotIdx) => (
            <button
              key={dotIdx}
              onClick={() => selectSlide(dotIdx)}
              className="h-2 rounded-full overflow-hidden transition-all duration-300 cursor-pointer bg-slate-200 w-12 relative"
              aria-label={`Go to slide ${dotIdx + 1}`}
            >
              {currentSlide === dotIdx && (
                <div 
                  className="h-full bg-teal-600 transition-all duration-75"
                  style={{ width: `${isAutoPlay ? progress : 100}%` }}
                />
              )}
            </button>
          ))}
        </div>

      </div>

    </div>
  );
}
