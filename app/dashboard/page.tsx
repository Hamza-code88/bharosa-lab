"use client";

import React, { useState, useEffect } from 'react';
import { Users, FileText, Wallet, TrendingUp, FlaskConical, Loader2, Scissors, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase'; 

export default function DashboardPage() {
  const [stats, setStats] = useState({
    earnings: 0,
    newOrders: 0,
    catalogTests: 0,
    totalPatients: 0,
    commissionCut: 0, // 🛑 Current Due Commission
    netProfit: 0      // 🛑 Current Net Profit
  });
  
  const [commissionRate, setCommissionRate] = useState(0); 
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      setIsLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return;

        // 🛑 NAYA: Fetch `last_cleared_date` along with ID
        const { data: lab } = await supabase
          .from('labs')
          .select('id, last_cleared_date')
          .eq('owner_id', session.user.id)
          .single();
          
        if (!lab) {
          setIsLoading(false);
          return;
        }

        const { data: settings } = await supabase.from('app_settings').select('commission_percentage').eq('id', 1).single();
        const rate = settings?.commission_percentage || 0;
        setCommissionRate(rate);

        const { data: bookings } = await supabase
          .from('bookings')
          .select('total_amount, status, patient_phone, created_at')
          .eq('lab_id', lab.id);

        const { count: testCount } = await supabase
          .from('lab_tests')
          .select('*', { count: 'exact', head: true })
          .eq('lab_id', lab.id);

        if (bookings) {
          // 🛑 NAYA LOGIC: Filter bookings for the CURRENT billing cycle only
          const currentCycleBookings = bookings.filter(b => {
            if (!lab.last_cleared_date) return true; // Never cleared, count all
            return new Date(b.created_at) > new Date(lab.last_cleared_date);
          });

          // Calculations for Current Cycle Earnings
          const currentCycleEarnings = currentCycleBookings
            .filter(b => ['completed', 'sample_collected', 'report_uploaded'].includes(b.status.toLowerCase()))
            .reduce((sum, b) => sum + (b.total_amount || 0), 0);

          // These can remain life-time or switch to current cycle. Keeping them life-time for better overview.
          const pendingOrders = bookings.filter(b => b.status.toLowerCase() === 'pending').length;
          const uniquePatientsCount = new Set(bookings.map(b => b.patient_phone)).size;

          // 🛑 CURRENT COMMISSION DUE
          const currentDue = currentCycleEarnings * (rate / 100);
          const currentProfit = currentCycleEarnings - currentDue;

          setStats({
            earnings: currentCycleEarnings,
            newOrders: pendingOrders,
            catalogTests: testCount || 0,
            totalPatients: uniquePatientsCount,
            commissionCut: Math.round(currentDue),
            netProfit: Math.round(currentProfit)
          });
        }
      } catch (error) {
        console.error("Dashboard Stats Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <div className="space-y-6 sm:space-y-8 px-4 sm:px-0">
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Current Billing Cycle</h2>
        <p className="text-gray-500 mt-1 text-sm sm:text-base">Monitor your performance since your last bill clearance.</p>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
        
        {/* Total Billed (Current Cycle) */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 rounded-bl-full -mr-4 -mt-4 z-0"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-3 sm:mb-4">
              <div className="bg-gray-100 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl">
                <Wallet className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
              </div>
            </div>
            <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Billed (Current Cycle)</p>
            <h3 className="text-2xl sm:text-3xl font-black text-gray-800 flex items-center gap-2">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin text-gray-300" /> : `Rs. ${stats.earnings.toLocaleString()}`}
            </h3>
          </div>
        </div>

        {/* Platform Commission (Current Due) */}
        <div className="bg-red-50 p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-red-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-red-100 rounded-bl-full -mr-4 -mt-4 z-0"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-3 sm:mb-4">
              <div className="bg-red-500 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl shadow-sm shadow-red-200">
                <Scissors className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-red-700 bg-red-100 px-2 py-1 rounded-lg text-[10px] sm:text-xs font-bold">
                {commissionRate}% Cut
              </span>
            </div>
            <p className="text-[10px] sm:text-xs font-bold text-red-400 uppercase tracking-wider mb-1">Current Due Commission</p>
            <h3 className="text-2xl sm:text-3xl font-black text-red-600 flex items-center gap-2">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin text-red-300" /> : `- Rs. ${stats.commissionCut.toLocaleString()}`}
            </h3>
          </div>
        </div>

        {/* Net Profit (Current Cycle) */}
        <div className="bg-green-500 p-5 sm:p-6 rounded-2xl sm:rounded-3xl shadow-lg shadow-green-500/30 relative overflow-hidden sm:col-span-2 lg:col-span-1">
          <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-bl-full -mr-4 -mt-4 z-0"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-3 sm:mb-4">
              <div className="bg-white/20 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border border-white/20">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="flex items-center gap-1 text-green-900 bg-green-100 px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-bold">
                <TrendingUp size={12} strokeWidth={3} /> Clear Profit
              </span>
            </div>
            <p className="text-[10px] sm:text-xs font-bold text-green-100 uppercase tracking-wider mb-1">Net Earnings (Current Cycle)</p>
            <h3 className="text-3xl sm:text-4xl font-black text-white flex items-center gap-2 tracking-tight">
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin text-green-200" /> : `Rs. ${stats.netProfit.toLocaleString()}`}
            </h3>
          </div>
        </div>

      </div>

      {/* Other Stats Cards (Kept as Lifetime/Current pending state) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        
        <div className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-purple-50/50 rounded-bl-full -mr-4 -mt-4 z-0"></div>
          <div className="relative z-10">
            <div className="bg-purple-600 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl shadow-sm shadow-purple-200 w-max mb-3 sm:mb-4">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Pending Orders</p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin text-gray-300" /> : stats.newOrders}
            </h3>
          </div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-orange-50/50 rounded-bl-full -mr-4 -mt-4 z-0"></div>
          <div className="relative z-10">
            <div className="bg-orange-500 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl shadow-sm shadow-orange-200 w-max mb-3 sm:mb-4">
              <FlaskConical className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Tests in Catalog</p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin text-gray-300" /> : stats.catalogTests}
            </h3>
          </div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-emerald-50/50 rounded-bl-full -mr-4 -mt-4 z-0"></div>
          <div className="relative z-10">
            <div className="bg-emerald-500 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl shadow-sm shadow-emerald-200 w-max mb-3 sm:mb-4">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Unique Patients</p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin text-gray-300" /> : stats.totalPatients}
            </h3>
          </div>
        </div>

      </div>
    </div>
  );
}