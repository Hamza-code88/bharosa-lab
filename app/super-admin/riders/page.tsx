"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { Bike, Search, UserPlus, MapPin, CheckCircle, Ban, Loader2, MoreVertical } from 'lucide-react';

// 🛑 NAYA: Rider ki profile ka strict interface
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

  useEffect(() => {
    fetchRiders();
  }, []);

  const fetchRiders = async () => {
    setIsLoading(true);
    try {
      // 🛑 DB Fetch: Sirf un profiles ko lao jinka role 'rider' hai
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'rider')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setRiders(data as RiderProfile[]);
    } catch (error) {
      console.error("Error fetching riders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 🛑 Rider ka role change kar ke usay block/remove karna (optional feature)
  const handleRevokeAccess = async (riderId: string, currentName: string | null) => {
    const confirmRevoke = window.confirm(`Are you sure you want to revoke Rider access for ${currentName || 'this user'}?`);
    if (!confirmRevoke) return;

    try {
      // Role ko wapas 'user' ya 'blocked' kar dein
      const { error } = await supabase
        .from('profiles')
        .update({ role: 'patient' }) // Ya koi aur default role
        .eq('id', riderId);

      if (error) throw error;
      alert("Access revoked successfully!");
      fetchRiders(); // Table refresh
    } catch (error: unknown) {
      if (error instanceof Error) alert("Error: " + error.message);
    }
  };

  // Search filter logic
  const filteredRiders = riders.filter(rider => 
    rider.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    rider.phone?.includes(searchQuery)
  );

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="animate-spin text-blue-600 w-12 h-12" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto font-sans">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            <Bike className="text-blue-600 w-8 h-8" /> 
            Fleet & Rider Management
          </h1>
          <p className="text-gray-500 mt-2">Monitor, approve, and manage your delivery partners.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-sm">
          <UserPlus size={18} /> Add New Rider
        </button>
      </div>

      {/* Analytics / Stats Mini-Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-bold">Total Fleet Size</p>
            <p className="text-3xl font-extrabold text-gray-900">{riders.length}</p>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
            <Bike size={24} />
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-bold">Active Right Now</p>
            <p className="text-3xl font-extrabold text-green-600">--</p>
          </div>
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
            <CheckCircle size={24} />
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-bold">Pending Approvals</p>
            <p className="text-3xl font-extrabold text-orange-500">0</p>
          </div>
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center">
            <MapPin size={24} />
          </div>
        </div>
      </div>

      {/* Table & Search Controls */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Toolbar */}
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

        {/* Data Table */}
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
                    <p className="text-sm">When users are assigned the 'rider' role, they will appear here.</p>
                  </td>
                </tr>
              ) : (
                filteredRiders.map((rider) => (
                  <tr key={rider.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    
                    {/* 1. Profile Data */}
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

                    {/* 2. Contact */}
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{rider.phone || 'No phone provided'}</p>
                    </td>

                    {/* 3. Status */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                        Approved
                      </span>
                    </td>

                    {/* 4. Date */}
                    <td className="px-6 py-4 text-gray-500 font-medium">
                      {new Date(rider.created_at).toLocaleDateString()}
                    </td>

                    {/* 5. Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleRevokeAccess(rider.id, rider.full_name)}
                          title="Revoke Rider Access"
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Ban size={18} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}