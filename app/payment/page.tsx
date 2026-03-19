"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Loader2, UploadCloud, CheckCircle, AlertTriangle, Image as ImageIcon } from 'lucide-react';

export default function PaymentPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dueAmount, setDueAmount] = useState(0);
  const [labId, setLabId] = useState('');
  
  // 🛑 NAYA: Alag Alag Bank Details States
  const [epDetails, setEpDetails] = useState({ number: '', title: '' });
  const [jcDetails, setJcDetails] = useState({ number: '', title: '' });

  const [paymentMethod, setPaymentMethod] = useState('Easypaisa');
  const [senderName, setSenderName] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);

  useEffect(() => {
    fetchDues();
  }, []);

  const fetchDues = async () => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        router.replace('/');
        return;
      }

      const { data: lab } = await supabase.from('labs').select('id, payment_status').eq('owner_id', session.user.id).single();
      if (lab) {
        setLabId(lab.id);
        
        if (lab.payment_status === 'submitted') {
          setDueAmount(-1); 
          setIsLoading(false);
          return;
        }

        const { data: bookings } = await supabase
          .from('bookings')
          .select('total_amount')
          .eq('lab_id', lab.id)
          .eq('status', 'Completed');

        // 🛑 NAYA: Fetching Separate Settings
        const { data: settings } = await supabase.from('app_settings').select('*').eq('id', 1).single();
        const rate = settings?.commission_percentage || 0;
        
        if (settings) {
          setEpDetails({ number: settings.easypaisa_number || 'N/A', title: settings.easypaisa_title || 'N/A' });
          setJcDetails({ number: settings.jazzcash_number || 'N/A', title: settings.jazzcash_title || 'N/A' });
        }

        let totalBilled = 0;
        if (bookings) {
          totalBilled = bookings.reduce((sum, b) => sum + (b.total_amount || 0), 0);
        }
        
        const commissionDue = Math.round(totalBilled * (rate / 100));
        setDueAmount(commissionDue);
      }
    } catch (error) {
      console.error(error);
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
      alert('براہ کرم سکرین شاٹ اور نام فراہم کریں۔');
      return;
    }

    setIsSubmitting(true);
    try {
      const fileExt = screenshot.name.split('.').pop();
      const fileName = `${labId}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage.from('receipts').upload(fileName, screenshot);
      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage.from('receipts').getPublicUrl(fileName);
      
      const { error: dbError } = await supabase
        .from('labs')
        .update({
          payment_status: 'submitted',
          payment_method: paymentMethod,
          sender_name: senderName,
          payment_screenshot: publicUrlData.publicUrl
        })
        .eq('id', labId);

      if (dbError) throw dbError;

      alert('رسید کامیابی سے جمع کر دی گئی ہے!');
      setDueAmount(-1); 

    } catch (error: any) {
      alert('Error uploading receipt: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>;

  if (dueAmount === -1) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-8 rounded-3xl shadow-lg max-w-md w-full text-center border-t-8 border-yellow-400">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Pending</h2>
          <p className="text-gray-500 mb-6 font-medium text-lg leading-relaxed">
            آپ کی رسید موصول ہو گئی ہے۔ ایڈمن کی تصدیق کے بعد آپ کا ڈیش بورڈ کھول دیا جائے گا۔ شکریہ!
          </p>
          <button onClick={() => router.replace('/')} className="text-blue-600 font-bold hover:underline">Back to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        
        <div className="bg-white py-8 px-6 shadow-xl rounded-3xl sm:px-10 border-t-8 border-red-500 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-red-50 p-4 rounded-bl-full w-24 h-24 -mr-4 -mt-4 z-0"></div>
          
          <div className="relative z-10 text-center mb-8">
            <AlertTriangle className="w-14 h-14 text-red-500 mx-auto mb-4" />
            <h2 className="text-3xl font-extrabold text-gray-900">Platform Bill Due</h2>
            <p className="text-red-600 font-bold text-xl mt-2">Rs. {dueAmount.toLocaleString()} <span className="text-sm font-normal text-gray-500">(یا پرانا بقایا بل)</span></p>
          </div>

          <div className="bg-blue-50 p-5 rounded-2xl mb-8 border border-blue-100">
            <p className="text-right text-blue-900 font-bold text-lg leading-relaxed dir-rtl" style={{ direction: 'rtl' }}>
              معزز پارٹنر، آپ کے پلیٹ فارم کے استعمال کا بل ادا کرنا باقی ہے۔ ڈیش بورڈ کا استعمال جاری رکھنے کے لیے براہ کرم نیچے دیے گئے اکاؤنٹ میں رقم جمع کرائیں اور رسید اپ لوڈ کریں۔
            </p>
            
            {/* 🛑 NAYA: Separate Account Details Display */}
            <div className="mt-4 flex flex-col gap-3">
              <div className="bg-white p-4 rounded-xl border border-green-200 shadow-sm text-left">
                <p className="text-green-600 text-xs font-extrabold uppercase tracking-wider mb-1">Easypaisa</p>
                <p className="text-gray-900 font-bold text-lg">{epDetails.number}</p>
                <p className="text-gray-500 text-sm font-medium mt-0.5">Title: <span className="text-gray-900">{epDetails.title}</span></p>
              </div>
              
              <div className="bg-white p-4 rounded-xl border border-red-200 shadow-sm text-left">
                <p className="text-red-600 text-xs font-extrabold uppercase tracking-wider mb-1">JazzCash</p>
                <p className="text-gray-900 font-bold text-lg">{jcDetails.number}</p>
                <p className="text-gray-500 text-sm font-medium mt-0.5">Title: <span className="text-gray-900">{jcDetails.title}</span></p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div>
              <label className="block text-sm font-bold text-gray-700">Payment Method</label>
              <select 
                value={paymentMethod} 
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-3 text-base border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-xl"
              >
                <option className="text-gray-900">Easypaisa</option>
                <option className="text-gray-900">JazzCash</option>
                <option className="text-gray-900">Bank Transfer</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700">Account Owner Name (بھیجنے والے کا نام)</label>
              <input 
                type="text" 
                required
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="e.g. Ali Raza"
                className="mt-1 appearance-none block w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Upload Screenshot (رسید کی تصویر)</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="space-y-2 text-center">
                  {screenshot ? (
                    <div className="flex flex-col items-center">
                      <ImageIcon className="mx-auto h-10 w-10 text-green-500" />
                      <p className="text-sm text-green-600 font-bold mt-2">{screenshot.name}</p>
                      <button type="button" onClick={() => setScreenshot(null)} className="text-xs text-red-500 mt-1 font-bold">Remove</button>
                    </div>
                  ) : (
                    <>
                      <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600 justify-center">
                        <label className="relative cursor-pointer rounded-md font-bold text-blue-600 hover:text-blue-500 focus-within:outline-none">
                          <span>Upload Receipt</span>
                          <input type="file" accept="image/*" className="sr-only" onChange={handleFileUpload} required />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting || !screenshot}
              className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-base font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Submit Payment Proof'}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}