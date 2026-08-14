import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, MessageCircle, Instagram, Facebook, Shield, ArrowUpRight, HeartPulse, CheckCircle2 } from 'lucide-react';
import logo from '../../public/logo.png';

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
              className="px-6 py-3.5 text-sm font-bold text-slate-200 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl transition-all text-center flex items-center justify-center gap-2"
            >
              <span>Download App</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-11 h-11 bg-white rounded-xl p-1 shadow-sm">
                <Image
                  src={logo}
                  alt="Bharosa Lab"
                  fill
                  className="object-contain p-1"
                />
              </div>
              <div>
                <span className="text-2xl font-black text-white tracking-tight">
                  Bharosa <span className="text-teal-400">Lab</span>
                </span>
                <p className="text-xs text-slate-400 font-medium">Where Trust Makes Life Easier</p>
              </div>
            </Link>
            
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Bharosa Lab is a digital healthcare platform designed to simplify healthcare access by connecting patients with diagnostic laboratories and qualified healthcare professionals.
            </p>

            <div className="space-y-2 pt-2 text-sm text-slate-300">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>Helpline: <strong className="text-white font-mono">03141811158</strong></span>
              </div>
              <div className="flex items-center gap-3">
                <MessageCircle className="w-4 h-4 text-teal-400 flex-shrink-0" />
                <span>WhatsApp: <strong className="text-white font-mono">03141811158</strong></span>
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
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com/BharosaLab"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-900 hover:bg-teal-600 text-slate-400 hover:text-white border border-slate-800 flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
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
                <Link href="/doctors" className="hover:text-white transition-colors">Join as Doctor</Link>
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
