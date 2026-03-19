"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';
import Sidebar from '../components/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  // 🛑 NAYA: High-Security Auth & Billing Guard
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
        .select('is_active, payment_status, last_cleared_month')
        .eq('owner_id', session.user.id)
        .single();

      if (!lab) {
        setIsAuthorized(true);
        return;
      }

      // 2. Super Admin Manual Block Check
      // Agar aapne Super Admin panel se usko Inactive (Block) kar diya hai
      if (lab.is_active === false) {
        router.push('/payment');
        return;
      }

      // 3. Grace Period & Billing Check (The 5th of Month Logic)
      const today = new Date();
      const currentDay = today.getDate();

      // Pichle mahine ka String banate hain (e.g. "2026-02")
      const prevDate = new Date();
      prevDate.setMonth(today.getMonth() - 1);
      const prevMonthStr = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`;

      // Check: Agar aaj 5 tareekh se oopar hai AUR pichle mahine ka bill clear nahi hua
      const isOverdue = currentDay > 5 && lab.last_cleared_month !== prevMonthStr;

      if (isOverdue || lab.payment_status === 'submitted') {
        // Unka time khatam! Seedha payment page par phenko
        router.push('/payment');
        return;
      }

      // Agar sab theek hai toh Entry Pass do
      setIsAuthorized(true);
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
      
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        
        <header className="h-[72px] bg-white border-b border-gray-100 flex items-center justify-between px-8 shadow-sm z-0">
          <h1 className="text-xl font-extrabold text-gray-800 tracking-tight">Partner Portal</h1>
          
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