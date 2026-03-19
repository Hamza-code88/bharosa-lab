"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, CheckCircle2, XCircle, Search, FileImage, ShieldCheck, Settings, X } from 'lucide-react';
import Image from 'next/image';

export default function BillingApprovalsPage() {
  const [labs, setLabs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // 🛑 NAYA: Separate Settings Modal States
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [epNumber, setEpNumber] = useState('');
  const [epTitle, setEpTitle] = useState('');
  const [jcNumber, setJcNumber] = useState('');
  const [jcTitle, setJcTitle] = useState('');
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  useEffect(() => {
    fetchLabsAndDues();
    fetchSettings();
  }, []);

  const fetchLabsAndDues = async () => {
    setIsLoading(true);
    const { data: settings } = await supabase.from('app_settings').select('commission_percentage').eq('id', 1).single();
    const rate = settings?.commission_percentage || 0;

    const { data: labsData } = await supabase
      .from('labs')
      .select('id, name, city, is_active, payment_status, payment_method, sender_name, payment_screenshot, last_cleared_month, logo_url')
      .order('payment_status', { ascending: false });

    const { data: bookings } = await supabase.from('bookings').select('lab_id, total_amount').eq('status', 'Completed');

    if (labsData) {
      const enrichedLabs = labsData.map(lab => {
        const labBookings = bookings?.filter(b => b.lab_id === lab.id) || [];
        const totalBilled = labBookings.reduce((sum, b) => sum + (b.total_amount || 0), 0);
        const dueAmount = Math.round(totalBilled * (rate / 100));
        return { ...lab, dueAmount };
      });
      setLabs(enrichedLabs);
    }
    setIsLoading(false);
  };

  const fetchSettings = async () => {
    const { data } = await supabase.from('app_settings').select('*').eq('id', 1).single();
    if (data) {
      setEpNumber(data.easypaisa_number || '');
      setEpTitle(data.easypaisa_title || '');
      setJcNumber(data.jazzcash_number || '');
      setJcTitle(data.jazzcash_title || '');
    }
  };

  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    const { error } = await supabase.from('app_settings').update({ 
      easypaisa_number: epNumber, 
      easypaisa_title: epTitle,
      jazzcash_number: jcNumber,
      jazzcash_title: jcTitle
    }).eq('id', 1);
    
    if (!error) {
      alert("Account Details Updated Successfully!");
      setIsSettingsOpen(false);
    } else {
      alert("Error saving details.");
    }
    setIsSavingSettings(false);
  };

  const toggleActiveStatus = async (labId: string, currentStatus: any) => {
    const isCurrentlyActive = !!currentStatus; 
    const newStatus = !isCurrentlyActive;
    if (!confirm(`Are you sure you want to ${newStatus ? 'Activate' : 'Deactivate (Block)'} this lab?`)) return;

    setLabs(labs.map(lab => lab.id === labId ? { ...lab, is_active: newStatus } : lab));

    const { error } = await supabase.from('labs').update({ is_active: newStatus }).eq('id', labId);
    if (error) {
      alert("Error updating status!");
      setLabs(labs.map(lab => lab.id === labId ? { ...lab, is_active: isCurrentlyActive } : lab));
    }
  };

  const approvePayment = async (labId: string) => {
    if (!confirm("Are you sure you want to approve this payment? This will clear their dues for the previous month.")) return;

    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    const prevMonthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    const { error } = await supabase
      .from('labs')
      .update({
        payment_status: 'cleared',
        is_active: true, 
        last_cleared_month: prevMonthStr,
        payment_screenshot: null, 
        sender_name: null
      })
      .eq('id', labId);

    if (!error) {
      alert("Payment Approved Successfully! Lab is now Active.");
      fetchLabsAndDues(); 
    } else {
      alert("Error approving payment!");
    }
  };

  const filteredLabs = labs.filter(lab => lab.name?.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="p-8 font-sans max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Billing & Approvals</h1>
          <p className="text-gray-500 mt-1">Manage lab commissions, view payment receipts, and toggle access.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search labs..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl font-bold transition-all"
          >
            <Settings className="w-4 h-4" /> Account Details
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Lab Info</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Payment Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Payment Details</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Portal Access</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredLabs.map((lab) => {
                  const isActive = !!lab.is_active; 
                  return (
                    <tr key={lab.id} className={`hover:bg-gray-50 transition-colors ${lab.payment_status === 'submitted' ? 'bg-yellow-50/50' : ''}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Image src={lab.logo_url || 'https://ui-avatars.com/api/?name=Lab'} alt="Lab" width={40} height={40} className="rounded-xl border border-gray-200 bg-white" unoptimized />
                          <div className="ml-3">
                            <p className="font-bold text-gray-900">{lab.name}</p>
                            <p className="text-xs font-bold text-red-500 mt-0.5">Bill: Rs. {lab.dueAmount}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        {lab.payment_status === 'submitted' ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-bold">
                            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Pending Review
                          </span>
                        ) : lab.payment_status === 'cleared' ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Cleared
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold">
                            <XCircle className="w-3.5 h-3.5" /> Due
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        {lab.payment_status === 'submitted' ? (
                          <div>
                            <p className="text-xs font-bold text-gray-900">{lab.sender_name}</p>
                            <p className="text-[10px] text-gray-500 uppercase">{lab.payment_method}</p>
                            {lab.payment_screenshot && (
                              <a href={lab.payment_screenshot} target="_blank" rel="noreferrer" className="flex items-center gap-1 mt-1.5 text-blue-600 hover:text-blue-800 text-xs font-bold">
                                <FileImage className="w-3.5 h-3.5" /> View Receipt
                              </a>
                            )}
                          </div>
                        ) : (
                          <p className="text-xs text-gray-400 italic">No recent submission</p>
                        )}
                      </td>

                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => toggleActiveStatus(lab.id, lab.is_active)}
                          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isActive ? 'bg-green-500' : 'bg-gray-300'}`}
                        >
                          <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isActive ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                        <p className={`text-[10px] font-bold mt-1 ${isActive ? 'text-green-600' : 'text-gray-500'}`}>
                          {isActive ? 'ACTIVE' : 'INACTIVE'}
                        </p>
                      </td>

                      <td className="px-6 py-4 text-right">
                        {lab.payment_status === 'submitted' && (
                          <button 
                            onClick={() => approvePayment(lab.id)}
                            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm shadow-blue-500/30"
                          >
                            <ShieldCheck className="w-4 h-4" /> Approve Payment
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {filteredLabs.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-medium">No labs found matching your search.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 🛑 Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsSettingsOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Settings</h2>
            
            <form onSubmit={saveSettings} className="space-y-4">
              <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                <h3 className="font-bold text-green-800 mb-3 uppercase text-xs tracking-wider">Easypaisa Details</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Mobile Number</label>
                    <input type="text" value={epNumber} onChange={(e) => setEpNumber(e.target.value)} className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-3 py-2 focus:outline-none focus:border-green-500" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Account Title</label>
                    <input type="text" value={epTitle} onChange={(e) => setEpTitle(e.target.value)} className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-3 py-2 focus:outline-none focus:border-green-500" required />
                  </div>
                </div>
              </div>

              <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                <h3 className="font-bold text-red-800 mb-3 uppercase text-xs tracking-wider">JazzCash Details</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Mobile Number</label>
                    <input type="text" value={jcNumber} onChange={(e) => setJcNumber(e.target.value)} className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-3 py-2 focus:outline-none focus:border-red-500" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Account Title</label>
                    <input type="text" value={jcTitle} onChange={(e) => setJcTitle(e.target.value)} className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-3 py-2 focus:outline-none focus:border-red-500" required />
                  </div>
                </div>
              </div>
              
              <button type="submit" disabled={isSavingSettings} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all flex justify-center mt-6">
                {isSavingSettings ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Bank Details'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}