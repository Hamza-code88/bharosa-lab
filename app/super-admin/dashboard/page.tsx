"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Users, FlaskConical, Building2, TrendingUp, Loader2, Wallet, PhoneCall } from 'lucide-react';

export interface DashboardStats {
  totalPatients: number;
  totalLabs: number;
  totalTestsDone: number;
  revenueGenerated: number;
  platformCommission: number;
  appOrders: number;
  manualOrders: number;
}

export interface LabPerformance {
  lab_name: string;
  test_count: number;
  total_revenue: number;    // Lifetime
  current_revenue: number;  // After last cleared date
  platform_cut: number;     // Lifetime commission
  current_cut: number;      // Current unpaid commission
  last_paid_amount: number; // NAYA: Last Paid
  last_cleared_date: string | null; // NAYA: Date of Last Paid
}

export interface RecentBooking {
  id: string;
  patient_name: string;
  lab_name: string;
  date: string;
  status: string;
  price: number;
}

export default function AllDataDashboard() {
  const [stats, setStats] = useState<DashboardStats>({ totalPatients: 0, totalLabs: 0, totalTestsDone: 0, revenueGenerated: 0, platformCommission: 0, appOrders: 0, manualOrders: 0 });
  const [labPerformance, setLabPerformance] = useState<LabPerformance[]>([]);
  const [recentTests, setRecentTests] = useState<RecentBooking[]>([]);
  const [commissionRate, setCommissionRate] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch Commission Rate
      const { data: settings } = await supabase.from('app_settings').select('commission_percentage').eq('id', 1).single();
      const rate = settings?.commission_percentage || 0;
      setCommissionRate(rate);

      // 2. Fetch Users & Labs (With exact counts, dates, and last paid)
      const { count: patientCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'patient');
      const { data: labsData, count: labCount } = await supabase.from('labs').select('id, name, last_cleared_date, last_paid_amount, commission_percentage', { count: 'exact' });

      // Create a map for quick lab info lookup
      const labInfoMap: Record<string, { name: string, last_cleared: string | null, last_paid: number, custom_cut: number | null }> = {};
      if (labsData) {
        labsData.forEach(lab => {
          labInfoMap[lab.id] = { 
            name: lab.name, 
            last_cleared: lab.last_cleared_date,
            last_paid: lab.last_paid_amount || 0,
            custom_cut: (lab.commission_percentage !== null && lab.commission_percentage !== undefined)
              ? Number(lab.commission_percentage)
              : null
          };
        });
      }

      // 3. Fetch Bookings
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select(`id, created_at, status, total_amount, patient_name, lab_id, booking_source, labs ( name )`)
        .order('created_at', { ascending: false });

      if (bookingsData) {
        const bookings = bookingsData as any[]; 

        const completedTests = bookings.filter((b) => ['completed', 'sample_collected', 'report_uploaded'].includes(b.status?.toLowerCase()));
        const totalRevenue = completedTests.reduce((sum, curr) => sum + (Number(curr.total_amount) || 0), 0);
        
        // 🛑 Platform Commission Calculation (Lifetime - calculates based on each lab's custom cut or fallback global rate)
        const totalCommission = completedTests.reduce((sum, curr) => {
          const labEffectiveRate = (curr.lab_id && labInfoMap[curr.lab_id]?.custom_cut !== null && labInfoMap[curr.lab_id]?.custom_cut !== undefined)
            ? Number(labInfoMap[curr.lab_id].custom_cut)
            : rate;
          return sum + ((Number(curr.total_amount) || 0) * (labEffectiveRate / 100));
        }, 0);

        const appOrdersCount = bookings.filter((b) => b.booking_source !== 'whatsapp_call').length;
        const manualOrdersCount = bookings.filter((b) => b.booking_source === 'whatsapp_call').length;

        setStats({
          totalPatients: patientCount || 0,
          totalLabs: labCount || 0,
          totalTestsDone: completedTests.length,
          revenueGenerated: totalRevenue,
          platformCommission: Math.round(totalCommission),
          appOrders: appOrdersCount,
          manualOrders: manualOrdersCount
        });

        // 🛑 Lab-wise Performance & Current/Lifetime Calculations
        const labDataMap: Record<string, { count: number, total_revenue: number, current_revenue: number }> = {};
        
        completedTests.forEach((b) => {
          const labId = b.lab_id;
          if (!labId) return;

          const price = Number(b.total_amount) || 0;
          const bookingDate = new Date(b.created_at);
          const labDetails = labInfoMap[labId] || { name: 'Unknown Lab', last_cleared: null, last_paid: 0, custom_cut: null };
          
          if (!labDataMap[labId]) {
            labDataMap[labId] = { count: 0, total_revenue: 0, current_revenue: 0 };
          }
          
          labDataMap[labId].count += 1;
          labDataMap[labId].total_revenue += price; // Add to lifetime

          // Check if this booking is AFTER the last cleared date (or if never cleared)
          if (!labDetails.last_cleared || bookingDate > new Date(labDetails.last_cleared)) {
            labDataMap[labId].current_revenue += price; // Add to current cycle
          }
        });

        const performanceArray = Object.keys(labDataMap).map(labId => {
          const labDetails = labInfoMap[labId];
          const lifetimeRev = labDataMap[labId].total_revenue;
          const currentRev = labDataMap[labId].current_revenue;
          const labCutRate = labDetails?.custom_cut ?? rate;

          return {
            lab_name: labDetails?.name || 'Unknown Lab',
            test_count: labDataMap[labId].count,
            total_revenue: lifetimeRev,
            current_revenue: currentRev,
            platform_cut: Math.round(lifetimeRev * (labCutRate / 100)), // Lifetime cut
            current_cut: Math.round(currentRev * (labCutRate / 100)),   // Current unpaid cut
            last_paid_amount: labDetails?.last_paid || 0,
            last_cleared_date: labDetails?.last_cleared || null
          };
        }).sort((a, b) => b.total_revenue - a.total_revenue); 

        setLabPerformance(performanceArray);

        const formattedRecent = bookings.slice(0, 8).map((booking) => ({
          id: booking.id,
          patient_name: booking.patient_name || 'Unknown Patient',
          lab_name: booking.labs?.name || 'Unknown Lab',
          date: new Date(booking.created_at).toLocaleDateString(),
          status: booking.status || 'Pending',
          price: Number(booking.total_amount) || 0
        }));
        setRecentTests(formattedRecent);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="flex h-[80vh] items-center justify-center"><Loader2 className="animate-spin text-blue-600 w-12 h-12" /></div>;

  return (
    <div className="p-8 max-w-7xl mx-auto font-sans">
      
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">System Overview</h1>
        <p className="text-gray-500 mt-2">High-level metrics for investors. Current Platform Commission is <strong className="text-blue-600">{commissionRate}%</strong>.</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-6 mb-10">
        <StatCard title="Total Users" value={stats.totalPatients} icon={<Users size={22} className="text-blue-600" />} bg="bg-blue-50" />
        <StatCard title="Partner Labs" value={stats.totalLabs} icon={<Building2 size={22} className="text-purple-600" />} bg="bg-purple-50" />
        <StatCard title="Tests Done" value={stats.totalTestsDone} icon={<FlaskConical size={22} className="text-green-600" />} bg="bg-green-50" />
        <StatCard title="App Orders" value={stats.appOrders} icon={<Users size={22} className="text-indigo-600" />} bg="bg-indigo-50" />
        <StatCard title="Call Orders" value={stats.manualOrders} icon={<PhoneCall size={22} className="text-emerald-600" />} bg="bg-emerald-50" />
        <StatCard title="Gross Revenue" value={`Rs. ${stats.revenueGenerated.toLocaleString()}`} icon={<TrendingUp size={22} className="text-gray-600" />} bg="bg-gray-100" />
        <StatCard title="Our Commission" value={`Rs. ${stats.platformCommission.toLocaleString()}`} icon={<Wallet size={22} className="text-orange-600" />} bg="bg-orange-50" highlight={true} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left: Recent Tests Table */}
        <div className="xl:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Recent Test Bookings</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
                  <th className="pb-3 font-bold">Patient Name</th>
                  <th className="pb-3 font-bold">Lab Name</th>
                  <th className="pb-3 font-bold">Date</th>
                  <th className="pb-3 font-bold">Amount</th>
                  <th className="pb-3 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {recentTests.length === 0 ? (
                  <tr><td colSpan={5} className="py-8 text-center text-gray-500">No bookings yet.</td></tr>
                ) : (
                  recentTests.map((test) => (
                    <tr key={test.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 font-bold text-gray-900">{test.patient_name}</td>
                      <td className="py-4 text-gray-800 font-medium">{test.lab_name}</td>
                      <td className="py-4 text-gray-600">{test.date}</td>
                      <td className="py-4 font-bold text-blue-600">Rs. {test.price}</td>
                      <td className="py-4">
                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${test.status.toLowerCase() === 'completed' ? 'bg-green-100 text-green-700' : test.status.toLowerCase() === 'pending' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700'}`}>
                          {test.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Lab Performance Leaderboard (Detailed Breakdown) */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Top Revenue Labs</h2>
          <div className="space-y-6">
            {labPerformance.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No data available.</p>
            ) : (
              labPerformance.slice(0, 5).map((lab, index) => (
                <div key={index} className="flex flex-col gap-2 border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                  
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm leading-tight">{lab.lab_name}</p>
                      <p className="text-xs text-gray-500 font-medium">{lab.test_count} Total Tests Done</p>
                    </div>
                  </div>

                  {/* 🛑 NAYA: Revenue & Commission Detailed Breakdown */}
                  <div className="flex flex-col gap-1.5 bg-gray-50 rounded-xl p-3.5 mt-1 border border-gray-100">
                    
                    {/* LIFETIME SECTION */}
                    <div className="flex justify-between items-center">
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">Lifetime Billed</p>
                      <p className="text-xs font-bold text-gray-700">Rs. {lab.total_revenue.toLocaleString()}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Lifetime Cut ({commissionRate}%)</p>
                      <p className="text-xs font-bold text-gray-500">Rs. {lab.platform_cut.toLocaleString()}</p>
                    </div>

                    <div className="border-t border-gray-200 my-1 pt-1"></div>

                    {/* CURRENT CYCLE SECTION */}
                    <div className="flex justify-between items-center">
                      <p className="text-[10px] text-blue-500 font-bold uppercase tracking-wide">Current Cycle (Unpaid)</p>
                      <p className="text-xs font-bold text-blue-700">Rs. {lab.current_revenue.toLocaleString()}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-[10px] text-red-500 font-bold uppercase tracking-wide">Current Due Cut</p>
                      <p className="text-xs font-extrabold text-red-600">+Rs. {lab.current_cut.toLocaleString()}</p>
                    </div>
                    
                    {/* LAST PAID SECTION */}
                    {lab.last_cleared_date && (
                      <div className="flex justify-between items-center border-t border-gray-200 mt-1 pt-1.5">
                        <p className="text-[10px] text-green-600 font-bold uppercase tracking-wide">Last Paid Amount</p>
                        <p className="text-xs font-bold text-green-700">Rs. {lab.last_paid_amount.toLocaleString()}</p>
                      </div>
                    )}

                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

// StatCard Component
function StatCard({ title, value, icon, bg, highlight = false }: { title: string, value: string | number, icon: React.ReactNode, bg: string, highlight?: boolean }) {
  return (
    <div className={`bg-white p-5 rounded-3xl shadow-sm border ${highlight ? 'border-orange-200 shadow-orange-100' : 'border-gray-100'} flex items-center gap-4`}>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${bg}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500 font-bold mb-1 uppercase tracking-wider">{title}</p>
        <p className={`text-xl font-extrabold ${highlight ? 'text-orange-600' : 'text-gray-900'}`}>{value}</p>
      </div>
    </div>
  );
}