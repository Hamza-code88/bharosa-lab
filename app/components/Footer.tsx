import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, MessageCircle, Instagram, Facebook, Shield, ArrowUpRight, HeartPulse, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0B132B] text-slate-300 border-t border-slate-800">
      {/* Top Banner / Impact callout with Teal/Navy Gradient */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-800/80">
        <div className="bg-gradient-to-r from-[#1E3A5F] via-[#112233] to-[#0D9488]/40 border border-teal-500/20 rounded-3xl p-8 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2 text-center lg:text-left">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-teal-400/10 text-teal-300 border border-teal-400/20">
              <HeartPulse className="w-3.5 h-3.5" />
              Connected Healthcare Ecosystem
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Ready to experience modern digital healthcare?
            </h3>
            <p className="text-slate-300 text-sm max-w-xl">
              Discover tests, arrange home sample collection, get digital reports, or join as a partner laboratory or doctor.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 w-full lg:w-auto">
            <Link
              href="/partner-with-us"
              className="px-6 py-3.5 text-sm font-bold text-white bg-teal-600 hover:bg-teal-500 rounded-xl transition-all shadow-lg shadow-teal-600/30 text-center"
            >
              Partner With Us
            </Link>
            <a
              href="https://play.google.com/store"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 text-sm font-bold text-slate-200 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl transition-all text-center flex items-center justify-center gap-2.5 active:scale-95"
            >
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none">
                <path d="M4.06 2.15C3.76 2.47 3.59 2.97 3.59 3.63V20.37C3.59 21.03 3.76 21.53 4.06 21.85L4.13 21.92L13.51 12.54V12.46V12.38L4.13 3L4.06 2.15Z" fill="#00D3FF"/>
                <path d="M16.63 15.66L13.51 12.54V12.38L16.63 9.26L16.73 9.32L20.43 11.42C21.49 12.02 21.49 13.01 20.43 13.61L16.73 15.71L16.63 15.66Z" fill="#FFD300"/>
                <path d="M16.73 15.71L13.51 12.46L4.06 21.92C4.41 22.29 5.01 22.34 5.69 21.95L16.73 15.71Z" fill="#FF3A44"/>
                <path d="M16.73 9.32L5.69 3.08C5.01 2.69 4.41 2.74 4.06 3.11L13.51 12.57L16.73 9.32Z" fill="#00E676"/>
              </svg>
              <span>Download App</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="inline-flex flex-col group space-y-2">
              <div className="bg-white rounded-2xl p-2.5 shadow-sm inline-block w-fit transition-transform group-hover:scale-105">
                <Image
                  src="/logo.png"
                  alt="Bharosa Lab"
                  width={200}
                  height={100}
                  className="h-11 sm:h-13 w-auto object-contain"
                />
              </div>
              <p className="text-xs sm:text-sm text-slate-400 font-medium pl-1">
                Where Trust Makes Life Easier
              </p>
            </Link>
            
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Bharosa Lab is a digital healthcare platform designed to simplify healthcare access by connecting patients with diagnostic laboratories and qualified healthcare professionals.
            </p>

            <div className="space-y-2 pt-2 text-sm text-slate-300">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-teal-400 flex-shrink-0" />
                <a href="tel:03141811158" className="hover:text-white transition-colors">
                  Helpline: <strong className="text-white font-mono">03141811158</strong>
                </a>
              </div>
              <div className="flex items-center gap-3">
                <MessageCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <a href="https://wa.me/923141811158" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  WhatsApp: <strong className="text-white font-mono">03141811158</strong>
                </a>
              </div>
            </div>

            {/* Social Channels */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com/bharosa_lab"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-900 hover:bg-teal-600 text-slate-400 hover:text-white border border-slate-800 flex items-center justify-center transition-colors"
                aria-label="Instagram"
                title="Instagram (@bharosa_lab)"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com/BharosaLab"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-900 hover:bg-blue-600 text-slate-400 hover:text-white border border-slate-800 flex items-center justify-center transition-colors"
                aria-label="Facebook"
                title="Facebook (Bharosa Lab)"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/923141811158"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-900 hover:bg-emerald-600 text-slate-400 hover:text-white border border-slate-800 flex items-center justify-center transition-colors"
                aria-label="WhatsApp"
                title="WhatsApp Chat"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">Services</Link>
              </li>
              <li>
                <Link href="/doctors" className="hover:text-white transition-colors">Doctors</Link>
              </li>
              <li>
                <Link href="/partner-labs" className="hover:text-white transition-colors">Partner Labs</Link>
              </li>
              <li>
                <Link href="/partner-with-us" className="hover:text-white transition-colors">Partner With Us</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Solutions & Portals */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wider">Portals & Help</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/login" className="hover:text-white text-teal-300 font-semibold transition-colors flex items-center gap-1.5">
                  <span>Partner Lab Login</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
              <li>
                <a
                  href="https://bharosa-doctor.vercel.app/auth"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white text-teal-300 font-semibold transition-colors flex items-center gap-1.5"
                >
                  <span>Doctor Portal Login</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </li>
              <li>
                <Link href="/doctors" className="hover:text-white transition-colors">Doctor Network Info</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">Contact Support</Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">Frequently Asked Questions</Link>
              </li>
              <li>
                <a
                  href="https://play.google.com/store"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Google Play App
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Healthcare & SDG Impact */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wider">Healthcare Impact</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Advancing accessible diagnostics and connected healthcare delivery in alignment with global health goals.
            </p>
            <div className="space-y-1.5 text-xs text-slate-400">
              <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>SDG 3: Good Health & Well-being</span>
              </div>
              <div className="flex items-center gap-1.5 text-amber-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>SDG 9: Industry & Innovation</span>
              </div>
              <div className="flex items-center gap-1.5 text-rose-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>SDG 10: Reduced Inequalities</span>
              </div>
              <div className="flex items-center gap-1.5 text-blue-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>SDG 17: Partnerships for the Goals</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 italic">
              *Alignment indicates strategic thematic focus, not official UN endorsement.
            </p>
          </div>

        </div>

        {/* Disclaimer & Bottom bar */}
        <div className="mt-14 pt-8 border-t border-slate-800 space-y-6">
          <div className="bg-slate-900/60 rounded-2xl p-4 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
            <strong className="text-slate-300">Medical Information & Positioning Notice:</strong> Bharosa Lab connects patients with registered diagnostic laboratories and qualified healthcare professionals. Bharosa Lab does not independently deliver medical diagnoses or clinical guarantees. All diagnostic tests and consultations are conducted by licensed partner laboratories and medical professionals.
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} Bharosa Lab. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link href="/privacy-policy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-slate-300 transition-colors">Terms & Conditions</Link>
              <Link href="/contact" className="hover:text-slate-300 transition-colors">Support</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
