// app/super-admin/support/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Phone, MessageCircle, Save, Loader2, CheckCircle2, Percent } from 'lucide-react';
import { supabase } from '@/lib/supabase'; 

export default function SupportSettingsPage() {
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [commission, setCommission] = useState(''); 
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .select('support_phone, support_whatsapp, commission_percentage')
        .eq('id', 1)
        .single();

      if (error) throw error;
      if (data) {
        setPhone(data.support_phone || '');
        setWhatsapp(data.support_whatsapp || '');
        setCommission(data.commission_percentage?.toString() || '0');
      }
    } catch (error: any) {
      console.error("Error fetching settings:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ text: '', type: '' });

    try {
      // 1. Update App Settings
      const { error: settingsError } = await supabase
        .from('app_settings')
        .update({ 
          support_phone: phone, 
          support_whatsapp: whatsapp,
          commission_percentage: Number(commission) || 0 
        })
        .eq('id', 1);

      if (settingsError) throw settingsError;
      
      // 🛑 THE MAGIC TRICK: Update ALL labs' phone numbers to this new official number
      // Is se mobile app mein auto sab labs pe yehi number show hoga bina app update kiye!
      const { error: labsError } = await supabase
        .from('labs')
        .update({ phone_number: phone })
        .not('id', 'is', null); // Supabase hack to update all rows

      if (labsError) throw labsError;
      
      setMessage({ text: 'Settings updated & applied to all labs successfully!', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 4000);
    } catch (error: any) {
      setMessage({ text: error.message || 'Failed to update settings.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex h-[80vh] items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Platform Settings</h1>
        <p className="text-gray-500 mt-1">Manage Support Contact Numbers and Global Platform Commission.</p>
      </div>

      {message.text && (
        <div className={`flex items-center gap-3 p-4 rounded-xl mb-6 border font-bold ${message.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
          {message.type === 'success' ? <CheckCircle2 size={20} /> : null}
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <form onSubmit={handleSave} className="space-y-6">
          
          {/* COMMISSION INPUT */}
          <div className="space-y-2 bg-blue-50/50 p-6 rounded-xl border border-blue-100">
            <label className="text-sm font-extrabold text-blue-900 uppercase tracking-wider">
              Platform Commission (%)
            </label>
            <p className="text-xs text-blue-600 mb-2">How much percentage (%) do you charge from Labs per test?</p>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Percent className="h-5 w-5 text-blue-600" />
              </div>
              <input
                type="number"
                value={commission}
                onChange={(e) => setCommission(e.target.value)}
                min="0" max="100"
                required
                className="block w-full pl-12 pr-4 py-3 bg-white border border-blue-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-600 outline-none font-bold"
                placeholder="e.g. 30"
              />
            </div>
          </div>

          <hr className="border-gray-100 my-8" />

          {/* Direct Call Input */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Official Direct Call Number</label>
            <p className="text-xs text-gray-500 mb-2">This number will automatically be assigned to ALL labs in the mobile app.</p>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Phone className="h-5 w-5 text-gray-400" /></div>
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required className="block w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-600 outline-none font-medium" />
            </div>
          </div>

          {/* WhatsApp Input */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Official WhatsApp Number</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><MessageCircle className="h-5 w-5 text-[#25D366]" /></div>
              <input type="text" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} required className="block w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-green-500 outline-none font-medium" />
            </div>
          </div>

          <div className="pt-4">
            <button type="submit" disabled={isSaving} className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 disabled:opacity-70">
              {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {isSaving ? 'Saving & Applying to Labs...' : 'Save Settings'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}