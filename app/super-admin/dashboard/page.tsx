"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Users, FlaskConical, Building2, TrendingUp, Loader2 } from 'lucide-react';

export interface DashboardStats {
  totalPatients: number;
  totalLabs: number;
  totalTestsDone: number;
  revenueGenerated: number;
}

export interface LabPerformance {
  lab_name: string;
  test_count: number;
}

export interface RecentBooking {
  id: string;
  patient_name: string;
  lab_name: string;
  date: string;
  status: string;
  price: number;
}

// Supabase Response Type Setup
interface BookingResponse {
  id: string;
  created_at: string;
  status: string;
  total_amount: string | number | null; // Database me string ya number ho sakta hai
  patient_name: string | null;
  labs: { name: string } | null;
}

export default function AllDataDashboard() {
  const [stats, setStats] = useState<DashboardStats>({ totalPatients: 0, totalLabs: 0, totalTestsDone: 0, revenueGenerated: 0 });
  const [labPerformance, setLabPerformance] = useState<LabPerformance[]>([]);
  const [recentTests, setRecentTests] = useState<RecentBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch Total Patients (App Installs)
      const { count: patientCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'patient');

      // 2. Fetch Total Subscribed Labs
      const { count: labCount } = await supabase
        .from('labs')
        .select('*', { count: 'exact', head: true });

      // 3. 🛑 EXACT DB MATCH: Fetch Bookings using your actual columns (patient_name, total_amount)
      const { data: bookingsData, error } = await supabase
        .from('bookings')
        .select(`
          id, created_at, status, total_amount, patient_name,
          labs ( name )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Supabase Error:", error);
      }

      if (bookingsData) {
        const bookings = bookingsData as unknown as BookingResponse[]; // Type Casting for strictness

        // Total Completed Tests & Revenue Calculation (using total_amount)
        const completedTests = bookings.filter((b) => b.status?.toLowerCase() === 'completed');
        const totalRevenue = completedTests.reduce((sum, curr) => sum + (Number(curr.total_amount) || 0), 0);

        setStats({
          totalPatients: patientCount || 0,
          totalLabs: labCount || 0,
          totalTestsDone: completedTests.length,
          revenueGenerated: totalRevenue
        });

        // Calculate Lab-wise Performance
        const labCounts: Record<string, number> = {};
        completedTests.forEach((b) => {
          const labName = b.labs?.name || 'Unknown Lab';
          labCounts[labName] = (labCounts[labName] || 0) + 1;
        });

        const performanceArray = Object.keys(labCounts).map(name => ({
          lab_name: name,
          test_count: labCounts[name]
        })).sort((a, b) => b.test_count - a.test_count); 

        setLabPerformance(performanceArray);

        // Format Recent Tests for Table
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
      
      {/* Header for Investors */}
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">System Overview</h1>
        <p className="text-gray-500 mt-2">High-level metrics for investors and administrative monitoring.</p>
      </div>

      {/* 4 Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Total App Users" value={stats.totalPatients} icon={<Users size={24} className="text-blue-600" />} bg="bg-blue-50" />
        <StatCard title="Partner Labs" value={stats.totalLabs} icon={<Building2 size={24} className="text-purple-600" />} bg="bg-purple-50" />
        <StatCard title="Total Tests Done" value={stats.totalTestsDone} icon={<FlaskConical size={24} className="text-green-600" />} bg="bg-green-50" />
        <StatCard title="Total Revenue" value={`Rs. ${stats.revenueGenerated.toLocaleString()}`} icon={<TrendingUp size={24} className="text-orange-600" />} bg="bg-orange-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Recent Tests Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
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
                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                          test.status.toLowerCase() === 'completed' ? 'bg-green-100 text-green-700' : 
                          test.status.toLowerCase() === 'pending' ? 'bg-orange-100 text-orange-700' : 
                          'bg-gray-100 text-gray-700'
                        }`}>
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

        {/* Right: Lab Performance Leaderboard */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Top Performing Labs</h2>
          <div className="space-y-5">
            {labPerformance.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No data available.</p>
            ) : (
              labPerformance.slice(0, 5).map((lab, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <p className="font-bold text-gray-900 text-sm">{lab.lab_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold text-blue-600">{lab.test_count}</p>
                    <p className="text-[10px] text-gray-500 uppercase font-bold">Tests</p>
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

// Simple Card Component for reuse
function StatCard({ title, value, icon, bg }: { title: string, value: string | number, icon: React.ReactNode, bg: string }) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${bg}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 font-bold mb-1">{title}</p>
        <p className="text-2xl font-extrabold text-gray-900">{value}</p>
      </div>
    </div>
  );
}