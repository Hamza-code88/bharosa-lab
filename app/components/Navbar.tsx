"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  Menu, 
  X, 
  Phone, 
  MessageCircle, 
  Instagram, 
  Facebook, 
  Smartphone
} from 'lucide-react';

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "Doctors", href: "/doctors" },
  { name: "Partner Labs", href: "/partner-labs" },
  { name: "Partner With Us", href: "/partner-with-us" },
  { name: "About Us", href: "/about" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      
      {/* Top Micro-Bar for Contact Channels & Socials */}
      <div className="bg-[#0B132B] text-slate-300 text-xs py-2 px-4 sm:px-6 lg:px-8 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-teal-400" />
            <a href="tel:03141811158" className="hover:text-white transition-colors font-medium">
              Helpline: <strong className="text-white font-mono">03141811158</strong>
            </a>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
            <a href="https://wa.me/923141811158" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors font-medium">
              WhatsApp: <strong className="text-white font-mono">03141811158</strong>
            </a>
          </div>
        </div>

        {/* Social Icons with Direct URLs */}
        <div className="flex items-center gap-2">
          <a
            href="https://instagram.com/bharosa_lab"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg bg-slate-800/90 hover:bg-teal-600 text-slate-300 hover:text-white transition-colors flex items-center justify-center shadow-xs"
            aria-label="Instagram"
            title="Follow us on Instagram (@bharosa_lab)"
          >
            <Instagram className="w-3.5 h-3.5" />
          </a>
          <a
            href="https://facebook.com/BharosaLab"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg bg-slate-800/90 hover:bg-blue-600 text-slate-300 hover:text-white transition-colors flex items-center justify-center shadow-xs"
            aria-label="Facebook"
            title="Follow us on Facebook (Bharosa Lab)"
          >
            <Facebook className="w-3.5 h-3.5" />
          </a>
          <a
            href="https://wa.me/923141811158"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg bg-slate-800/90 hover:bg-emerald-600 text-slate-300 hover:text-white transition-colors flex items-center justify-center shadow-xs"
            aria-label="WhatsApp"
            title="Chat with us on WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 sm:h-22 flex items-center justify-between">
        {/* Responsive Brand Logo (Full Natural Landscape Aspect) */}
        <Link href="/" className="flex flex-col justify-center group py-1">
          <Image
            src="/logo.png"
            alt="Bharosa Lab"
            width={240}
            height={120}
            className="h-11 sm:h-13 lg:h-15 w-auto object-contain transition-transform group-hover:scale-105"
            priority
          />
          <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 tracking-wide pl-1 mt-0.5">
            Where Trust Makes Life Easier
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-1 xl:gap-1.5">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 text-sm font-semibold rounded-xl transition-all ${
                  isActive
                    ? 'text-teal-700 bg-teal-50 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-[#1E3A5F] hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Single Primary Action: Download App with Google Play Icon */}
        <div className="hidden sm:flex items-center">
          <a
            href="https://play.google.com/store/apps/details?id=com.hamzacode.bharosalab"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#1E3A5F] to-teal-600 hover:from-slate-900 hover:to-teal-700 rounded-xl transition-all shadow-md shadow-slate-900/15 active:scale-95 cursor-pointer"
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

        {/* Mobile menu button */}
        <div className="flex lg:hidden items-center gap-2">
          <a
            href="https://play.google.com/store/apps/details?id=com.hamzacode.bharosalab"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-gradient-to-r from-[#1E3A5F] to-teal-600 text-white rounded-xl shadow-xs active:scale-95 flex items-center justify-center"
            title="Download App"
          >
            <Smartphone className="w-4 h-4" />
          </a>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Navigation */}
      {isOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'text-teal-700 bg-teal-50 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <a
              href="https://play.google.com/store/apps/details?id=com.hamzacode.bharosalab"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 text-center text-sm font-bold text-white bg-gradient-to-r from-[#1E3A5F] to-teal-600 rounded-xl shadow-md flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none">
                <path d="M4.06 2.15C3.76 2.47 3.59 2.97 3.59 3.63V20.37C3.59 21.03 3.76 21.53 4.06 21.85L4.13 21.92L13.51 12.54V12.46V12.38L4.13 3L4.06 2.15Z" fill="#00D3FF"/>
                <path d="M16.63 15.66L13.51 12.54V12.38L16.63 9.26L16.73 9.32L20.43 11.42C21.49 12.02 21.49 13.01 20.43 13.61L16.73 15.71L16.63 15.66Z" fill="#FFD300"/>
                <path d="M16.73 15.71L13.51 12.46L4.06 21.92C4.41 22.29 5.01 22.34 5.69 21.95L16.73 15.71Z" fill="#FF3A44"/>
                <path d="M16.73 9.32L5.69 3.08C5.01 2.69 4.41 2.74 4.06 3.11L13.51 12.57L16.73 9.32Z" fill="#00E676"/>
              </svg>
              <span>Download Mobile App</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
