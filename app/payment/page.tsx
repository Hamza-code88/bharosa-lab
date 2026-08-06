"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Loader2, UploadCloud, CheckCircle, ShieldCheck, RefreshCw, Mail, AlertTriangle, Building2, UserCircle2, ArrowRight, ShieldAlert } from 'lucide-react';
import Image from 'next/image';

export default function CheckoutPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [paymentType, setPaymentType] = useState<'registration' | 'commission' | 'locked' | 'none'>('none');
  const [dueAmount, setDueAmount] = useState(0);
  const [labId, setLabId] = useState('');
  const [labName, setLabName] = useState('');
  const [labEmail, setLabEmail] = useState('');
  
  // Bank Details
  const [epDetails, setEpDetails] = useState({ number: '', title: '' });
  const [jcDetails, setJcDetails] = useState({ number: '', title: '' });
  const [spDetails, setSpDetails] = useState({ number: '', title: '' });

  // Form State
  const [selectedMethod, setSelectedMethod] = useState<'Easypaisa' | 'JazzCash' | 'SadaPay'>('Easypaisa');
  const [senderName, setSenderName] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);

  const [timeLeft, setTimeLeft] = useState(0);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    fetchStatus();
  }, []);

  // Timer Effect with LocalStorage Persistence
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPending && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            localStorage.removeItem('payment_timer');
            return 0;
          }
          localStorage.setItem('payment_timer', newTime.toString());
          return newTime;
        });
      }, 1000);
    }
    
    // Auto-check status every 30 seconds while pending
    if (isPending && timeLeft > 0 && timeLeft % 30 === 0) {
      checkApprovalStatus(false); 
    }

    return () => {
      clearInterval(timer);
    };
  }, [isPending, timeLeft]);

  const fetchStatus = async () => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        router.replace('/');
        return;
      }
      
      if (session.user.email) {
        setLabEmail(session.user.email);
      }

      const { data: lab } = await supabase
        .from('labs')
        .select('id, name, payment_status, last_cleared_date, is_registered_paid, registration_status, created_at, is_active')
        .eq('owner_id', session.user.id)
        .single();
        
      if (lab) {
        setLabId(lab.id);
        setLabName(lab.name);
        
        if (lab.registration_status === 'pending_approval' || lab.payment_status === 'submitted') {
          setIsPending(true);
          // Restore timer or start fresh
          const savedTime = localStorage.getItem('payment_timer');
          if (savedTime && parseInt(savedTime) > 0) {
            setTimeLeft(parseInt(savedTime));
          } else if (!savedTime) {
            setTimeLeft(300);
            localStorage.setItem('payment_timer', '300');
          }
          setIsLoading(false);
          return;
        }

        const { data: settings } = await supabase.from('app_settings').select('*').eq('id', 1).single();
        const regFee = settings?.registration_fee || 5000;

        const trialDays = Math.floor((Date.now() - new Date(lab.created_at).getTime()) / (1000 * 60 * 60 * 24));
        if (trialDays >= 30 && !lab.is_registered_paid) {
          setPaymentType('registration');
          setDueAmount(regFee); 
        } else {
          const rate = settings?.commission_percentage || 0;
          const threshold = settings?.commission_threshold || 2000;
          
          if (settings) {
            setEpDetails({ number: settings.easypaisa_number || 'N/A', title: settings.easypaisa_title || 'N/A' });
            setJcDetails({ number: settings.jazzcash_number || 'N/A', title: settings.jazzcash_title || 'N/A' });
            setSpDetails({ number: settings.sadapay_number || 'N/A', title: settings.sadapay_title || 'N/A' });
          }

          let query = supabase
            .from('bookings')
            .select('total_amount')
            .eq('lab_id', lab.id)
            .eq('status', 'Completed');

          if (lab.last_cleared_date) {
            query = query.gte('created_at', lab.last_cleared_date);
          }

          const { data: bookings } = await query;
          let totalBilled = bookings ? bookings.reduce((sum, b) => sum + (b.total_amount || 0), 0) : 0;
          const commissionDue = Math.round(totalBilled * (rate / 100));
          
          if (commissionDue >= threshold) {
            setPaymentType('commission');
            setDueAmount(commissionDue);
          } else if (lab.is_active === false) {
            // For testing: force registration payment when manually locked
            setPaymentType('registration');
            setDueAmount(regFee);
          } else {
            router.replace('/dashboard');
            return;
          }
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkApprovalStatus = async (showAlert = true) => {
    try {
      const { data: lab } = await supabase
        .from('labs')
        .select('payment_status, registration_status, is_active')
        .eq('id', labId)
        .single();

      if (lab) {
        const isStillPending = lab.registration_status === 'pending_approval' || lab.payment_status === 'submitted';
        
        if (!isStillPending && lab.is_active) {
          if (showAlert) alert("Status updated! Refreshing your account...");
          fetchStatus(); // Re-run full logic, which will route to dashboard if all clear
        } else {
          if (showAlert) alert("Still verifying. Please wait.");
        }
      }
    } catch (error) {
      console.error("Status check error:", error);
    }
  };

  const cancelAndReupload = async () => {
    setIsLoading(true);
    try {
      await supabase
        .from('labs')
        .update({
          registration_status: 'none',
          payment_status: 'accruing'
        })
        .eq('id', labId);
        
      localStorage.removeItem('payment_timer');
      setIsPending(false);
      setTimeLeft(0);
      setScreenshot(null);
      fetchStatus();
    } catch (error) {
      console.error("Error cancelling:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setScreenshot(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!screenshot || !senderName) {
      alert('Please provide your name and upload the payment receipt.');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('file', screenshot);
      
      const messageContent = `**New Payment Proof Uploaded**\n**Lab Name:** ${labName}\n**Email:** ${labEmail}\n**Sender Name:** ${senderName}\n**Amount Due:** Rs. ${dueAmount}\n**Payment Type:** ${paymentType}\n**Method:** ${selectedMethod}`;
      formData.append('content', messageContent);
      formData.append('labName', labName);
      formData.append('labEmail', labEmail);
      formData.append('paymentType', paymentType);

      const res = await fetch('/api/payment', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Failed to submit receipt securely.');

      const updatePayload = paymentType === 'registration' ? { registration_status: 'pending_approval' } : { payment_status: 'submitted' };
      const { error: dbError } = await supabase.from('labs').update(updatePayload).eq('id', labId);
      if (dbError) throw dbError;

      setIsPending(true);
      setTimeLeft(300); // Start timer
    } catch (error: any) {
      alert('Error: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>;

  // 🛑 Pending Verification (Timer UI)
  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F9FC] px-4 sm:px-6 font-sans">
        <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] max-w-md w-full text-center border border-gray-100">
          
          {timeLeft > 0 ? (
            <>
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying Payment</h2>
              <p className="text-gray-500 mb-6 text-sm">Please wait while our admin confirms your transaction.</p>
              
              <div className="text-5xl font-black text-gray-900 tracking-tighter mb-8 tabular-nums">
                {formatTime(timeLeft)}
              </div>
            </>
          ) : (
            <>
              <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-10 h-10 text-orange-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Delayed</h2>
              <p className="text-gray-500 mb-6 text-sm leading-relaxed">
                It seems our team is taking longer than usual to verify your payment. Please contact support.
              </p>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 flex items-center justify-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <span className="font-bold text-gray-900">bharosalabo@gmail.com</span>
              </div>
            </>
          )}

          <div className="flex flex-col gap-3 mt-6">
            <button 
              onClick={() => checkApprovalStatus(true)} 
              className="w-full bg-gray-900 hover:bg-black text-white font-semibold py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" /> Check Status Now
            </button>
            <button 
              onClick={cancelAndReupload}
              className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-bold py-3.5 px-6 rounded-xl transition-all border border-red-100"
            >
              Cancel & Re-upload
            </button>
          </div>

        </div>
      </div>
    );
  }

  // 🛑 Main Checkout UI (Hostinger Style)
  return (
    <div className="min-h-screen bg-[#F4F7F6] flex flex-col items-center py-10 px-4 sm:px-6 font-sans">
      
      {/* Header */}
      <div className="w-full max-w-4xl mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-indigo-600" />
          <h1 className="text-2xl font-bold text-gray-900">Secure Checkout</h1>
        </div>
      </div>

      {paymentType === 'locked' ? (
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-red-100 max-w-md w-full mt-8">
          <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Suspended</h2>
          <p className="text-gray-500 mb-6">Your lab account has been temporarily locked by the administration. Please contact support to resolve this issue.</p>
          <div className="bg-gray-50 p-4 rounded-xl flex items-center justify-center gap-3">
             <Mail className="w-5 h-5 text-gray-400" />
             <span className="font-bold text-gray-900">bharosalabo@gmail.com</span>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Column: Payment Methods Accordion */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-gray-900 mb-2">1. Choose Payment Method</h2>
          
          {[
            { id: 'Easypaisa', name: 'Easypaisa', details: epDetails, color: 'text-[#00C853]', bg: 'bg-[#00C853]', img: 'https://easypaisa.com.pk/wp-content/uploads/2023/10/easypaisa-icon.png' },
            { id: 'JazzCash', name: 'JazzCash', details: jcDetails, color: 'text-[#E31837]', bg: 'bg-[#E31837]', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/JazzCash_logo.svg/1200px-JazzCash_logo.svg.png' },
            { id: 'SadaPay', name: 'SadaPay', details: spDetails, color: 'text-[#FF6654]', bg: 'bg-[#FF6654]', img: 'https://sadapay.pk/wp-content/uploads/2021/04/sadapay-logo.png' }
          ].map((method) => {
            const isSelected = selectedMethod === method.id;
            return (
              <div 
                key={method.id} 
                onClick={() => setSelectedMethod(method.id as any)}
                className={`bg-white rounded-2xl border transition-all cursor-pointer overflow-hidden ${isSelected ? 'border-indigo-500 shadow-md ring-1 ring-indigo-500' : 'border-gray-200 hover:border-gray-300 shadow-sm'}`}
              >
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-indigo-600' : 'border-gray-300'}`}>
                      {isSelected && <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full" />}
                    </div>
                    <span className="font-bold text-gray-900 text-lg">{method.name}</span>
                  </div>
                </div>
                
                {/* Expanded Details Form */}
                {isSelected && (
                  <div className="px-4 pb-5 pt-2 bg-gray-50/50 border-t border-gray-100">
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-5">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Send exact amount to:</p>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <p className="text-gray-500 text-sm mb-0.5">Account Title</p>
                          <p className="font-bold text-gray-900">{method.details.title || 'Not Configured'}</p>
                        </div>
                        <div className="sm:text-right">
                          <p className="text-gray-500 text-sm mb-0.5">Account Number</p>
                          <p className={`font-black text-xl tracking-wide ${method.color}`}>{method.details.number || 'Not Configured'}</p>
                        </div>
                      </div>
                    </div>

                    <form id="payment-form" onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Your Name (Sender)</label>
                        <div className="relative">
                          <UserCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input 
                            type="text" 
                            required
                            value={senderName}
                            onChange={(e) => setSenderName(e.target.value)}
                            placeholder="e.g. Ali Raza"
                            className="w-full pl-10 pr-4 py-3 text-gray-900 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Payment Receipt (Screenshot)</label>
                        <div className="flex items-center justify-center w-full">
                          <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all ${screenshot ? 'border-green-400 bg-green-50' : 'border-gray-300 bg-white hover:bg-gray-50'}`}>
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              {screenshot ? (
                                <>
                                  <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
                                  <p className="text-sm font-bold text-green-700">{screenshot.name}</p>
                                </>
                              ) : (
                                <>
                                  <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                                  <p className="text-sm font-medium text-gray-600"><span className="font-bold text-indigo-600">Click to upload</span> or drag and drop</p>
                                </>
                              )}
                            </div>
                            <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} required />
                          </label>
                        </div>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sticky top-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-500 font-medium">Description</span>
              <span className="font-bold text-gray-900 text-right">
                {paymentType === 'registration' ? 'Platform Registration' : 'Commission Dues'}
              </span>
            </div>
            
            <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-100">
              <span className="text-gray-500 font-medium">Account Status</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800">
                Locked
              </span>
            </div>

            <div className="flex justify-between items-end mb-8">
              <span className="text-gray-900 font-bold text-lg">Total Due</span>
              <span className="text-3xl font-black text-gray-900">Rs. {dueAmount.toLocaleString()}</span>
            </div>

            <button 
              type="submit" 
              form="payment-form"
              disabled={isSubmitting || !screenshot}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-4 rounded-xl transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Submit Payment <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
            <p className="text-center text-xs text-gray-400 mt-4 font-medium flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Encrypted & Secure
            </p>
          </div>
        </div>

      </div>
      )}
    </div>
  );
}