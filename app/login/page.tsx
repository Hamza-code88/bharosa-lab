"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import logo from '../../public/logo.png';
import { ShieldCheck, ArrowLeft, Building2, FlaskConical, CheckCircle2, Lock, Loader2 } from 'lucide-react';

export default function PartnerLoginPage() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push('/dashboard');
      } else {
        setIsCheckingAuth(false);
      }
    });
  }, [router]);

  const handleGoogleLogin = async () => {
    try {
      setIsLoggingIn(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        console.error("Login Error:", error.message);
        alert("Login failed. Please check your connection and try again.");
        setIsLoggingIn(false);
      }
    } catch (err) {
      console.error(err);
      setIsLoggingIn(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
          <p className="text-sm font-medium text-slate-600">Verifying session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white font-sans overflow-hidden">
      
      {/* LEFT SIDE: Clean Corporate Form */}
      <div className="w-full lg:w-1/2 flex flex-col px-6 sm:px-12 md:px-16 xl:px-24 justify-between py-8 sm:py-12 lg:min-h-screen relative z-10 bg-white shadow-xl lg:shadow-[10px_0_30px_rgba(0,0,0,0.03)]">
        
        {/* Top Back Link */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Public Website</span>
          </Link>
        </div>

        {/* Center Form */}
        <div className="w-full max-w-md mx-auto my-8">
          {/* Main Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-16 h-16 mb-2">
              <Image 
                src={logo}
                alt="Bharosa Lab" 
                fill
                className="object-contain"
                priority
              />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Bharosa <span className="text-blue-600">Lab</span>
            </h1>
            <span className="text-xs font-semibold text-slate-500 mt-0.5">
              Partner Laboratory Portal
            </span>
          </div>

          {/* Heading */}
          <div className="mb-8 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 mb-3">
              <Lock className="w-3.5 h-3.5" />
              Secure Diagnostic Workspace
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Sign In to Your Lab
            </h2>
            <p className="text-slate-500 text-sm mt-2 leading-relaxed">
              Access your digital laboratory dashboard to manage catalog tests, patient sample orders, and report submissions.
            </p>
          </div>

          {/* Google Sign In Button */}
          <button 
            onClick={handleGoogleLogin}
            disabled={isLoggingIn}
            className="w-full bg-white hover:bg-slate-50 text-slate-800 font-bold py-3.5 sm:py-4 px-4 rounded-xl flex items-center justify-center gap-3 border border-slate-300 hover:border-slate-400 hover:shadow-md transition-all duration-200 text-sm sm:text-base disabled:opacity-50 cursor-pointer"
          >
            {isLoggingIn ? (
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            ) : (
              <svg className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            <span>{isLoggingIn ? "Redirecting to Google..." : "Continue with Google"}</span>
          </button>

          <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-1.5">
            <p className="font-semibold text-slate-800 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-blue-600" />
              New Diagnostic Laboratory?
            </p>
            <p>
              Sign in with your Google account to initialize your laboratory profile and test catalog. New laboratories enjoy an initial 30-day onboarding trial period.
            </p>
          </div>

          <p className="text-slate-400 text-[11px] sm:text-xs mt-6 text-center sm:text-left">
            By signing in, you agree to Bharosa Lab&apos;s <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link> and <Link href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
          </p>
        </div>

        {/* Footer info */}
        <div className="text-slate-400 text-xs text-center sm:text-left">
          Helpline: <strong className="text-slate-700">03141811158</strong>
        </div>
      </div>

      {/* RIGHT SIDE: Enterprise Laboratory Showcase (100% English) */}
      <div className="w-full lg:w-1/2 flex bg-slate-900 text-white relative items-center justify-center py-16 lg:py-0 lg:min-h-screen px-6 sm:px-12">
        
        {/* Background Overlay */}
        <div className="absolute inset-0 overflow-hidden">
          <Image 
            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2000&auto=format&fit=crop" 
            fill
            sizes="50vw"
            className="object-cover opacity-10 grayscale" 
            alt="Medical Laboratory" 
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/90 to-slate-900/90 z-10"></div>
        </div>

        <div className="relative z-20 w-full max-w-lg space-y-8">
          
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-400/30">
              <FlaskConical className="w-3.5 h-3.5" />
              Partner Lab Network
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight tracking-tight">
              Empower Your Diagnostic Laboratory with Digital Reach.
            </h2>
            <p className="text-slate-300 text-base leading-relaxed">
              Connect to the Bharosa Lab digital healthcare ecosystem. Manage online bookings, deliver verified digital reports to patients, and track your platform activity from a single, intuitive portal.
            </p>
          </div>

          {/* Portal Feature List */}
          <div className="space-y-3.5 pt-2">
            {[
              "Real-time patient test booking notifications",
              "Direct digital PDF report uploads for patients",
              "Transparent order history and earning metrics",
              "Configurable test catalog and pricing controls"
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3 text-sm text-slate-200">
                <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          {/* Trust Metrics */}
          <div className="grid grid-cols-3 gap-4 border-t border-slate-800 pt-6">
            <div>
              <p className="text-xl sm:text-2xl font-black text-white">Centralized</p>
              <p className="text-[11px] text-slate-400 font-medium">Lab Management</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black text-white">Digital</p>
              <p className="text-[11px] text-slate-400 font-medium">Report Delivery</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black text-white">Dedicated</p>
              <p className="text-[11px] text-slate-400 font-medium">Partner Support</p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
