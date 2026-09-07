// app/dashboard/layout.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Loader2, Menu, Volume2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Sidebar from '../components/Sidebar';
import PwaInstallPrompt from '../components/PwaInstallPrompt';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // 🛑 NAYA: Mobile Sidebar State

  // 🛑 NAYA: High-Security Auth & Rolling Threshold Guard
  useEffect(() => {
    const checkAuthAndBilling = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) {
        router.push('/');
        return;
      }

      // 1. Fetch Lab Security Data
      const { data: lab } = await supabase
        .from('labs')
        .select('id, name, is_active, payment_status, last_cleared_date, created_at, is_registered_paid, registration_status')
        .eq('owner_id', session.user.id)
        .maybeSingle();

      const currentPath = window.location.pathname;

      // 1.1 ONBOARDING: No Lab Profile
      if (!lab || !lab.name) {
        if (!currentPath.includes('/dashboard/labprofile')) {
          router.replace('/dashboard/labprofile');
        } else {
          setIsAuthorized(true);
        }
        return;
      }

      // 1.2 ONBOARDING: No Tests Added
      const { count: testCount } = await supabase.from('lab_tests').select('*', { count: 'exact', head: true }).eq('lab_id', lab.id);
      if (testCount === 0) {
        if (!currentPath.includes('/dashboard/tests') && !currentPath.includes('/dashboard/labprofile')) {
          router.replace('/dashboard/tests');
        } else {
          setIsAuthorized(true);
        }
        return;
      }

      // 1.3 TRIAL CHECK: 30 Days Registration
      if (lab.created_at) {
        const trialDays = Math.floor((Date.now() - new Date(lab.created_at).getTime()) / (1000 * 60 * 60 * 24));
        if (trialDays >= 30 && !lab.is_registered_paid) {
          router.replace('/payment');
          return;
        }
      }

      // 2. Super Admin Manual Block Check
      if (lab.is_active === false) {
        router.push('/payment');
        return;
      }

      // 3. Rolling Limit (Threshold) Check
      try {
        // Fetch Settings for Rate & Threshold
        const { data: settings } = await supabase.from('app_settings').select('commission_percentage, commission_threshold').eq('id', 1).single();
        const rate = settings?.commission_percentage || 0;
        const threshold = settings?.commission_threshold || 2000;

        // Fetch Bookings generated AFTER the last_cleared_date
        let query = supabase
          .from('bookings')
          .select('total_amount')
          .eq('lab_id', lab.id)
          .eq('status', 'Completed');

        if (lab.last_cleared_date) {
          query = query.gte('created_at', lab.last_cleared_date);
        }

        const { data: bookings } = await query;

        let totalBilled = 0;
        if (bookings) {
          totalBilled = bookings.reduce((sum, b) => sum + (b.total_amount || 0), 0);
        }

        const currentCommissionDue = Math.round(totalBilled * (rate / 100));

        // Block Condition: Agar due amount threshold cross kar jaye ya already submitted ho
        if (currentCommissionDue >= threshold || lab.payment_status === 'submitted') {
          router.push('/payment');
          return;
        }

        // Agar sab clear hai aur limit cross nahi hui toh entry de do
        setIsAuthorized(true);
      } catch (error) {
        console.error("Error checking threshold logic:", error);
        // Error ki soorat mein fail-safe: Entry rok do ya secure log out kar do, filhal block karte hain
        router.push('/payment'); 
      }
    };

    checkAuthAndBilling();
  }, [router, pathname]); // 🛑 NAYA: Re-run check on every route change

  if (!isAuthorized) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="animate-spin text-blue-600 w-12 h-12" />
      </div>
    );
  }

  const testAlertSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const now = ctx.currentTime;
        const playTone = (freq: number, start: number, dur: number) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + start);
          gain.gain.setValueAtTime(0.5, now + start);
          gain.gain.exponentialRampToValueAtTime(0.01, now + start + dur);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + start);
          osc.stop(now + start + dur);
        };
        playTone(784, 0, 0.25);
        playTone(1046, 0.2, 0.35);
        playTone(784, 0.5, 0.25);
        playTone(1175, 0.7, 0.45);
      }
      const audio = new Audio('/sounds/order_alert.wav');
      audio.play().catch(() => {});
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([0, 300, 100, 300]);
      }
      toast.success("Order Alert Sound Active! 🔔");
    } catch (e) {
      console.warn("Test sound error:", e);
    }
  };

  // 👇 Yahan se aapka original design
  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      <PwaInstallPrompt />
      <Sidebar isMobileMenuOpen={isMobileMenuOpen} onCloseMobile={() => setIsMobileMenuOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        
        <header className="h-[72px] bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-8 shadow-sm z-10">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileMenuOpen(true)} 
              className="md:hidden p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-extrabold text-gray-800 tracking-tight">Partner Portal</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={testAlertSound}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition active:scale-95 shadow-xs"
              title="Test Order Alert Sound and Unlock Audio"
            >
              <Volume2 size={15} />
              <span>Test Sound</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-sm font-bold text-gray-600 tracking-wide uppercase hidden sm:inline">System Online</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}