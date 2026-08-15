import React from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  Phone, 
  MessageCircle, 
  Mail, 
  Instagram, 
  Facebook, 
  ArrowUpRight, 
  Building2, 
  Stethoscope, 
  HelpCircle
} from 'lucide-react';

export const metadata = {
  title: "Contact Us | Bharosa Lab",
  description: "Get in touch with Bharosa Lab via Helpline, WhatsApp, Email (bharosalabo@gmail.com), Instagram, and Facebook for customer support, lab onboarding, and doctor network queries.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-slate-900 selection:bg-teal-500 selection:text-white">
      <Navbar />

      <main className="flex-1">
        
        {/* Header */}
        <section className="bg-gradient-to-b from-[#1E3A5F]/5 via-white to-white py-16 sm:py-20 border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <h1 className="text-3xl sm:text-5xl font-black text-[#1E3A5F] tracking-tight">
              Contact Bharosa Lab
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Reach out directly to our dedicated support and operational teams through our official phone helpline, WhatsApp, email, or social channels.
            </p>
          </div>
        </section>

        {/* Primary Contact Channels Grid */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E3A5F]">
                Official Communication Channels
              </h2>
              <p className="text-sm text-slate-600">
                Connect with our team directly with one tap on your preferred communication channel.
              </p>
            </div>

            {/* Top 3 Direct Contact Cards: Phone, WhatsApp, Email */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* 1. Phone Helpline */}
              <div className="bg-[#F8FAFC] rounded-3xl p-8 border border-slate-200 hover:border-teal-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6 group">
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#1E3A5F] text-white flex items-center justify-center shadow-md shadow-slate-900/20 group-hover:scale-105 transition-transform">
                    <Phone className="w-7 h-7 text-teal-300" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#1E3A5F]">Phone Helpline</h3>
                    <p className="text-xs text-slate-500 mt-1">Direct voice call for bookings & inquiries</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-center">
                    <span className="text-lg font-black text-[#1E3A5F] font-mono tracking-wider">
                      03141811158
                    </span>
                  </div>
                </div>
                <a
                  href="tel:03141811158"
                  className="w-full py-3.5 text-center text-sm font-bold text-white bg-[#1E3A5F] hover:bg-slate-900 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4 text-teal-300" />
                  <span>Call Helpline Now</span>
                </a>
              </div>

              {/* 2. WhatsApp Support */}
              <div className="bg-[#F8FAFC] rounded-3xl p-8 border border-slate-200 hover:border-emerald-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6 group">
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#4C9F38] text-white flex items-center justify-center shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
                    <MessageCircle className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#1E3A5F]">WhatsApp Support</h3>
                    <p className="text-xs text-slate-500 mt-1">Instant messaging & test inquiries</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-center">
                    <span className="text-lg font-black text-emerald-800 font-mono tracking-wider">
                      03141811158
                    </span>
                  </div>
                </div>
                <a
                  href="https://wa.me/923141811158"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 text-center text-sm font-bold text-white bg-[#4C9F38] hover:bg-emerald-700 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>

              {/* 3. Official Email */}
              <div className="bg-[#F8FAFC] rounded-3xl p-8 border border-slate-200 hover:border-teal-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6 group">
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-600/20 group-hover:scale-105 transition-transform">
                    <Mail className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#1E3A5F]">Official Email</h3>
                    <p className="text-xs text-slate-500 mt-1">Corporate & institutional correspondence</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-center">
                    <span className="text-sm sm:text-base font-bold text-teal-800 font-mono tracking-tight">
                      bharosalabo@gmail.com
                    </span>
                  </div>
                </div>
                <a
                  href="mailto:bharosalabo@gmail.com"
                  className="w-full py-3.5 text-center text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  <span>Send an Email</span>
                </a>
              </div>

            </div>

            {/* Social Media Channels Grid: Instagram & Facebook */}
            <div className="pt-6">
              <div className="bg-gradient-to-br from-[#1E3A5F] via-[#112233] to-[#0D9488]/40 rounded-3xl p-8 sm:p-12 text-white border border-teal-500/30 shadow-2xl space-y-8">
                
                <div className="text-center max-w-2xl mx-auto space-y-2">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                    Official Social Channels
                  </h3>
                  <p className="text-sm text-slate-300">
                    Follow Bharosa Lab for updates, health awareness, and community announcements.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
                  
                  {/* Instagram */}
                  <a
                    href="https://instagram.com/bharosa_lab"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-6 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-teal-500/30 hover:border-teal-400 transition-all text-center space-y-4 group shadow-md cursor-pointer"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform border border-teal-500/30">
                      <Instagram className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white">Instagram</h4>
                      <p className="text-xs text-slate-400 mt-0.5">@bharosa_lab</p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-300 bg-teal-950/60 px-4 py-1.5 rounded-xl border border-teal-800">
                      <span>Follow on Instagram</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </a>

                  {/* Facebook */}
                  <a
                    href="https://facebook.com/BharosaLab"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-6 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-teal-500/30 hover:border-blue-400 transition-all text-center space-y-4 group shadow-md cursor-pointer"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform border border-blue-500/30">
                      <Facebook className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white">Facebook</h4>
                      <p className="text-xs text-slate-400 mt-0.5">Bharosa Lab</p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-300 bg-blue-950/60 px-4 py-1.5 rounded-xl border border-blue-800">
                      <span>Visit Facebook Page</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </a>

                </div>

              </div>
            </div>

            {/* Quick Links to Portals & FAQs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              
              <Link
                href="/login"
                className="p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200 hover:border-teal-300 hover:bg-white transition-all flex items-center justify-between group shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1E3A5F] flex items-center justify-center">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#1E3A5F]">Partner Labs Portal</h4>
                    <p className="text-[11px] text-slate-500">Sign in to your lab workspace</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
              </Link>

              <a
                href="https://bharosa-doctor.vercel.app/auth"
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200 hover:border-teal-300 hover:bg-white transition-all flex items-center justify-between group shadow-xs cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#1E3A5F]">Doctor Portal</h4>
                    <p className="text-[11px] text-slate-500">Access practitioner dashboard</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
              </a>

              <Link
                href="/faq"
                className="p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200 hover:border-teal-300 hover:bg-white transition-all flex items-center justify-between group shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#1E3A5F]">Frequently Asked Questions</h4>
                    <p className="text-[11px] text-slate-500">Get instant answers</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
              </Link>

            </div>

          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
