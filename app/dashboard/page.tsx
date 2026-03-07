"use client";

import React, { useState, useEffect } from 'react';
import { Users, FileText, Wallet, TrendingUp, FlaskConical, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase'; // Path check kar lijiye ga

export default function DashboardPage() {
  const [stats, setStats] = useState({
    earnings: 0,
    newOrders: 0,
    catalogTests: 0,
    totalPatients: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      setIsLoading(true);
      try {
        // 1. Logged in user aur Lab ID nikalna
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return;

        const { data: lab } = await supabase.from('labs').select('id').eq('owner_id', session.user.id).single();
        if (!lab) {
          setIsLoading(false);
          return;
        }

        // 2. Bookings data fetch karna (Earnings, Orders, Patients ke liye)
        const { data: bookings } = await supabase
          .from('bookings')
          .select('total_amount, status, patient_phone')
          .eq('lab_id', lab.id);

        // 3. Catalog Tests count karna
        const { count: testCount } = await supabase
          .from('lab_tests')
          .select('*', { count: 'exact', head: true })
          .eq('lab_id', lab.id);

        if (bookings) {
          // Calculations
          const totalEarnings = bookings
            .filter(b => b.status.toLowerCase() === 'completed')
            .reduce((sum, b) => sum + (b.total_amount || 0), 0);

          const pendingOrders = bookings.filter(b => b.status.toLowerCase() === 'pending').length;

          // Unique patients nikalne ke liye Set use kiya (Duplicate numbers ignore honge)
          const uniquePatientsCount = new Set(bookings.map(b => b.patient_phone)).size;

          setStats({
            earnings: totalEarnings,
            newOrders: pendingOrders,
            catalogTests: testCount || 0,
            totalPatients: uniquePatientsCount
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
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Dashboard Overview</h2>
        <p className="text-gray-500 mt-1 text-base">Monitor your laboratory&lsquo;s daily performance and test requests.</p>
      </div>

      {/* 🌟 Premium Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Earnings */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-bl-full -mr-4 -mt-4 transition-transform duration-500 group-hover:scale-110 z-0"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-blue-600 p-3.5 rounded-2xl shadow-sm shadow-blue-200">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              {stats.earnings > 0 && (
                <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2.5 py-1 rounded-lg text-xs font-bold">
                  <TrendingUp size={12} strokeWidth={3} /> Active
                </span>
              )}
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Earnings</p>
            <h3 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin text-gray-300" /> : `Rs. ${stats.earnings.toLocaleString()}`}
            </h3>
          </div>
        </div>

        {/* Card 2: Test Orders */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50/50 rounded-bl-full -mr-4 -mt-4 transition-transform duration-500 group-hover:scale-110 z-0"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-purple-600 p-3.5 rounded-2xl shadow-sm shadow-purple-200">
                <FileText className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">New Test Orders</p>
            <h3 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin text-gray-300" /> : stats.newOrders}
            </h3>
          </div>
        </div>

        {/* Card 3: Active Tests */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50/50 rounded-bl-full -mr-4 -mt-4 transition-transform duration-500 group-hover:scale-110 z-0"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-orange-500 p-3.5 rounded-2xl shadow-sm shadow-orange-200">
                <FlaskConical className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Tests in Catalog</p>
            <h3 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin text-gray-300" /> : stats.catalogTests}
            </h3>
          </div>
        </div>

        {/* Card 4: Total Patients */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50/50 rounded-bl-full -mr-4 -mt-4 transition-transform duration-500 group-hover:scale-110 z-0"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-emerald-500 p-3.5 rounded-2xl shadow-sm shadow-emerald-200">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Patients</p>
            <h3 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin text-gray-300" /> : stats.totalPatients}
            </h3>
          </div>
        </div>

      </div>
    </div>
  );
}