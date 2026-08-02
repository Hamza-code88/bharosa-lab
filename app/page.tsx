"use client";
import React from 'react';
import Image from 'next/image';
import { supabase } from '../lib/supabase';
import logo from '../public/logo.png';

import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();

  React.useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push('/dashboard');
      }
    });
  }, [router]);

  const handleGoogleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard` 
      }
    });

    if (error) {
      console.error("Login Error:", error.message);
      alert("Login failed!");
    }
  };

  return (
    // 🛑 NAYA: flex-col on mobile, flex-row on desktop (lg)
    <div className="min-h-screen flex flex-col lg:flex-row bg-white font-sans overflow-hidden">
      
      {/* 1. LEFT SIDE: Clean, Minimalist Form & Logo */}
      <div className="w-full lg:w-1/2 flex flex-col px-6 sm:px-12 md:px-16 xl:px-24 justify-center py-12 lg:min-h-screen relative z-10 bg-white shadow-[10px_0_30px_rgba(0,0,0,0.02)]">
        
        <div className="w-full max-w-md mx-auto">
          
          {/* Main Logo */}
          <div className="flex flex-col items-center mb-10 sm:mb-14">
            <Image 
              src={logo}
              alt="Bharosa Lab" 
              width={200} 
              height={100} 
              className="object-contain w-[180px] sm:w-[230px]"
              priority
            />
            <h1 className='text-xl sm:text-2xl font-extrabold text-blue-600 mt-2'>
              Bharosa Lab
            </h1>
          </div>

          {/* Heading Area */}
          <div className="mb-8 sm:mb-10 text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">
              Partner Portal Login
            </h2>
            <p className="text-gray-500 text-sm sm:text-base font-medium leading-relaxed">
              Securely access your lab dashboard to manage bookings, tests, and digital reports.
            </p>
          </div>

          {/* Clean Corporate Google Button */}
          <button 
            onClick={handleGoogleLogin}
            className="w-full bg-white hover:bg-gray-50 text-gray-800 font-bold py-3.5 sm:py-4 px-4 rounded-xl flex items-center justify-center gap-3 border border-gray-300 hover:border-gray-400 hover:shadow-sm transition-all duration-200 text-sm sm:text-base"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <p className="text-gray-400 text-[11px] sm:text-xs mt-6 sm:mt-8 text-center sm:text-left">
            By logging in, you agree to Bharosa Lab&apos;s Terms of Service and Privacy Policy. Only authorized lab administrators can access this portal.
          </p>
        </div>
      </div>

      {/* 2. RIGHT SIDE: Enterprise, Mature, High-Trust Corporate Design */}
      {/* 🛑 FIX: Mobile par display hoga, lakin flex-col layout ke sath neeche */}
      <div className="w-full lg:w-1/2 flex bg-[#0B1120] relative items-center justify-center py-16 lg:py-0 lg:min-h-screen">
        
        {/* Subtle High-End Lab Background Image Overlay */}
        <div className="absolute inset-0 overflow-hidden">
          <Image 
            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2000&auto=format&fit=crop" 
            fill
            sizes="50vw"
            className="object-cover opacity-[0.15] grayscale" 
            alt="Modern Medical Laboratory" 
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-[#0B1120]/80 to-transparent z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1120] via-transparent to-transparent z-10 hidden lg:block"></div>
        </div>

        <div className="relative z-20 w-full max-w-xl px-8 sm:px-12 flex flex-col items-center lg:items-end text-center lg:text-right">
          
          <h2 dir="rtl" className="text-3xl sm:text-4xl xl:text-[42px] font-light text-white leading-tight mb-6">     
            ہمارے ساتھ اپنی لیبارٹری کا کاروبار اور آمدنی بڑھائیں۔ 
          </h2>
          
          <p dir="rtl" className="text-gray-400 text-base sm:text-lg leading-relaxed mb-10 lg:mb-12">
           بھروسہ لیب کے ایک انتہائی محفوظ اور جدید ڈیجیٹل نیٹ ورک میں شامل ہوں۔ اپنے روزمرہ کے لیب آپریشنز کو آسان بنائیں، میڈیکل ریکارڈز کو ڈیجیٹل کریں، اور ہزاروں نئے مریضوں تک باآسانی رسائی حاصل کریں۔
          </p>

          {/* Mature Corporate Trust Indicators */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-8 xl:gap-12 border-t border-gray-800 pt-8 w-full">
            <div className="text-center lg:text-left">
              <h4 className="text-2xl xl:text-3xl font-bold text-white mb-1">100%</h4>
              <p className="text-[10px] xl:text-xs text-gray-500 font-bold uppercase tracking-wider">Trusted Network</p>
            </div>
            <div className="text-center lg:text-left">
              <h4 className="text-2xl xl:text-3xl font-bold text-white mb-1">100%</h4>
              <p className="text-[10px] xl:text-xs text-gray-500 font-bold uppercase tracking-wider">Secure Data</p>
            </div>
            <div className="text-center lg:text-left">
              <h4 className="text-2xl xl:text-3xl font-bold text-white mb-1">24/7</h4>
              <p className="text-[10px] xl:text-xs text-gray-500 font-bold uppercase tracking-wider">Partner Support</p>
            </div>
          </div>

        </div>

        {/* Footer info */}
        <div className="absolute bottom-6 w-full text-center lg:w-auto lg:text-left lg:left-12 text-gray-600 text-xs sm:text-sm font-medium z-20">
          © 2026 Bharosa Lab Enterprise.
        </div>
      </div>

    </div>
  );
}