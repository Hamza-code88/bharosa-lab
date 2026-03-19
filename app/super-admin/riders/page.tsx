"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { Bike, Search, UserPlus, MapPin, CheckCircle, Ban, Loader2, Settings, Save, X } from 'lucide-react';

export interface RiderProfile {
  id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: string;
  created_at: string;
}

export default function RiderManagementPage() {
  const [riders, setRiders] = useState<RiderProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Delivery Rates States
  const [baseFee, setBaseFee] = useState<number>(50);
  const [perKmFee, setPerKmFee] = useState<number>(20);
  const [isSavingRates, setIsSavingRates] = useState(false);

  // 🛑 NAYA: Add Rider Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [riderToken, setRiderToken] = useState('');
  const [isApprovingToken, setIsApprovingToken] = useState(false);

  useEffect(() => {
    fetchRiders();
    fetchRates(); 
  }, []);

  const fetchRates = async () => {
    try {
      const { data, error } = await supabase.from('app_settings').select('*').eq('id', 1).single();
      if (data) {
        setBaseFee(data.base_delivery_fee || 50);
        setPerKmFee(data.per_km_fee || 20);
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
        .upsert({ id: 1, base_delivery_fee: baseFee, per_km_fee: perKmFee });
      
      if (error) throw error;
      alert("Delivery rates updated successfully! New user app bookings will use these rates.");
    } catch (error: any) {
      alert("Failed to update rates: " + error.message);
    } finally {
      setIsSavingRates(false);
    }
  };

  // 🛑 NAYA: Token Paste Karke Approve Karne Ka Function
  const handleAddRiderByToken = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!riderToken.trim()) {
      alert("Please paste the Rider Token.");
      return;
    }

    setIsApprovingToken(true);
    try {
      // Pehle check karo ke is token/ID ka koi profile hai bhi ya nahi
      const { data: profile, error: checkError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', riderToken.trim())
        .single();

      if (checkError || !profile) {
        throw new Error("Invalid Token. No user found with this ID.");
      }

      if (profile.role === 'rider') {
        alert("This user is already an approved rider.");
        return;
      }

      // Agar mil gaya, toh role update kar do
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: 'rider' })
        .eq('id', riderToken.trim());

      if (updateError) throw updateError;

      alert("Success! Rider has been added and approved.");
      setRiderToken('');
      setIsAddModalOpen(false); // Modal band karo
      fetchRiders(); // List refresh karo

    } catch (error: any) {
      alert(error.message || "Failed to add rider. Check the token.");
    } finally {
      setIsApprovingToken(false);
    }
  };

  const handleApproveAccess = async (riderId: string, currentName: string | null) => {
    const confirmApprove = window.confirm(`Are you sure you want to APPROVE ${currentName || 'this applicant'} as a Rider?`);
    if (!confirmApprove) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: 'rider' })
        .eq('id', riderId);

      if (error) throw error;
      alert("Rider approved successfully! They can now access the app.");
      fetchRiders(); 
    } catch (error: unknown) {
      if (error instanceof Error) alert("Error: " + error.message);
    }
  };

  const handleRevokeAccess = async (riderId: string, currentName: string | null, isPending: boolean) => {
    const actionText = isPending ? 'reject' : 'revoke access for';
    const confirmRevoke = window.confirm(`Are you sure you want to ${actionText} ${currentName || 'this user'}?`);
    if (!confirmRevoke) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: 'patient' }) 
        .eq('id', riderId);

      if (error) throw error;
      alert(`Access ${isPending ? 'rejected' : 'revoked'} successfully!`);
      fetchRiders(); 
    } catch (error: unknown) {
      if (error instanceof Error) alert("Error: " + error.message);
    }
  };

  const filteredRiders = riders.filter(rider => {
    if (!searchQuery) return true; 
    
    const name = rider.full_name || '';
    const phone = rider.phone || '';
    
    return name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           phone.includes(searchQuery);
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
          <p className="text-gray-500 mt-2">Monitor, approve, and manage your delivery partners.</p>
        </div>
        
        {/* 🛑 Add New Rider Button (Opens Modal) */}
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-sm"
        >
          <UserPlus size={18} /> Add New Rider
        </button>
      </div>

      {/* GLOBAL DELIVERY RATES CONTROL PANEL */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] mb-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

        <div className="flex items-center gap-4 relative z-10">
          <div className="w-14 h-14 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm">
            <Settings size={28} />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-gray-900">Global Delivery Rates</h2>
            <p className="text-sm text-gray-500 font-medium">Update checkout fees. Syncs instantly with user apps.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 relative z-10 w-full md:w-auto">
          <div className="flex flex-col flex-1 md:flex-none">
            <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 tracking-wider">Base Fee (Rs)</label>
            <input
              type="number"
              value={baseFee}
              onChange={(e) => setBaseFee(Number(e.target.value))}
              className="w-full md:w-32 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
          <div className="flex flex-col flex-1 md:flex-none">
            <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 tracking-wider">Per KM Fee (Rs)</label>
            <input
              type="number"
              value={perKmFee}
              onChange={(e) => setPerKmFee(Number(e.target.value))}
              className="w-full md:w-32 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
          <button
            onClick={handleUpdateRates}
            disabled={isSavingRates}
            className="mt-6 w-full md:w-auto bg-gray-900 hover:bg-gray-800 text-white px-6 py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-70 shadow-md"
          >
            {isSavingRates ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {isSavingRates ? 'Saving...' : 'Save Rates'}
          </button>
        </div>
      </div>

      {/* Analytics / Stats Mini-Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-bold">Total Applications</p>
            <p className="text-3xl font-extrabold text-gray-900">{totalFleet}</p>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
            <Bike size={24} />
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-bold">Approved Riders</p>
            <p className="text-3xl font-extrabold text-green-600">{activeRiders}</p>
          </div>
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
            <CheckCircle size={24} />
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-bold">Pending Approvals</p>
            <p className={`text-3xl font-extrabold ${pendingApprovals > 0 ? 'text-orange-500' : 'text-gray-400'}`}>
              {pendingApprovals}
            </p>
          </div>
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center">
            <MapPin size={24} />
          </div>
        </div>
      </div>

      {/* Table & Search Controls */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-lg font-bold text-gray-900">Registered Delivery Partners</h2>
          <div className="relative w-full sm:w-72">
            <Search size={18} className="absolute left-3 top-3 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by name or phone..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-xs uppercase tracking-wider text-gray-500 border-b border-gray-100">
                <th className="px-6 py-4 font-bold">Rider Profile</th>
                <th className="px-6 py-4 font-bold">Contact Info</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold">Joined Date</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredRiders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <p className="font-medium text-lg mb-1">No riders found.</p>
                    <p className="text-sm">New rider applications will appear here.</p>
                  </td>
                </tr>
              ) : (
                filteredRiders.map((rider) => {
                  const isPending = rider.role === 'pending_rider';

                  return (
                    <tr key={rider.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                            <Image 
                              src={rider.avatar_url || `https://ui-avatars.com/api/?name=${rider.full_name || 'Rider'}&background=2563EB&color=fff`} 
                              fill 
                              sizes="40px"
                              className="object-cover" 
                              alt="Avatar" 
                              unoptimized
                            />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{rider.full_name || 'Unnamed Rider'}</p>
                            <p className="text-xs text-gray-500 font-medium">ID: {rider.id.split('-')[0]}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{rider.phone || 'No phone provided'}</p>
                      </td>
                      <td className="px-6 py-4">
                        {isPending ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                            Needs Approval
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                            Approved
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-500 font-medium">
                        {new Date(rider.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {isPending && (
                            <button 
                              onClick={() => handleApproveAccess(rider.id, rider.full_name)}
                              title="Approve Rider Application"
                              className="p-2 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors border border-green-200"
                            >
                              <CheckCircle size={18} />
                            </button>
                          )}
                          <button 
                            onClick={() => handleRevokeAccess(rider.id, rider.full_name, isPending)}
                            title={isPending ? "Reject Application" : "Revoke Rider Access"}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-red-100"
                          >
                            <Ban size={18} />
                          </button>
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

      {/* 🛑 ADD RIDER MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[30px] p-8 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in duration-200">
            
            {/* Close Button */}
            <button 
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                <UserPlus size={24} />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-gray-900">Add New Rider</h3>
                <p className="text-sm text-gray-500">Paste the unique Token ID from the Rider App.</p>
              </div>
            </div>

            <form onSubmit={handleAddRiderByToken}>
              <div className="mb-6">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Rider Token ID</label>
                <input
                  type="text"
                  required
                  value={riderToken}
                  onChange={(e) => setRiderToken(e.target.value)}
                  placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-mono text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isApprovingToken}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-70 shadow-md shadow-blue-600/20"
              >
                {isApprovingToken ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
                {isApprovingToken ? 'Verifying & Approving...' : 'Approve Rider'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}