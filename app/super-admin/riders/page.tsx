"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { Bike, Search, UserPlus, MapPin, CheckCircle, Ban, Loader2, Settings, Save, X, Phone, Mail, Check, AlertCircle } from 'lucide-react';

export interface RiderProfile {
  id: string;
  full_name: string | null;
  phone: string | null;
  email?: string | null;
  city?: string | null;
  avatar_url: string | null;
  role: string;
  rejection_reason?: string | null;
  created_at: string;
}

export default function RiderManagementPage() {
  const [riders, setRiders] = useState<RiderProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved'>('all');

  // Delivery Rates & Distance States
  const [baseFee, setBaseFee] = useState<number>(50);
  const [perKmFee, setPerKmFee] = useState<number>(20);
  const [maxDistance, setMaxDistance] = useState<number>(10);
  const [isSavingRates, setIsSavingRates] = useState(false);

  // Add Rider Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newFullName, setNewFullName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newCity, setNewCity] = useState('');
  const [isSubmittingNew, setIsSubmittingNew] = useState(false);

  useEffect(() => {
    fetchRiders();
    fetchRates(); 

    // Live Realtime listener for new rider applications & status changes
    const channel = supabase
      .channel('superadmin-riders-live')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        () => {
          fetchRiders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchRates = async () => {
    try {
      const { data } = await supabase.from('app_settings').select('*').eq('id', 1).maybeSingle();
      if (data) {
        setBaseFee(data.base_delivery_fee || 50);
        setPerKmFee(data.per_km_fee || 20);
        setMaxDistance(data.max_order_distance_km || 10);
      }
    } catch (err) {
      console.error("Error fetching rates:", err);
    }
  };

  const fetchRiders = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .in('role', ['rider', 'pending_rider'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setRiders(data as RiderProfile[]);
    } catch (error: any) {
      console.error("Error fetching riders:", error?.message || error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateRates = async () => {
    setIsSavingRates(true);
    try {
      const { error } = await supabase
        .from('app_settings')
        .update({ base_delivery_fee: baseFee, per_km_fee: perKmFee, max_order_distance_km: maxDistance })
        .eq('id', 1);
      
      if (error) throw error;
      alert("Delivery rates updated successfully! New bookings will use these rates.");
    } catch (error: any) {
      alert("Failed to update rates: " + error.message);
    } finally {
      setIsSavingRates(false);
    }
  };

  const handleApproveAccess = async (riderId: string, currentName: string | null) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: 'rider' })
        .eq('id', riderId);

      if (error) throw error;
      fetchRiders(); 
    } catch (error: any) {
      alert("Error: " + error.message);
    }
  };

  const handleRejectAccess = async (riderId: string, currentName: string | null) => {
    const confirmReject = window.confirm(`Are you sure you want to reject the application for ${currentName || 'this rider'}?`);
    if (!confirmReject) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: 'patient' }) 
        .eq('id', riderId);

      if (error) throw error;
      fetchRiders(); 
    } catch (error: any) {
      alert("Error: " + error.message);
    }
  };

  const handleCreateDirectRider = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName.trim() || !newPhone.trim()) {
      alert("Please enter Name and Phone.");
      return;
    }

    setIsSubmittingNew(true);
    try {
      const riderId = typeof crypto !== 'undefined' && crypto.randomUUID 
        ? crypto.randomUUID() 
        : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = Math.random() * 16 | 0;
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
          });
      const { error } = await supabase.from('profiles').insert({
        id: riderId,
        full_name: newFullName.trim(),
        phone: newPhone.trim(),
        email: newEmail.trim() || null,
        city: newCity.trim() || null,
        role: 'rider', // Directly approved by Super Admin
        created_at: new Date().toISOString()
      });

      if (error) throw error;

      alert(`Success! Rider ${newFullName} added and activated.`);
      setNewFullName('');
      setNewPhone('');
      setNewEmail('');
      setNewCity('');
      setIsAddModalOpen(false);
      fetchRiders();
    } catch (err: any) {
      alert("Failed to add rider: " + err.message);
    } finally {
      setIsSubmittingNew(false);
    }
  };

  const filteredRiders = riders.filter(rider => {
    const matchesStatus = 
      statusFilter === 'all' ? true :
      statusFilter === 'pending' ? rider.role === 'pending_rider' :
      rider.role === 'rider';

    if (!matchesStatus) return false;

    if (!searchQuery) return true; 
    const q = searchQuery.toLowerCase();
    return (
      (rider.full_name || '').toLowerCase().includes(q) ||
      (rider.phone || '').includes(q) ||
      (rider.email || '').toLowerCase().includes(q) ||
      (rider.city || '').toLowerCase().includes(q)
    );
  });

  const totalFleet = riders.length;
  const activeRiders = riders.filter(r => r.role === 'rider').length;
  const pendingApprovals = riders.filter(r => r.role === 'pending_rider').length;

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="animate-spin text-blue-600 w-12 h-12" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto font-sans relative">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            <Bike className="text-blue-600 w-8 h-8" /> 
            Fleet & Rider Management
          </h1>
          <p className="text-gray-500 mt-1">Review rider applications, activate verified delivery partners, and control delivery rates.</p>
        </div>
        
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-sm shrink-0"
        >
          <UserPlus size={18} /> Register Direct Rider
        </button>
      </div>

      {/* GLOBAL DELIVERY RATES CONTROL PANEL */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm mb-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm shrink-0">
            <Settings size={24} />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-gray-900">Delivery Rates & Distance Engine</h2>
            <p className="text-xs text-gray-500 font-medium">Automatic delivery calculation for patient sampling checkout.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 relative z-10 w-full md:w-auto">
          <div className="flex flex-col flex-1 md:flex-none">
            <label className="text-[11px] font-bold text-gray-500 uppercase mb-1 tracking-wider">Base Fee (Rs)</label>
            <input
              type="number"
              value={baseFee}
              onChange={(e) => setBaseFee(Number(e.target.value))}
              className="w-full md:w-28 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex flex-col flex-1 md:flex-none">
            <label className="text-[11px] font-bold text-gray-500 uppercase mb-1 tracking-wider">Per KM Fee (Rs)</label>
            <input
              type="number"
              value={perKmFee}
              onChange={(e) => setPerKmFee(Number(e.target.value))}
              className="w-full md:w-28 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex flex-col flex-1 md:flex-none">
            <label className="text-[11px] font-bold text-gray-500 uppercase mb-1 tracking-wider">Max Radius (KM)</label>
            <input
              type="number"
              value={maxDistance}
              onChange={(e) => setMaxDistance(Number(e.target.value))}
              className="w-full md:w-28 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            onClick={handleUpdateRates}
            disabled={isSavingRates}
            className="mt-4 w-full md:w-auto bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-70 text-sm shadow-sm"
          >
            {isSavingRates ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {isSavingRates ? 'Saving...' : 'Save Rates'}
          </button>
        </div>
      </div>

      {/* Analytics Mini-Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div 
          onClick={() => setStatusFilter('all')}
          className={`bg-white p-5 rounded-2xl border cursor-pointer transition-all ${statusFilter === 'all' ? 'border-blue-500 ring-2 ring-blue-100 shadow-md' : 'border-gray-100 shadow-sm hover:border-gray-200'}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total Fleet Applications</p>
              <p className="text-3xl font-black text-gray-900 mt-1">{totalFleet}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
              <Bike size={24} />
            </div>
          </div>
        </div>

        <div 
          onClick={() => setStatusFilter('approved')}
          className={`bg-white p-5 rounded-2xl border cursor-pointer transition-all ${statusFilter === 'approved' ? 'border-green-500 ring-2 ring-green-100 shadow-md' : 'border-gray-100 shadow-sm hover:border-gray-200'}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Active Approved Riders</p>
              <p className="text-3xl font-black text-green-600 mt-1">{activeRiders}</p>
            </div>
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
              <CheckCircle size={24} />
            </div>
          </div>
        </div>

        <div 
          onClick={() => setStatusFilter('pending')}
          className={`bg-white p-5 rounded-2xl border cursor-pointer transition-all ${statusFilter === 'pending' ? 'border-orange-500 ring-2 ring-orange-100 shadow-md' : 'border-gray-100 shadow-sm hover:border-gray-200'}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Pending Approvals</p>
              <p className={`text-3xl font-black mt-1 ${pendingApprovals > 0 ? 'text-orange-500' : 'text-gray-400'}`}>
                {pendingApprovals}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center">
              <MapPin size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-gray-900">Rider Applications & Fleet</h2>
            <span className="text-xs font-bold bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">
              {filteredRiders.length} Listed
            </span>
          </div>
          
          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-3.5 top-3 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by name, phone, city, email..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-[11px] uppercase tracking-wider text-gray-500 border-b border-gray-100">
                <th className="px-6 py-4 font-bold">Rider Profile</th>
                <th className="px-6 py-4 font-bold">Contact & City</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold">Applied Date</th>
                <th className="px-6 py-4 font-bold text-right">Verification Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredRiders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <Bike size={36} className="mx-auto text-gray-300 mb-2" />
                    <p className="font-bold text-base text-gray-700">No riders found</p>
                    <p className="text-xs text-gray-400">Applications submitted from the Rider App will show up here.</p>
                  </td>
                </tr>
              ) : (
                filteredRiders.map((rider) => {
                  const isPending = rider.role === 'pending_rider';
                  const isApproved = rider.role === 'rider';
                  const isRejected = rider.role === 'rejected_rider';

                  return (
                    <tr key={rider.id} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-blue-50 border border-blue-100 shrink-0 flex items-center justify-center font-bold text-blue-700 text-sm">
                            {(rider.full_name || 'R').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{rider.full_name || 'New Applicant'}</p>
                            <p className="text-[11px] text-gray-400 font-mono">ID: {rider.id.substring(0, 16)}...</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
                            <Phone size={12} className="text-blue-500" />
                            {rider.phone || 'No Phone'}
                          </div>
                          {rider.email && (
                            <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                              <Mail size={12} className="text-gray-400" />
                              {rider.email}
                            </div>
                          )}
                          {rider.city && (
                            <span className="inline-block bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-md mt-1">
                              📍 {rider.city}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        {isPending && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                            Pending Approval
                          </span>
                        )}
                        {isApproved && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                            <Check size={12} />
                            Active Rider
                          </span>
                        )}
                        {isRejected && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold">
                            <Ban size={12} />
                            Rejected
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-xs text-gray-500 font-medium">
                        {new Date(rider.created_at).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {!isApproved && (
                            <button 
                              onClick={() => handleApproveAccess(rider.id, rider.full_name)}
                              title="Approve Rider Application"
                              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
                            >
                              <CheckCircle size={14} /> Approve
                            </button>
                          )}
                          {!isRejected && (
                            <button 
                              onClick={() => handleRejectAccess(rider.id, rider.full_name)}
                              title="Reject Application"
                              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold flex items-center gap-1 transition-all"
                            >
                              <Ban size={14} /> Reject
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DIRECT RIDER REGISTRATION MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl relative">
            <button 
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                <UserPlus size={24} />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-gray-900">Direct Register Rider</h3>
                <p className="text-xs text-gray-500">Create an active rider account directly.</p>
              </div>
            </div>

            <form onSubmit={handleCreateDirectRider} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ali Khan"
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Phone Number (Login ID)</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 03001234567"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email (Optional)</label>
                <input
                  type="email"
                  placeholder="e.g. ali@gmail.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">City / Area</label>
                <input
                  type="text"
                  placeholder="e.g. Dargai, Malakand"
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-gray-900"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingNew}
                className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-70 shadow-sm"
              >
                {isSubmittingNew ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
                {isSubmittingNew ? 'Creating Account...' : 'Activate & Add Rider'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}