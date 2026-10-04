"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, CheckCircle, ShieldAlert, Lock, Unlock, FileText, Search, Filter } from 'lucide-react';

interface Lab {
  id: string;
  name: string;
  created_at: string;
  is_active: boolean;
  registration_status: string;
  is_registered_paid: boolean;
}

export default function RegistrationsPage() {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchLabs();
  }, []);

  const fetchLabs = async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from('labs')
      .select('id, name, created_at, is_active, registration_status, is_registered_paid')
      .order('created_at', { ascending: false });

    if (data) {
      setLabs(data as Lab[]);
    }
    setIsLoading(false);
  };

  const approveRegistration = async (labId: string, labName: string) => {
    if (!confirm(`Are you sure you want to approve the registration fee for ${labName}?`)) return;

    const { error } = await supabase
      .from('labs')
      .update({
        registration_status: 'cleared',
        is_registered_paid: true,
        is_active: true,
        is_verified: true
      })
      .eq('id', labId);

    if (!error) {
      alert(`Registration for ${labName} approved successfully!`);
      fetchLabs();
    } else {
      alert("Error approving registration.");
    }
  };

  const toggleLock = async (labId: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    if (!confirm(`Are you sure you want to ${newStatus ? 'Unlock' : 'Lock'} this account?`)) return;

    // Optimistic update
    setLabs(labs.map(lab => lab.id === labId ? { ...lab, is_active: newStatus, is_verified: newStatus } : lab));

    const updatePayload: any = { is_active: newStatus, is_verified: newStatus };
    if (newStatus) {
      updatePayload.is_registered_paid = true;
      updatePayload.registration_status = 'cleared';
    }

    const { error } = await supabase
      .from('labs')
      .update(updatePayload)
      .eq('id', labId);

    if (error) {
      alert("Error updating lock status!");
      // Revert on error
      setLabs(labs.map(lab => lab.id === labId ? { ...lab, is_active: currentStatus } : lab));
    }
  };

  const getTrialStatus = (lab: Lab) => {
    if (lab.is_registered_paid) {
      return <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-xs font-bold">Lifetime Active</span>;
    }

    const trialDays = Math.floor((Date.now() - new Date(lab.created_at).getTime()) / (1000 * 60 * 60 * 24));
    const daysLeft = 30 - trialDays;

    if (daysLeft > 0) {
      return <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs font-bold">{daysLeft} Days Left</span>;
    } else {
      return <span className="bg-red-100 text-red-700 px-2 py-1 rounded-md text-xs font-bold">Trial Expired</span>;
    }
  };

  const filteredLabs = labs.filter(lab => {
    const matchesSearch = lab.name.toLowerCase().includes(searchTerm.toLowerCase());
    let matchesFilter = true;
    
    if (filter === 'pending') matchesFilter = lab.registration_status === 'pending_approval';
    if (filter === 'expired') {
      const trialDays = Math.floor((Date.now() - new Date(lab.created_at).getTime()) / (1000 * 60 * 60 * 24));
      matchesFilter = trialDays >= 30 && !lab.is_registered_paid;
    }
    if (filter === 'locked') matchesFilter = !lab.is_active;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 pb-20">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
          <FileText className="text-blue-600 w-8 h-8" /> Registration Approvals
        </h1>
        <p className="text-gray-500 mt-1">Manage lab trials, registration fees, and account locks.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search labs..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-gray-200 text-gray-900 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          className="bg-white border border-gray-200 text-gray-700 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 font-medium"
        >
          <option value="all">All Labs</option>
          <option value="pending">Pending Approval</option>
          <option value="expired">Trial Expired</option>
          <option value="locked">Locked Accounts</option>
        </select>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-bold">
                  <th className="p-4">Lab Name</th>
                  <th className="p-4">Join Date</th>
                  <th className="p-4">Trial Status</th>
                  <th className="p-4 text-center">Registration Fee</th>
                  <th className="p-4 text-center">Account Lock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredLabs.length === 0 ? (
                  <tr><td colSpan={5} className="p-8 text-center text-gray-400 font-medium">No labs found.</td></tr>
                ) : filteredLabs.map(lab => (
                  <tr key={lab.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 font-bold text-gray-900">{lab.name}</td>
                    <td className="p-4 text-sm text-gray-500">{new Date(lab.created_at).toLocaleDateString()}</td>
                    <td className="p-4">{getTrialStatus(lab)}</td>
                    <td className="p-4 text-center">
                      {lab.is_registered_paid ? (
                        <span className="inline-flex items-center gap-1 text-green-600 bg-green-50 px-2.5 py-1 rounded-lg text-xs font-bold">
                          <CheckCircle className="w-4 h-4" /> Paid
                        </span>
                      ) : (
                        <button 
                          onClick={() => approveRegistration(lab.id, lab.name)}
                          className={`${lab.registration_status === 'pending_approval' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'} text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-xs`}
                        >
                          {lab.registration_status === 'pending_approval' ? 'Approve Receipt' : 'Approve Fee'}
                        </button>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => toggleLock(lab.id, lab.is_active)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          lab.is_active 
                            ? 'bg-gray-100 text-gray-700 hover:bg-red-100 hover:text-red-700' 
                            : 'bg-red-500 text-white hover:bg-red-600 shadow-sm'
                        }`}
                      >
                        {lab.is_active ? (
                          <><Unlock className="w-3.5 h-3.5" /> Active</>
                        ) : (
                          <><Lock className="w-3.5 h-3.5" /> Locked</>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
