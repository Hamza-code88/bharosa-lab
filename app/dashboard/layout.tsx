// app/dashboard/layout.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Loader2, Menu } from 'lucide-react';
import Sidebar from '../components/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
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

      // 1. Fetch Lab Security Data (Now using last_cleared_date)
      const { data: lab } = await supabase
        .from('labs')
        .select('id, is_active, payment_status, last_cleared_date')
        .eq('owner_id', session.user.id)
        .single();

      if (!lab) {
        setIsAuthorized(true);
        return;
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
  }, [router]);

  if (!isAuthorized) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="animate-spin text-blue-600 w-12 h-12" />
      </div>
    );
  }

  // 👇 Yahan se aapka original design
  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      
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
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-sm font-bold text-gray-600 tracking-wide uppercase">System Online</span>
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