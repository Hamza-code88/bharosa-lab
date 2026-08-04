"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, CheckCircle2, XCircle, Search, FileImage, ShieldCheck, Settings, X, AlertTriangle, History, Calendar, Filter, Clock } from 'lucide-react';
import Image from 'next/image';

export default function BillingApprovalsPage() {
  const [labs, setLabs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // 🛑 Store global settings
  const [globalThreshold, setGlobalThreshold] = useState(2000);

  // 🛑 Settings Modal States
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [epNumber, setEpNumber] = useState('');
  const [epTitle, setEpTitle] = useState('');
  const [jcNumber, setJcNumber] = useState('');
  const [jcTitle, setJcTitle] = useState('');
  const [spNumber, setSpNumber] = useState('');
  const [spTitle, setSpTitle] = useState('');
  const [commissionThreshold, setCommissionThreshold] = useState('');
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // 🛑 NAYA: History Modal States
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedLabHistory, setSelectedLabHistory] = useState<{id: string, name: string} | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [historyFilter, setHistoryFilter] = useState('all'); // 'all', 'week', 'month'

  useEffect(() => {
    fetchLabsAndDues();
    fetchSettings();
  }, []);

  const fetchLabsAndDues = async () => {
    setIsLoading(true);
    const { data: settings } = await supabase.from('app_settings').select('commission_percentage, commission_threshold').eq('id', 1).single();
    const rate = settings?.commission_percentage || 0;
    const threshold = settings?.commission_threshold || 2000;
    setGlobalThreshold(threshold);

    const { data: labsData } = await supabase
      .from('labs')
      .select('id, name, city, is_active, payment_status, payment_method, sender_name, payment_screenshot, last_cleared_date, last_paid_amount, logo_url')
      .order('payment_status', { ascending: false });

    const { data: bookings } = await supabase.from('bookings').select('lab_id, total_amount, created_at').eq('status', 'Completed');

    if (labsData) {
      const enrichedLabs = labsData.map(lab => {
        const labBookings = bookings?.filter(b => {
          if (b.lab_id !== lab.id) return false;
          if (!lab.last_cleared_date) return true; 
          return new Date(b.created_at) > new Date(lab.last_cleared_date);
        }) || [];
        
        const totalBilled = labBookings.reduce((sum, b) => sum + (b.total_amount || 0), 0);
        const dueAmount = Math.round(totalBilled * (rate / 100));
        
        const isSystemBlocked = dueAmount >= threshold && lab.payment_status !== 'submitted';
        
        return { ...lab, dueAmount, isSystemBlocked };
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
      setSpNumber(data.sadapay_number || '');
      setSpTitle(data.sadapay_title || '');
      setCommissionThreshold(data.commission_threshold?.toString() || '2000');
    }
  };

  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    const newThreshold = parseInt(commissionThreshold) || 2000;
    
    const { error } = await supabase.from('app_settings').update({ 
      easypaisa_number: epNumber, 
      easypaisa_title: epTitle,
      jazzcash_number: jcNumber,
      jazzcash_title: jcTitle,
      sadapay_number: spNumber,
      sadapay_title: spTitle,
      commission_threshold: newThreshold
    }).eq('id', 1);
    
    if (!error) {
      alert("Settings Updated Successfully!");
      setGlobalThreshold(newThreshold);
      setIsSettingsOpen(false);
      fetchLabsAndDues(); 
    } else {
      alert("Error saving details.");
    }
    setIsSavingSettings(false);
  };

  const toggleActiveStatus = async (labId: string, currentStatus: any, isSystemBlocked: boolean) => {
    if (isSystemBlocked) {
      alert("This lab is blocked by the system due to unpaid commission. You must approve their payment to reactivate them.");
      return;
    }

    const isCurrentlyActive = !!currentStatus; 
    const newStatus = !isCurrentlyActive;
    if (!confirm(`Are you sure you want to manually ${newStatus ? 'Activate' : 'Deactivate'} this lab?`)) return;

    setLabs(labs.map(lab => lab.id === labId ? { ...lab, is_active: newStatus } : lab));

    const { error } = await supabase.from('labs').update({ is_active: newStatus }).eq('id', labId);
    if (error) {
      alert("Error updating status!");
      setLabs(labs.map(lab => lab.id === labId ? { ...lab, is_active: isCurrentlyActive } : lab));
    }
  };

  const approvePayment = async (labId: string, amountCleared: number) => {
    if (!confirm(`Are you sure you want to approve this payment of Rs. ${amountCleared}? This will reset their limit and save a record.`)) return;

    const currentISOTime = new Date().toISOString();

    // 1. Lab status update karein
    const { error: labError } = await supabase
      .from('labs')
      .update({
        payment_status: 'cleared',
        is_active: true, 
        last_cleared_date: currentISOTime,
        last_paid_amount: amountCleared, 
        payment_screenshot: null, 
        sender_name: null
      })
      .eq('id', labId);

    // 2. NAYA: Payment History table mein record save karein
    const { error: historyError } = await supabase
      .from('payment_history')
      .insert({
        lab_id: labId,
        amount_cleared: amountCleared,
        cleared_at: currentISOTime
      });

    if (!labError && !historyError) {
      alert("Payment Approved! Lab limit reset and history recorded.");
      fetchLabsAndDues(); 
    } else {
      alert("Error approving payment or saving history!");
      console.error(labError, historyError);
    }
  };

  // 🛑 NAYA: History fetch karne ka function
  const openHistoryModal = async (lab: any) => {
    setSelectedLabHistory({ id: lab.id, name: lab.name });
    setIsHistoryModalOpen(true);
    setIsHistoryLoading(true);
    setHistoryFilter('all'); // Reset filter

    const { data, error } = await supabase
      .from('payment_history')
      .select('*')
      .eq('lab_id', lab.id)
      .order('cleared_at', { ascending: false });

    if (!error && data) {
      setPaymentHistory(data);
    }
    setIsHistoryLoading(false);
  };

  // 🛑 NAYA: History Filter Logic
  const filteredHistory = paymentHistory.filter(record => {
    if (historyFilter === 'all') return true;
    
    const recordDate = new Date(record.cleared_at);
    const now = new Date();
    
    if (historyFilter === 'week') {
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return recordDate >= oneWeekAgo;
    }
    
    if (historyFilter === 'month') {
      return recordDate.getMonth() === now.getMonth() && recordDate.getFullYear() === now.getFullYear();
    }
    
    return true;
  });

  const totalFilteredAmount = filteredHistory.reduce((sum, record) => sum + record.amount_cleared, 0);

  const filteredLabs = labs.filter(lab => lab.name?.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="p-8 font-sans max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Billing & Approvals</h1>
          <p className="text-gray-500 mt-1">Manage lab thresholds, view payment receipts, and track payment history.</p>
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
            <Settings className="w-4 h-4" /> Billing Settings
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
                  const isActive = !!lab.is_active && !lab.isSystemBlocked; 

                  return (
                    <tr key={lab.id} className={`hover:bg-gray-50 transition-colors ${lab.payment_status === 'submitted' ? 'bg-yellow-50/50' : lab.isSystemBlocked ? 'bg-red-50/20' : ''}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Image src={lab.logo_url || 'https://ui-avatars.com/api/?name=Lab'} alt="Lab" width={40} height={40} className="rounded-xl border border-gray-200 bg-white" unoptimized />
                          <div className="ml-3">
                            <p className="font-bold text-gray-900">{lab.name}</p>
                            <p className={`text-xs font-bold mt-0.5 ${lab.isSystemBlocked ? 'text-red-600' : 'text-orange-500'}`}>
                              Due: Rs. {lab.dueAmount}
                            </p>
                            {lab.last_cleared_date && (
                              <p className="inline-block mt-1.5 px-2 py-0.5 bg-green-50 border border-green-100 text-green-700 text-[10px] font-bold rounded-md">
                                Last Paid: Rs. {lab.last_paid_amount || 0}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        {lab.payment_status === 'submitted' ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-bold">
                            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Pending Review
                          </span>
                        ) : lab.isSystemBlocked ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold border border-red-200">
                            <AlertTriangle className="w-3.5 h-3.5" /> Over Limit
                          </span>
                        ) : lab.payment_status === 'cleared' ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Cleared
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-bold">
                            <XCircle className="w-3.5 h-3.5" /> Accruing
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
                          onClick={() => toggleActiveStatus(lab.id, lab.is_active, lab.isSystemBlocked)}
                          disabled={lab.isSystemBlocked && lab.payment_status !== 'submitted'}
                          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none 
                            ${lab.isSystemBlocked && lab.payment_status !== 'submitted' ? 'bg-red-400 opacity-50 cursor-not-allowed' : isActive ? 'bg-green-500' : 'bg-gray-300'}
                          `}
                        >
                          <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isActive ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                        <p className={`text-[10px] font-bold mt-1 
                          ${lab.isSystemBlocked && lab.payment_status !== 'submitted' ? 'text-red-500' : isActive ? 'text-green-600' : 'text-gray-500'}
                        `}>
                          {lab.isSystemBlocked && lab.payment_status !== 'submitted' ? 'AUTO-BLOCKED' : isActive ? 'ACTIVE' : 'INACTIVE'}
                        </p>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* 🛑 NAYA: History Button */}
                          <button 
                            onClick={() => openHistoryModal(lab)}
                            className="inline-flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-xl text-xs font-bold transition-all"
                            title="View Payment History"
                          >
                            <History className="w-4 h-4" /> History
                          </button>
                          
                          {(lab.payment_status === 'submitted' || lab.isSystemBlocked) && (
                            <button 
                              onClick={() => approvePayment(lab.id, lab.dueAmount)} 
                              className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-sm shadow-blue-500/30"
                            >
                              <ShieldCheck className="w-4 h-4" /> Approve
                            </button>
                          )}
                        </div>
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Billing Settings</h2>
            
            <form onSubmit={saveSettings} className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <h3 className="font-bold text-blue-800 mb-2 uppercase text-xs tracking-wider">Commission Threshold Limit</h3>
                <p className="text-xs text-blue-600 mb-3">Amount at which a lab gets blocked.</p>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Threshold Amount (Rs.)</label>
                  <input type="number" value={commissionThreshold} onChange={(e) => setCommissionThreshold(e.target.value)} className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500" required />
                </div>
              </div>

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
                {isSavingSettings ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Settings'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 🛑 NAYA: Payment History Modal */}
      {isHistoryModalOpen && selectedLabHistory && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-2xl shadow-2xl relative max-h-[90vh] flex flex-col">
            <button onClick={() => setIsHistoryModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 z-10">
              <X className="w-6 h-6" />
            </button>
            
            <div className="mb-6 pr-8">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <History className="w-6 h-6 text-blue-600" /> Payment Ledger
              </h2>
              <p className="text-gray-500 mt-1">Showing cleared payment history for <strong className="text-gray-800">{selectedLabHistory.name}</strong></p>
            </div>

            {/* Filters & Summary */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select 
                  value={historyFilter} 
                  onChange={(e) => setHistoryFilter(e.target.value)}
                  className="bg-white border border-gray-200 text-sm font-bold text-gray-700 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Time</option>
                  <option value="month">This Month</option>
                  <option value="week">Past 7 Days</option>
                </select>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total in Period</p>
                <p className="text-lg font-black text-green-600">Rs. {totalFilteredAmount.toLocaleString()}</p>
              </div>
            </div>

            {/* History List */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {isHistoryLoading ? (
                <div className="flex justify-center items-center py-12"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
              ) : filteredHistory.length === 0 ? (
                <div className="text-center py-12">
                  <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No payment history found for this period.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredHistory.map((record) => (
                    <div key={record.id} className="flex items-center justify-between bg-white border border-gray-100 p-4 rounded-xl shadow-sm hover:border-blue-100 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center border border-green-100">
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">Payment Cleared</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                            <Calendar className="w-3 h-3" /> 
                            {new Date(record.cleared_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-gray-900">Rs. {record.amount_cleared.toLocaleString()}</p>
                        <p className="text-[10px] text-green-600 font-bold bg-green-100 px-2 py-0.5 rounded-full inline-block mt-1">Paid</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}