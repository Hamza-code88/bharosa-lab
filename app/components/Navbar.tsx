"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Smartphone, ShieldCheck, ChevronRight } from 'lucide-react';
import logo from '../../public/logo.png';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Services', href: '/services' },
  { name: 'Doctors', href: '/doctors' },
  { name: 'Partner Labs', href: '/partner-labs' },
  { name: 'Partner With Us', href: '/partner-with-us' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
  { name: 'FAQ', href: '/faq' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all shadow-xs">
      {/* Top micro-bar for quick contact */}
      <div className="bg-[#1E3A5F] text-slate-300 text-xs py-1.5 px-4 sm:px-8 hidden md:flex justify-between items-center border-b border-slate-800">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5 font-medium text-teal-300">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            Official Digital Healthcare Platform
          </span>
          <span className="text-slate-500">|</span>
          <span>Helpline & WhatsApp: <strong className="text-white font-mono">03141811158</strong></span>
        </div>
        <div className="flex items-center gap-4 text-slate-300 text-xs">
          <span>Instagram: <strong className="text-teal-300">@bharosa_lab</strong></span>
          <span>•</span>
          <span>Facebook: <strong className="text-teal-300">Bharosa Lab</strong></span>
        </div>
      </div>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
            <Image
              src={logo}
              alt="Bharosa Lab Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-black text-[#1E3A5F] tracking-tight leading-none group-hover:text-blue-600 transition-colors">
              Bharosa <span className="text-blue-600">Lab</span>
            </span>
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 tracking-wide mt-1">
              Where Trust Makes Life Easier
            </span>
          </div>
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
                    ? 'text-teal-700 bg-teal-50 shadow-xs'
                    : 'text-slate-600 hover:text-[#1E3A5F] hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Single Primary Action: Download App */}
        <div className="hidden sm:flex items-center">
          <a
            href="https://play.google.com/store"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 rounded-xl transition-all shadow-md shadow-blue-500/20 active:scale-95 cursor-pointer"
          >
            <Smartphone className="w-4 h-4" />
            <span>Download App</span>
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-xl">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium flex items-center justify-between ${
                    isActive
                      ? 'bg-teal-50 text-teal-800 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{link.name}</span>
                  <ChevronRight size={16} className="text-slate-400" />
                </Link>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
            <a
              href="https://play.google.com/store"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 rounded-xl transition-colors shadow-md shadow-blue-500/20"
            >
              <Smartphone size={16} />
              <span>Download Mobile App</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
