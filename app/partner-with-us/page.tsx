"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  Building2, 
  Stethoscope, 
  Globe2, 
  Send, 
  CheckCircle, 
  Loader2, 
  ArrowRight, 
  ShieldCheck, 
  HeartHandshake,
  CheckCircle2,
  Lock
} from 'lucide-react';

export default function PartnerWithUsPage() {
  const [partnerType, setPartnerType] = useState<'lab' | 'doctor' | 'institution'>('institution');
  const [formData, setFormData] = useState({
    orgName: '',
    contactPerson: '',
    email: '',
    phone: '',
    partnershipScope: '',
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
    }, 700);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-slate-900">
      <Navbar />

      <main className="flex-1">
        
        {/* Page Header */}
        <section className="bg-gradient-to-b from-blue-50/80 via-white to-white py-16 sm:py-20 border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 bg-blue-100/60 px-3.5 py-1.5 rounded-full border border-blue-200">
              Collaborative Ecosystem
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Partner With Bharosa Lab
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              We collaborate with diagnostic laboratories, doctors, and institutional health organizations to build a connected and accessible digital healthcare infrastructure.
            </p>
          </div>
        </section>

        {/* 3 Partnership Tracks */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Track A: Partner Laboratory */}
              <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Diagnostic Laboratories</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Join our diagnostic network to receive patient orders, process home sample collections, and upload digital reports via the dedicated Lab Portal.
                  </p>
                  <ul className="space-y-2 text-xs text-slate-700 pt-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      <span>Dedicated SaaS Lab Portal</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      <span>Catalog and pricing controls</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      <span>Direct digital report submissions</span>
                    </li>
                  </ul>
                </div>
                <Link
                  href="/login"
                  className="w-full py-3 text-center text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-md shadow-blue-500/20"
                >
                  Onboard Your Lab
                </Link>
              </div>

              {/* Track B: Join as a Doctor */}
              <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Healthcare Professionals</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Provide telemedicine consultations, review diagnostic findings, and expand your accessibility to patients seeking qualified medical advice.
                  </p>
                  <ul className="space-y-2 text-xs text-slate-700 pt-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                      <span>Flexible consultation hours</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                      <span>Remote patient consultation channels</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                      <span>Clinical history access</span>
                    </li>
                  </ul>
                </div>
                <Link
                  href="/doctors"
                  className="w-full py-3 text-center text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-md shadow-indigo-500/20"
                >
                  Join as a Doctor
                </Link>
              </div>

              {/* Track C: Institutional / SDG Partnership */}
              <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center">
                    <Globe2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Institutional & Health SDGs</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Collaborate on community healthcare access, digital health initiatives, mobile diagnostic outreach, and measurable public health impact.
                  </p>
                  <ul className="space-y-2 text-xs text-slate-700 pt-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Aligned with SDG 3, 9, 10, 17</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Custom digital health pilots</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Community health outreach</span>
                    </li>
                  </ul>
                </div>
                <a
                  href="#inquiry-form"
                  className="w-full py-3 text-center text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-md shadow-emerald-500/20"
                >
                  Inquire for Partnership
                </a>
              </div>

            </div>

          </div>
        </section>

        {/* Partnership Inquiry Form */}
        <section id="inquiry-form" className="py-16 bg-slate-50 border-t border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl space-y-8">
              
              <div className="space-y-2 text-center sm:text-left">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Partnership Inquiries
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  Start a Collaboration
                </h2>
                <p className="text-slate-600 text-sm">
                  Let us know how your organization or practice would like to work with Bharosa Lab.
                </p>
              </div>

              {submitted ? (
                <div className="p-8 rounded-2xl bg-blue-50 border border-blue-200 text-center space-y-4">
                  <CheckCircle className="w-12 h-12 text-blue-600 mx-auto" />
                  <h3 className="text-xl font-bold text-blue-950">Partnership Proposal Received</h3>
                  <p className="text-sm text-blue-800 max-w-md mx-auto">
                    Thank you for your interest in collaborating with Bharosa Lab. Our institutional partnerships team will connect with you at <strong>{formData.email}</strong>.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); }}
                    className="text-xs font-bold text-blue-900 underline pt-2"
                  >
                    Submit another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  
                  {/* Track selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase">
                      Select Partnership Track *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => setPartnerType('institution')}
                        className={`p-3.5 rounded-xl border text-xs font-bold text-center transition-all ${
                          partnerType === 'institution'
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                            : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        Institutional / SDG
                      </button>
                      <button
                        type="button"
                        onClick={() => setPartnerType('lab')}
                        className={`p-3.5 rounded-xl border text-xs font-bold text-center transition-all ${
                          partnerType === 'lab'
                            ? 'border-blue-600 bg-blue-50 text-blue-900'
                            : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        Diagnostic Lab
                      </button>
                      <button
                        type="button"
                        onClick={() => setPartnerType('doctor')}
                        className={`p-3.5 rounded-xl border text-xs font-bold text-center transition-all ${
                          partnerType === 'doctor'
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-900'
                            : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        Doctor / Clinic
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                    
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase">
                        Organization / Practice Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.orgName}
                        onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
                        placeholder="e.g. City Diagnostic Health Org"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase">
                        Contact Person Name & Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.contactPerson}
                        onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                        placeholder="e.g. Dr. Salman / Director"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase">
                        Official Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="contact@organization.org"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase">
                        Contact Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="03141811158"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 text-sm"
                      />
                    </div>

                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase">
                      Partnership Proposal & Scope *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Outline your partnership objectives, target audience, and collaboration areas..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 text-base font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Partnership Inquiry</span>
                      </>
                    )}
                  </button>
                </form>
              )}

            </div>

          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
