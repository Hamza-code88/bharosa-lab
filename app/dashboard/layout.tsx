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

  // 🛑 NAYA: Security Auth Guard
  useEffect(() => {
    const checkAuth = async () => {
      // Supabase se pucho ke user login hai ya nahi
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) {
        // Agar login nahi hai, toh seedha Login Page (Root) par dhakka do
        router.push('/');
      } else {
        // Agar login hai, toh entry pass do
        setIsAuthorized(true);
      }
    };

    checkAuth();
  }, [router]);

  // 🛑 NAYA: Jab tak auth check ho raha hai, loading ghumao
  if (!isAuthorized) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="animate-spin text-blue-600 w-12 h-12" />
      </div>
    );
  }

  // 👇 Yahan se aapka original design shuru ho raha hai
  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      
      {/* 1. Componentized Sidebar */}
      <Sidebar />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Clean & Professional Header */}
        <header className="h-[72px] bg-white border-b border-gray-100 flex items-center justify-between px-8 shadow-sm z-0">
          <h1 className="text-xl font-extrabold text-gray-800 tracking-tight">Partner Portal</h1>
          
          {/* System Online Status */}
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-sm font-bold text-gray-600 tracking-wide uppercase">System Online</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}