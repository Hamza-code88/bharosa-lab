"use client";
import Image from 'next/image';
import { supabase } from '../lib/supabase';
import logo from '../public/logo.png'
export default function AdminLoginPage() {

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
    <div className="min-h-screen flex bg-white font-sans">
      
      {/* 1. LEFT SIDE: Clean, Minimalist Form & Logo */}
      <div className="w-full lg:w-1/2 flex flex-col px-8 sm:px-16 xl:px-24 justify-center relative z-10">
        
        <div className="w-full max-w-md mx-auto">
          {/* Main Logo */}
         <div className="relative -top-32 -left-48 flex flex-col justify-center items-center">
  <Image 
    src={logo}
    alt="Bharosa Lab" 
    width={230} 
    height={120} 
    className="object-contain"
    priority
  />
  
  <h1 className='text-xl font-extrabold text-blue-600 -mt-6'>
    Bharosa Lab
  </h1>
</div>

          <div className="mb-10 -ml-6 ">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">
              Partner Portal Login
            </h2>
            <p className="text-gray-500 font-medium leading-relaxed">
              Securely access your lab dashboard to manage bookings, tests, and digital reports.
            </p>
          </div>

          {/* Clean Corporate Google Button */}
          <button 
            onClick={handleGoogleLogin}
            className="w-full bg-white hover:bg-gray-50 text-gray-800 font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-3 border border-gray-300 hover:border-gray-400 hover:shadow-sm transition-all duration-200 -ml-6"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <p className="text-gray-400 text-xs mt-8 -ml-6">
            By logging in, you agree to Bharosa Lab&apos;s Terms of Service and Privacy Policy. Only authorized lab administrators can access this portal.
          </p>
        </div>
      </div>

      {/* 2. RIGHT SIDE: Enterprise, Mature, High-Trust Corporate Design */}
      <div className="hidden lg:flex w-1/2 bg-[#0B1120] relative items-center justify-center">
        
        {/* Subtle High-End Lab Background Image Overlay */}
        <div className="absolute inset-0 overflow-hidden">
          {/* 🛑 FIX: <img> hata kar Next.js ka <Image /> lagaya */}
          <Image 
            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2000&auto=format&fit=crop" 
            fill
            sizes="50vw"
            className="object-cover opacity-[0.12] grayscale" 
            alt="Modern Medical Laboratory" 
            unoptimized
          />
          {/* Gradient to smooth out the image */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-transparent to-[#0B1120]/80 z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1120] to-transparent z-10"></div>
        </div>

        <div className="relative z-20 w-full max-w-xl px-12">
          
          <h2 className="text-4xl xl:text-[42px] font-light text-white leading-[1.2] mb-6">     
  ہمارے ساتھ اپنی لیبارٹری کا کاروبار اور آمدنی بڑھائیں۔ 
          </h2>
          
          <p className="text-gray-400 text-lg leading-relaxed mb-12">
           بھروسہ لیب کے ایک انتہائی محفوظ اور جدید ڈیجیٹل نیٹ ورک میں شامل ہوں۔ اپنے روزمرہ کے لیب آپریشنز کو آسان بنائیں، میڈیکل ریکارڈز کو ڈیجیٹل کریں، اور ہزاروں نئے مریضوں تک باآسانی رسائی حاصل کریں۔
          </p>

          {/* Mature Corporate Trust Indicators */}
          <div className="flex gap-12 border-t border-gray-800 pt-8">
            <div>
              <h4 className="text-3xl font-bold text-white mb-1">100%</h4>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Trusted Network</p>
            </div>
            <div>
              <h4 className="text-3xl font-bold text-white mb-1">100%</h4>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Secure Data</p>
            </div>
            <div>
              <h4 className="text-3xl font-bold text-white mb-1">24/7</h4>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Partner Support</p>
            </div>
          </div>

        </div>

        {/* Footer info on right side */}
        <div className="absolute bottom-8 left-12 text-gray-600 text-sm font-medium z-20">
          © 2026 Bharosa Lab Enterprise.
        </div>
      </div>

    </div>
  );
}