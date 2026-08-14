"use client";

import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  Phone, 
  MessageCircle, 
  Instagram, 
  Facebook, 
  Send, 
  CheckCircle, 
  Loader2, 
  HelpCircle,
  Building2,
  Stethoscope,
  HeartPulse,
  Mail
} from 'lucide-react';

export default function ContactPage() {
  const [inquiryType, setInquiryType] = useState('General Inquiry');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-slate-900">
      <Navbar />

      <main className="flex-1">
        
        {/* Header */}
        <section className="bg-gradient-to-b from-blue-50/80 via-white to-white py-16 sm:py-20 border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 bg-blue-100/60 px-3.5 py-1.5 rounded-full border border-blue-200">
              Get in Touch
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Contact Bharosa Lab
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
              Have questions regarding our services, partner lab onboarding, doctor participation, or institutional collaboration? We are here to help.
            </p>
          </div>
        </section>

        {/* Contact Info & Multi-Purpose Form Grid */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              
              {/* Left Column: Direct Channels */}
              <div className="lg:col-span-5 space-y-8">
                <div className="space-y-3">
                  <h2 className="text-2xl font-extrabold text-slate-900">Direct Contact Channels</h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Reach our dedicated support and operational teams through our official communication channels.
                  </p>
                </div>

                <div className="space-y-4">
                  
                  {/* Phone Helpline */}
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Official Helpline</p>
                      <p className="text-lg font-bold text-slate-900 mt-0.5">03141811158</p>
                      <p className="text-xs text-slate-500 mt-1">Available for customer queries and operational assistance.</p>
                    </div>
                  </div>

                  {/* WhatsApp Support */}
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">WhatsApp Support</p>
                      <p className="text-lg font-bold text-slate-900 mt-0.5">03141811158</p>
                      <p className="text-xs text-slate-500 mt-1">Direct messaging for test inquiries and booking help.</p>
                    </div>
                  </div>

                  {/* Social Channels */}
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Official Social Presence</p>
                    
                    <div className="space-y-2.5">
                      <a
                        href="https://instagram.com/bharosa_lab"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-slate-200 hover:border-blue-400 transition-colors text-sm text-slate-700 font-medium"
                      >
                        <Instagram className="w-5 h-5 text-pink-600" />
                        <span>Instagram: <strong>@bharosa_lab</strong></span>
                      </a>

                      <a
                        href="https://facebook.com/BharosaLab"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-slate-200 hover:border-blue-400 transition-colors text-sm text-slate-700 font-medium"
                      >
                        <Facebook className="w-5 h-5 text-blue-600" />
                        <span>Facebook: <strong>Bharosa Lab</strong></span>
                      </a>
                    </div>
                  </div>

                </div>
              </div>

              {/* Right Column: Interactive Multi-Purpose Form */}
              <div className="lg:col-span-7 bg-slate-50 rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm space-y-6">
                
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Send an Official Message</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Select your inquiry category and submit your message to the appropriate department.
                  </p>
                </div>

                {submitted ? (
                  <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4 my-8">
                    <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
                    <h4 className="text-xl font-bold text-emerald-900">Message Received</h4>
                    <p className="text-sm text-emerald-700 max-w-md mx-auto">
                      Thank you for contacting Bharosa Lab. Your message under <strong>{inquiryType}</strong> has been routed to our team. We will get back to you shortly.
                    </p>
                    <button
                      onClick={() => { setSubmitted(false); }}
                      className="text-xs font-bold text-emerald-800 underline pt-2 cursor-pointer"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* Category Selector */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase">
                        Inquiry Category *
                      </label>
                      <select
                        value={inquiryType}
                        onChange={(e) => setInquiryType(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-blue-500 text-sm font-medium text-slate-800"
                      >
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Patient Support">Patient Support</option>
                        <option value="Partner Lab Inquiry">Partner Lab Inquiry</option>
                        <option value="Doctor Inquiry">Doctor Inquiry</option>
                        <option value="Institutional Partnership">Institutional Partnership</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 uppercase">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Your Name"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-blue-500 text-sm"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 uppercase">
                          Contact Phone *
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="03141811158"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-blue-500 text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-blue-500 text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase">
                        Subject *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="Brief summary of your inquiry"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-blue-500 text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase">
                        Message *
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Provide details regarding your request..."
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-blue-500 text-sm"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Submit Message</span>
                        </>
                      )}
                    </button>

                  </form>
                )}

              </div>

            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
