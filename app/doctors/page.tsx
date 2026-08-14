"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  Stethoscope, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  FileText, 
  ShieldCheck, 
  Users, 
  Send, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  Sparkles,
  Award
} from 'lucide-react';

export default function DoctorsPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    specialization: '',
    qualifications: '',
    experienceYears: '',
    availability: '',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-slate-900">
      <Navbar />

      <main className="flex-1">
        
        {/* Hero Section with Doctor Photography */}
        <section className="bg-gradient-to-b from-indigo-50/70 via-white to-white py-16 sm:py-20 border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
                <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 bg-indigo-100/60 px-3.5 py-1.5 rounded-full border border-indigo-200">
                  Healthcare Professionals
                </span>
                <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                  Connect With Patients Through Bharosa Lab
                </h1>
                <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  Bharosa Lab provides participating healthcare professionals with a digital channel to offer online consultations to patients seeking qualified medical guidance and diagnostic test interpretation.
                </p>
                <div className="pt-2">
                  <a
                    href="#join-form"
                    className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-md shadow-indigo-500/20"
                  >
                    <span>Apply as a Doctor</span>
                  </a>
                </div>
              </div>

              <div className="lg:col-span-5 relative">
                <div className="relative h-[300px] sm:h-[340px] rounded-3xl overflow-hidden shadow-xl border-4 border-white">
                  <Image
                    src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&auto=format&fit=crop&q=75"
                    alt="Participating Medical Doctor"
                    fill
                    unoptimized
                    priority
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-white/90 backdrop-blur-md text-xs font-bold text-[#1E3A5F] flex items-center justify-between border border-white/40">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-indigo-600" />
                      Verified Tele-Practice
                    </span>
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px]">
                      PMDC Required
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Doctor Features Grid */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Doctor Capabilities on Bharosa Lab
              </h2>
              <p className="text-slate-600 text-sm">
                A digital suite tailored for accessible telemedicine and patient review.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Doctor Profile & Bio</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Showcase your medical specialization, qualifications, and clinical experience to patients seeking guidance.
                </p>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Consultation Availability</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Define your weekly hours and consultation slots that align with your clinical schedule.
                </p>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Online Consultations</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Interact with patients remotely to address health questions and review diagnostic findings.
                </p>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#1E3A5F] text-white flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Consultation History</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Access records of completed consultations and relevant patient documentation according to system workflows.
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* Doctor Registration / Inquiry Section */}
        <section id="join-form" className="py-16 bg-slate-50 border-t border-slate-200/80">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl space-y-8">
              
              <div className="space-y-2 text-center sm:text-left">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  Doctor Registration
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  Join as a Participating Doctor
                </h2>
                <p className="text-slate-600 text-sm">
                  Please provide your professional medical credentials. Our team reviews all applications to ensure patient safety and quality standards before platform onboarding.
                </p>
              </div>

              {submitted ? (
                <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4">
                  <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h3 className="text-xl font-bold text-emerald-900">Application Received</h3>
                  <p className="text-sm text-emerald-700 max-w-md mx-auto">
                    Thank you for applying to the Bharosa Lab medical network. Our team will review your qualifications and reach out to you at <strong>{formData.email || formData.phone}</strong>.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); }}
                    className="text-xs font-bold text-emerald-800 underline pt-2"
                  >
                    Submit another application
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase">
                        Full Name (with Dr. Title) *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="e.g. Dr. Ayesha Khan"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase">
                        Primary Specialization *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.specialization}
                        onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                        placeholder="e.g. General Physician, Pathologist, Cardiologist"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase">
                        Qualifications & Degrees *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.qualifications}
                        onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
                        placeholder="e.g. MBBS, FCPS"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase">
                        Years of Experience *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.experienceYears}
                        onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                        placeholder="e.g. 5+ Years"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 text-sm"
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
                        placeholder="e.g. 03001234567"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase">
                        Official Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="doctor@example.com"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 text-sm"
                      />
                    </div>

                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase">
                      Preferred Consultation Availability
                    </label>
                    <input
                      type="text"
                      value={formData.availability}
                      onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                      placeholder="e.g. Weekday evenings, 6:00 PM - 9:00 PM"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase">
                      Additional Professional Notes / Verification Details
                    </label>
                    <textarea
                      rows={3}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Share PMDC/license number, hospital affiliations, or specific medical interests..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 text-sm"
                    />
                  </div>

                  {/* Responsible Verification Notice */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3 text-xs text-slate-600">
                    <AlertCircle className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Verification Policy:</strong> Applications are reviewed against official medical licensing and credentials prior to activation on the platform. Submission does not guarantee immediate platform listing.
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Doctor Application</span>
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
