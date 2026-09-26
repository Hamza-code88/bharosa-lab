"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  FileText, 
  Wallet, 
  TrendingUp, 
  FlaskConical, 
  Loader2, 
  Scissors, 
  CheckCircle,
  BarChart3,
  Clock,
  Calendar,
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
  Activity
} from 'lucide-react';
import { supabase } from '@/lib/supabase'; 
import { resolveActiveLab, LAB_CHANGED_EVENT } from '@/lib/activeLab'; 

interface BookingRecord {
  id: string;
  created_at: string;
  status: string;
  total_amount: number;
  patient_phone: string;
  patient_name: string;
  booking_items?: {
    price_at_booking: number;
    lab_tests?: {
      master_tests?: {
        title: string;
      };
    };
  }[];
}

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '6m'>('7d');
  const [hoveredPoint, setHoveredPoint] = useState<{ label: string; revenue: number; orders: number } | null>(null);
  
  const [stats, setStats] = useState({
    earnings: 0,
    newOrders: 0,
    catalogTests: 0,
    totalPatients: 0,
    commissionCut: 0,
    netProfit: 0,
    completedOrders: 0,
    avgOrderValue: 0
  });
  
  const [allBookings, setAllBookings] = useState<BookingRecord[]>([]);
  const [commissionRate, setCommissionRate] = useState(0); 
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      setIsLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return;

        // 1. Fetch Lab info & last cleared date
        const { activeLab: lab } = await resolveActiveLab(session.user.id);
          
        if (!lab) {
          setIsLoading(false);
          return;
        }

        // 2. Fetch platform commission percentage
        const { data: settings } = await supabase
          .from('app_settings')
          .select('commission_percentage')
          .eq('id', 1)
          .single();
          
        const globalRate = settings?.commission_percentage || 0;
        const rate = (lab.commission_percentage !== null && lab.commission_percentage !== undefined)
          ? Number(lab.commission_percentage)
          : globalRate;
        setCommissionRate(rate);

        // 3. Fetch all bookings with items & test names for analytics
        const { data: bookingsData } = await supabase
          .from('bookings')
          .select(`
            id, created_at, status, total_amount, patient_phone, patient_name,
            booking_items (
              price_at_booking,
              lab_tests (
                master_tests ( title )
              )
            )
          `)
          .eq('lab_id', lab.id)
          .order('created_at', { ascending: true });

        // 4. Fetch tests catalog count
        const { count: testCount } = await supabase
          .from('lab_tests')
          .select('*', { count: 'exact', head: true })
          .eq('lab_id', lab.id);

        if (bookingsData) {
          const bookings = bookingsData as unknown as BookingRecord[];
          setAllBookings(bookings);

          // Current billing cycle bookings (since last clearance)
          const currentCycleBookings = bookings.filter(b => {
            if (!lab.last_cleared_date) return true;
            return new Date(b.created_at) > new Date(lab.last_cleared_date);
          });

          // Completed or valid revenue bookings
          const completedCurrentBookings = currentCycleBookings.filter(b => 
            ['completed', 'sample_collected', 'report_uploaded'].includes(b.status?.toLowerCase())
          );

          const currentCycleEarnings = completedCurrentBookings.reduce((sum, b) => sum + (b.total_amount || 0), 0);
          const pendingOrders = bookings.filter(b => b.status?.toLowerCase() === 'pending').length;
          const uniquePatientsCount = new Set(bookings.map(b => b.patient_phone)).size;
          const totalCompletedCount = bookings.filter(b => b.status?.toLowerCase() === 'completed').length;

          const currentDue = currentCycleEarnings * (rate / 100);
          const currentProfit = currentCycleEarnings - currentDue;
          const avgAov = completedCurrentBookings.length > 0 ? Math.round(currentCycleEarnings / completedCurrentBookings.length) : 0;

          setStats({
            earnings: currentCycleEarnings,
            newOrders: pendingOrders,
            catalogTests: testCount || 0,
            totalPatients: uniquePatientsCount,
            commissionCut: Math.round(currentDue),
            netProfit: Math.round(currentProfit),
            completedOrders: totalCompletedCount,
            avgOrderValue: avgAov
          });
        }
      } catch (error) {
        console.error("Dashboard Stats Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
    window.addEventListener(LAB_CHANGED_EVENT, fetchDashboardStats);
    return () => window.removeEventListener(LAB_CHANGED_EVENT, fetchDashboardStats);
  }, []);

  // =========================================================================
  // 1. DYNAMIC REVENUE & ORDERS TIME-SERIES DATA GENERATOR
  // =========================================================================
  const chartData = useMemo(() => {
    if (!allBookings || allBookings.length === 0) {
      return [
        { label: 'Mon', revenue: 0, orders: 0 },
        { label: 'Tue', revenue: 0, orders: 0 },
        { label: 'Wed', revenue: 0, orders: 0 },
        { label: 'Thu', revenue: 0, orders: 0 },
        { label: 'Fri', revenue: 0, orders: 0 },
        { label: 'Sat', revenue: 0, orders: 0 },
        { label: 'Sun', revenue: 0, orders: 0 }
      ];
    }

    const now = new Date();
    const points: { label: string; revenue: number; orders: number }[] = [];

    if (timeRange === '7d') {
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });

        const dayBookings = allBookings.filter(b => b.created_at?.startsWith(dateStr));
        const dayRev = dayBookings
          .filter(b => ['completed', 'sample_collected', 'report_uploaded'].includes(b.status?.toLowerCase()))
          .reduce((sum, b) => sum + (b.total_amount || 0), 0);

        points.push({
          label: `${dayLabel} ${d.getDate()}`,
          revenue: dayRev,
          orders: dayBookings.length
        });
      }
    } else if (timeRange === '30d') {
      for (let w = 3; w >= 0; w--) {
        const endDay = new Date(now);
        endDay.setDate(endDay.getDate() - w * 7);
        const startDay = new Date(endDay);
        startDay.setDate(startDay.getDate() - 6);

        const weekBookings = allBookings.filter(b => {
          const bDate = new Date(b.created_at);
          return bDate >= startDay && bDate <= endDay;
        });

        const weekRev = weekBookings
          .filter(b => ['completed', 'sample_collected', 'report_uploaded'].includes(b.status?.toLowerCase()))
          .reduce((sum, b) => sum + (b.total_amount || 0), 0);

        points.push({
          label: `W${4 - w} (${startDay.getDate()}-${endDay.getDate()} ${endDay.toLocaleDateString('en-US', { month: 'short' })})`,
          revenue: weekRev,
          orders: weekBookings.length
        });
      }
    } else {
      for (let m = 5; m >= 0; m--) {
        const d = new Date(now.getFullYear(), now.getMonth() - m, 1);
        const monthYearStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        const monthLabel = d.toLocaleDateString('en-US', { month: 'short' });

        const monthBookings = allBookings.filter(b => b.created_at?.startsWith(monthYearStr));
        const monthRev = monthBookings
          .filter(b => ['completed', 'sample_collected', 'report_uploaded'].includes(b.status?.toLowerCase()))
          .reduce((sum, b) => sum + (b.total_amount || 0), 0);

        points.push({
          label: monthLabel,
          revenue: monthRev,
          orders: monthBookings.length
        });
      }
    }

    return points;
  }, [allBookings, timeRange]);

  const maxRevenue = useMemo(() => {
    const max = Math.max(...chartData.map(p => p.revenue), 1000);
    return Math.ceil(max / 1000) * 1000;
  }, [chartData]);

  // =========================================================================
  // 2. TOP 5 MOST BOOKED TESTS CALCULATION
  // =========================================================================
  const topTests = useMemo(() => {
    const testCountMap: Record<string, { count: number; totalRev: number }> = {};

    allBookings.forEach(booking => {
      if (booking.booking_items && booking.booking_items.length > 0) {
        booking.booking_items.forEach(item => {
          const testTitle = item.lab_tests?.master_tests?.title || 'Diagnostic Test';
          if (!testCountMap[testTitle]) {
            testCountMap[testTitle] = { count: 0, totalRev: 0 };
          }
          testCountMap[testTitle].count += 1;
          testCountMap[testTitle].totalRev += item.price_at_booking || 0;
        });
      }
    });

    const entries = Object.entries(testCountMap).map(([title, val]) => ({
      title,
      count: val.count,
      revenue: val.totalRev
    }));

    entries.sort((a, b) => b.count - a.count);
    const top5 = entries.slice(0, 5);
    const totalCount = top5.reduce((acc, t) => acc + t.count, 0) || 1;

    return top5.map((t, index) => ({
      ...t,
      percentage: Math.round((t.count / totalCount) * 100),
      color: [
        'from-teal-600 to-emerald-500',
        'from-blue-600 to-indigo-600',
        'from-amber-500 to-orange-500',
        'from-rose-500 to-pink-500',
        'from-purple-600 to-violet-600'
      ][index % 5]
    }));
  }, [allBookings]);



  return (
    <div className="space-y-6 sm:space-y-8 px-2 sm:px-0 max-w-full overflow-hidden text-slate-900 font-sans">
      
      {/* Top Header with Title & Live Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Laboratory Intelligence & Analytics
            </h2>
            <p className="text-slate-600 mt-1 text-xs sm:text-sm font-medium">
              Monitor real-time earnings, commission settlement, and patient test booking trends.
            </p>
          </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 flex items-center gap-2 shadow-xs">
            <Calendar size={14} className="text-teal-600" />
            <span>Billing Cycle: Active</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. ALL 6 KEY METRIC CARDS (CLEAN CLINICAL WHITE WITH BOLD DARK TEXT)       */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        
        {/* Card 1: Total Billed (Current Cycle) */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-slate-300 transition-all">
          <div className="flex justify-between items-start mb-3">
            <div className="bg-slate-100 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl text-slate-800 shadow-xs">
              <Wallet className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <span className="text-[10px] sm:text-xs font-extrabold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
              Gross Inflow
            </span>
          </div>
          <p className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-0.5">Total Billed (Current Cycle)</p>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin text-slate-400" /> : `Rs. ${stats.earnings.toLocaleString()}`}
          </h3>
          <p className="text-[11px] text-slate-600 mt-1.5 font-semibold">
            Avg. Order: <strong className="text-slate-900 font-extrabold">Rs. {stats.avgOrderValue.toLocaleString()}</strong>
          </p>
        </div>

        {/* Card 2: Platform Commission (Due) */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border-2 border-red-100 shadow-sm relative overflow-hidden group hover:border-red-200 transition-all">
          <div className="flex justify-between items-start mb-3">
            <div className="bg-red-500 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl shadow-sm shadow-red-200 text-white">
              <Scissors className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <span className="text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-extrabold">
              {commissionRate}% Platform Fee
            </span>
          </div>
          <p className="text-[11px] font-extrabold text-red-600 uppercase tracking-wider mb-0.5">Current Due Commission</p>
          <h3 className="text-2xl sm:text-3xl font-black text-red-600 tracking-tight flex items-center gap-2">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin text-red-300" /> : `- Rs. ${stats.commissionCut.toLocaleString()}`}
          </h3>
          <p className="text-[11px] text-slate-500 mt-1.5 font-medium">
            Payable before cycle lock
          </p>
        </div>

        {/* Card 3: Net Profit (Current Cycle) */}
        <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-[#1E3A5F] p-5 sm:p-6 rounded-2xl sm:rounded-3xl shadow-lg shadow-teal-600/20 text-white relative overflow-hidden sm:col-span-2 lg:col-span-1">
          <div className="flex justify-between items-start mb-3">
            <div className="bg-white/20 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border border-white/20 text-white backdrop-blur-xs">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <span className="flex items-center gap-1 text-emerald-950 bg-emerald-300 px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-black shadow-xs">
              <TrendingUp size={12} strokeWidth={3} /> Clear Profit
            </span>
          </div>
          <p className="text-[11px] font-bold text-teal-100 uppercase tracking-wider mb-0.5">Net Earnings (Current Cycle)</p>
          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin text-teal-200" /> : `Rs. ${stats.netProfit.toLocaleString()}`}
          </h3>
          <p className="text-[11px] text-teal-100/90 mt-1.5 font-medium">
            100% Retained revenue
          </p>
        </div>

        {/* Card 4: Pending Orders */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-purple-300 transition-all">
          <div className="flex justify-between items-start mb-3">
            <div className="bg-purple-600 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl shadow-sm shadow-purple-200 text-white">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <span className="text-[10px] sm:text-xs font-extrabold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
              Action Required
            </span>
          </div>
          <p className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-0.5">Pending Orders</p>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin text-slate-300" /> : stats.newOrders}
          </h3>
          <p className="text-[11px] text-slate-500 mt-1.5 font-medium">Awaiting sample pickup / upload</p>
        </div>

        {/* Card 5: Published Catalog Tests */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-orange-300 transition-all">
          <div className="flex justify-between items-start mb-3">
            <div className="bg-orange-500 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl shadow-sm shadow-orange-200 text-white">
              <FlaskConical className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <span className="text-[10px] sm:text-xs font-extrabold text-orange-700 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-100">
              Catalog Live
            </span>
          </div>
          <p className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-0.5">Tests in Catalog</p>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin text-slate-300" /> : stats.catalogTests}
          </h3>
          <p className="text-[11px] text-slate-500 mt-1.5 font-medium">Active items searchable by patients</p>
        </div>

        {/* Card 6: Unique Patients */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-emerald-300 transition-all">
          <div className="flex justify-between items-start mb-3">
            <div className="bg-emerald-600 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl shadow-sm shadow-emerald-200 text-white">
              <Users className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <span className="text-[10px] sm:text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
              Total Reach
            </span>
          </div>
          <p className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-0.5">Unique Patients</p>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin text-slate-300" /> : stats.totalPatients}
          </h3>
          <p className="text-[11px] text-slate-500 mt-1.5 font-medium">Total patients served across cities</p>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2. REVENUE TRENDS & APPOINTMENTS (CLEAN CLINICAL WHITE WITH BOLD GRAPH)   */}
      {/* ========================================================================= */}
      <div className="bg-white p-5 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        
        {/* Chart Controls Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-100">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">Revenue & Sample Orders Trend</h3>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">Real-time financial performance and sample volume progression.</p>
          </div>

          {/* Time Range Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
            {(['7d', '30d', '6m'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setTimeRange(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  timeRange === tab
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab === '7d' ? '7 Days' : tab === '30d' ? '30 Days' : '6 Months'}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Hover / Tap Tooltip Box */}
        <div className="min-h-[40px] flex flex-wrap items-center justify-between px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          {hoveredPoint ? (
            <div className="flex items-center gap-3 animate-in fade-in duration-200">
              <span className="font-extrabold text-slate-900">{hoveredPoint.label}:</span>
              <span className="text-teal-700 font-black">Revenue: Rs. {hoveredPoint.revenue.toLocaleString()}</span>
              <span className="text-blue-700 font-bold">• {hoveredPoint.orders} Sample{hoveredPoint.orders > 1 ? 's' : ''}</span>
            </div>
          ) : (
            <span className="text-slate-500 text-xs italic flex items-center gap-1.5 font-medium">
              <Activity size={13} className="text-teal-600" />
              Hover or tap on any bar to view granular daily revenue and order volume
            </span>
          )}
          
          <div className="flex items-center gap-4 text-[11px] font-extrabold mt-1 sm:mt-0">
            <span className="flex items-center gap-1.5 text-teal-800">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-600 inline-block shadow-xs" /> Revenue (Rs)
            </span>
            <span className="flex items-center gap-1.5 text-blue-800">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block shadow-xs" /> Orders
            </span>
          </div>
        </div>

        {/* Visual Bars Container */}
        <div className="relative pt-4 pb-2">
          {/* Subtle horizontal grid lines */}
          <div className="absolute inset-x-0 top-4 bottom-8 flex flex-col justify-between pointer-events-none opacity-40">
            <div className="border-b border-dashed border-slate-200 w-full flex justify-end">
              <span className="text-[10px] text-slate-500 font-bold -mt-2.5 mr-1">Rs. {maxRevenue.toLocaleString()}</span>
            </div>
            <div className="border-b border-dashed border-slate-200 w-full flex justify-end">
              <span className="text-[10px] text-slate-500 font-bold -mt-2.5 mr-1">Rs. {(maxRevenue / 2).toLocaleString()}</span>
            </div>
            <div className="border-b border-slate-200 w-full flex justify-end">
              <span className="text-[10px] text-slate-500 font-bold -mt-2.5 mr-1">Rs. 0</span>
            </div>
          </div>

          {/* Bars Column Rendering */}
          <div className="relative h-48 sm:h-56 flex items-end justify-between gap-1.5 sm:gap-3 px-1 sm:px-4 pt-4 pb-1">
            {chartData.map((point, index) => {
              const heightPercent = maxRevenue > 0 ? Math.max((point.revenue / maxRevenue) * 100, 6) : 6;
              const isHovered = hoveredPoint?.label === point.label;

              return (
                <div
                  key={index}
                  onMouseEnter={() => setHoveredPoint(point)}
                  onMouseLeave={() => setHoveredPoint(null)}
                  onClick={() => setHoveredPoint(point)}
                  className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                >
                  <div className="w-full max-w-[40px] flex flex-col items-center justify-end relative h-full">
                    
                    {/* Tooltip on Top */}
                    {isHovered && (
                      <div className="absolute -top-7 bg-slate-900 text-white text-[10px] font-black px-2 py-0.5 rounded shadow-lg whitespace-nowrap z-20">
                        Rs. {point.revenue.toLocaleString()}
                      </div>
                    )}

                    {/* Clean Gradient Bar */}
                    <div 
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full rounded-t-lg sm:rounded-t-xl transition-all duration-300 relative overflow-hidden ${
                        isHovered 
                          ? 'bg-gradient-to-t from-teal-700 to-emerald-500 shadow-md shadow-teal-500/30 scale-x-105' 
                          : 'bg-gradient-to-t from-slate-200 via-teal-500/70 to-teal-600 group-hover:from-teal-500 group-hover:to-teal-700'
                      }`}
                    >
                      {/* Crisp Top highlight cap */}
                      <div className="h-1 bg-white/40 w-full" />
                    </div>
                  </div>

                  {/* Date Label with Bold Dark Font */}
                  <p className={`text-[9px] sm:text-[11px] mt-2 font-bold transition-colors truncate max-w-full ${
                    isHovered ? 'text-teal-700' : 'text-slate-600'
                  }`}>
                    {point.label}
                  </p>
                </div>
              );
            })}
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 3. TOP 5 MOST PRESCRIBED & BOOKED TESTS                                   */}
      {/* ========================================================================= */}
      <div className="bg-white p-5 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-100">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">Top 5 Prescribed & Booked Tests</h3>
              <p className="text-xs text-slate-500 font-medium">Diagnostic tests generating maximum patient booking volume.</p>
            </div>
          </div>
          <span className="text-[10px] sm:text-xs font-extrabold text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-lg">
            Demand Share
          </span>
        </div>

        {topTests.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-sm font-medium">
            No diagnostic test bookings recorded yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topTests.map((test, index) => (
              <div key={index} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 group hover:border-slate-300 transition-all">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-white text-slate-800 font-black text-xs flex items-center justify-center border border-slate-200 shadow-2xs">
                      #{index + 1}
                    </span>
                    <span className="font-extrabold text-slate-900 group-hover:text-teal-700 transition-colors">
                      {test.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 font-bold text-xs">{test.count} order{test.count > 1 ? 's' : ''}</span>
                    <span className="font-black text-slate-900 text-xs">
                      {test.percentage}%
                    </span>
                  </div>
                </div>

                {/* Clean Vibrant Progress Track */}
                <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    style={{ width: `${test.percentage}%` }}
                    className={`h-full rounded-full bg-gradient-to-r ${test.color} transition-all duration-500`}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span className="font-medium">Update pricing or discounts in your catalog to boost volume.</span>
          <a href="/dashboard/tests" className="font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 transition-colors">
            <span>Test Catalog</span>
            <ArrowUpRight size={12} />
          </a>
        </div>
      </div>

    </div>
  );
}