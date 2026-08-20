"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Clock, Loader2, Save, AlertTriangle, Play, Pause } from 'lucide-react';

export default function PlatformSettingsPage() {
  const [startTime, setStartTime] = useState('09:00:00');
  const [endTime, setEndTime] = useState('18:00:00');
  const [isPaused, setIsPaused] = useState(false);
  const [registrationFee, setRegistrationFee] = useState(5000);
  
  // AI & Support Settings
  const [aiModelName, setAiModelName] = useState('openai/gpt-oss-20b');
  const [groqApiKey, setGroqApiKey] = useState('');
  const [aiApiEndpoint, setAiApiEndpoint] = useState('https://api.groq.com/openai/v1/chat/completions');
  const [supportWhatsapp, setSupportWhatsapp] = useState('923444488448');
  const [supportPhone, setSupportPhone] = useState('03444488448');
  const [supportEmail, setSupportEmail] = useState('bharosalabo@gmail.com');
  const [termsAndConditions, setTermsAndConditions] = useState(
    `1. تعارف و خدمات (Introduction):\nبھروسہ لیب ایک ڈیجیٹل ہیلتھ کیئر پلیٹ فارم ہے جو مریضوں کو مستند میڈیکل لیبارٹریز سے ہوم سیمپلنگ اور ماہر ڈاکٹرز سے آن لائن کنسلٹیشن فراہم کرتا ہے۔\n\n2. طبی دستبرداری (Medical Disclaimer):\nتمام ٹیسٹ رپورٹس متعلقہ رجسٹرڈ لیبارٹریز کی جانب سے جاری کی جاتی ہیں۔ ایپ پر دی جانے والی تجاویز کسی مستند ڈاکٹر کے متبادل نہیں ہیں۔\n\n3. ہوم کلیکشن و فیس (Home Sampling):\nہوم کلیکشن کی سروس دستیاب رائیڈرز اور طے شدہ اوقات کے مطابق فراہم کی جاتی ہے۔ لوکیشن کی بنیاد پر اضافی فیس لاگو ہو سکتی ہے۔\n\n4. پرائیویسی و رازداری (Privacy & Confidentiality):\nآپ کا ذاتی ڈیٹا اور میڈیکل ریکارڈز مکمل طور پر خفیہ رکھے جاتے ہیں اور صرف متعلقہ ڈاکٹر اور لیب کے ساتھ شیئر کیے جاتے ہیں۔`
  );

  const [facebookUrl, setFacebookUrl] = useState('');
  const [twitterUrl, setTwitterUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('platform_settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      const { data: appData } = await supabase
        .from('app_settings')
        .select('*')
        .eq('id', 1)
        .maybeSingle();

      if (data) {
        setStartTime(data.service_start_time || '09:00:00');
        setEndTime(data.service_end_time || '18:00:00');
        setIsPaused(data.is_service_paused || false);
        setFacebookUrl(data.facebook_url || '');
        setTwitterUrl(data.twitter_url || '');
        setInstagramUrl(data.instagram_url || '');
        setLinkedinUrl(data.linkedin_url || '');
      }
      
      if (appData) {
        if (appData.registration_fee !== undefined) setRegistrationFee(appData.registration_fee);
        if (appData.ai_model_name) setAiModelName(appData.ai_model_name);
        if (appData.groq_api_key) setGroqApiKey(appData.groq_api_key);
        if (appData.ai_api_endpoint) setAiApiEndpoint(appData.ai_api_endpoint);
        if (appData.support_whatsapp) setSupportWhatsapp(appData.support_whatsapp);
        if (appData.support_phone) setSupportPhone(appData.support_phone);
        if (appData.support_email) setSupportEmail(appData.support_email);
        if (appData.terms_and_conditions) setTermsAndConditions(appData.terms_and_conditions);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { data: existing } = await supabase.from('platform_settings').select('id').limit(1).maybeSingle();
      
      const payload = {
        service_start_time: startTime,
        service_end_time: endTime,
        is_service_paused: isPaused,
        facebook_url: facebookUrl,
        twitter_url: twitterUrl,
        instagram_url: instagramUrl,
        linkedin_url: linkedinUrl,
        updated_at: new Date().toISOString()
      };

      if (existing) {
        await supabase.from('platform_settings').update(payload).eq('id', existing.id);
      } else {
        await supabase.from('platform_settings').insert(payload);
      }

      // 🔴 Update app_settings (id=1) with Registration Fee, AI model, Endpoint, Support Info, and Terms
      await supabase.from('app_settings').upsert({
        id: 1,
        registration_fee: registrationFee,
        ai_model_name: aiModelName,
        groq_api_key: groqApiKey || null,
        ai_api_endpoint: aiApiEndpoint || 'https://api.groq.com/openai/v1/chat/completions',
        support_whatsapp: supportWhatsapp,
        support_phone: supportPhone,
        support_email: supportEmail,
        terms_and_conditions: termsAndConditions,
        updated_at: new Date().toISOString()
      });
      
      alert('Platform Settings Updated Successfully!');
    } catch (err: any) {
      alert('Error updating settings: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-10 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" /></div>;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 pb-20">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Platform Settings</h1>
        <p className="text-gray-500 mt-1">Manage global service hours and emergency controls for the Patient App.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6">
        <div className="p-5 sm:p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Clock className="text-blue-600 w-5 h-5" /> Operating Hours
          </h2>
          <p className="text-sm text-gray-500 mt-1">During these hours, patients can book tests for today. Outside these hours, they will be informed that the rider will arrive tomorrow.</p>
        </div>
        
        <div className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Service Start Time</label>
            <input 
              type="time" 
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 text-gray-900 rounded-xl border border-gray-200 focus:border-blue-500 outline-none text-lg font-medium"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Service End Time</label>
            <input 
              type="time" 
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 text-gray-900 rounded-xl border border-gray-200 focus:border-blue-500 outline-none text-lg font-medium"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Lab Registration Fee (Rs.)</label>
            <input 
              type="number" 
              value={registrationFee}
              onChange={(e) => setRegistrationFee(Number(e.target.value))}
              className="w-full px-4 py-3 bg-gray-50 text-gray-900 rounded-xl border border-gray-200 focus:border-blue-500 outline-none text-lg font-medium"
            />
          </div>
        </div>
      </div>

      <div className={`rounded-2xl border ${isPaused ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'} shadow-sm overflow-hidden mb-8 transition-colors`}>
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className={`text-lg font-bold flex items-center gap-2 ${isPaused ? 'text-red-700' : 'text-gray-800'}`}>
                <AlertTriangle className={isPaused ? 'text-red-600' : 'text-orange-500'} /> 
                Emergency Service Control
              </h2>
              <p className={`text-sm mt-1 max-w-lg ${isPaused ? 'text-red-600/80' : 'text-gray-500'}`}>
                If your riders are on leave or you cannot fulfill orders today, you can pause the service. Patients will be told to book for tomorrow.
              </p>
            </div>
            
            <button 
              onClick={() => setIsPaused(!isPaused)}
              className={`px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all ${isPaused ? 'bg-white text-red-600 border border-red-200 shadow-sm' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
            >
              {isPaused ? <><Play className="w-4 h-4 fill-current" /> Resume Service</> : <><Pause className="w-4 h-4 fill-current" /> Pause Service</>}
            </button>
          </div>
          
          {isPaused && (
            <div className="mt-4 p-3 bg-red-100 rounded-lg text-red-800 text-sm font-medium border border-red-200">
              ⚠️ Warning: Service is currently paused! Patients will see an unavailability message in the mobile app.
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-8">
        <div className="p-5 sm:p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            Social Media Links
          </h2>
          <p className="text-sm text-gray-500 mt-1">These links will appear in the Patient App's Profile section. Leave blank to hide an icon.</p>
        </div>
        
        <div className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Facebook URL</label>
            <input 
              type="url" 
              value={facebookUrl}
              onChange={(e) => setFacebookUrl(e.target.value)}
              placeholder="https://facebook.com/..."
              className="w-full px-4 py-3 bg-gray-50 text-gray-900 rounded-xl border border-gray-200 focus:border-blue-500 outline-none text-sm font-medium"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Twitter / X URL</label>
            <input 
              type="url" 
              value={twitterUrl}
              onChange={(e) => setTwitterUrl(e.target.value)}
              placeholder="https://twitter.com/..."
              className="w-full px-4 py-3 bg-gray-50 text-gray-900 rounded-xl border border-gray-200 focus:border-blue-500 outline-none text-sm font-medium"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Instagram URL</label>
            <input 
              type="url" 
              value={instagramUrl}
              onChange={(e) => setInstagramUrl(e.target.value)}
              placeholder="https://instagram.com/..."
              className="w-full px-4 py-3 bg-gray-50 text-gray-900 rounded-xl border border-gray-200 focus:border-blue-500 outline-none text-sm font-medium"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">LinkedIn URL</label>
            <input 
              type="url" 
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="https://linkedin.com/in/..."
              className="w-full px-4 py-3 bg-gray-50 text-gray-900 rounded-xl border border-gray-200 focus:border-blue-500 outline-none text-sm font-medium"
            />
          </div>
        </div>
      </div>

      {/* AI Doctor & Patient Support Settings */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-8">
        <div className="p-5 sm:p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            🤖 AI Doctor & Customer Support Settings
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Configure the live Groq AI model name and helpline contacts for the Patient App without needing to publish a new APK.
          </p>
        </div>
        
        <div className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Groq AI Model Name</label>
            <input 
              type="text" 
              value={aiModelName}
              onChange={(e) => setAiModelName(e.target.value)}
              placeholder="e.g. openai/gpt-oss-20b"
              className="w-full px-4 py-3 bg-gray-50 text-gray-900 rounded-xl border border-gray-200 focus:border-blue-500 outline-none text-sm font-bold font-mono"
            />
            <p className="text-xs text-gray-400 mt-1">Default: openai/gpt-oss-20b (Active Production Model)</p>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Groq / AI API Key</label>
            <input 
              type="password" 
              value={groqApiKey}
              onChange={(e) => setGroqApiKey(e.target.value)}
              placeholder="Paste custom API key"
              className="w-full px-4 py-3 bg-gray-50 text-gray-900 rounded-xl border border-gray-200 focus:border-blue-500 outline-none text-sm font-medium"
            />
            <p className="text-xs text-gray-400 mt-1">Leave empty to use default .env key</p>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-2">AI API Endpoint URL</label>
            <input 
              type="url" 
              value={aiApiEndpoint}
              onChange={(e) => setAiApiEndpoint(e.target.value)}
              placeholder="https://api.groq.com/openai/v1/chat/completions"
              className="w-full px-4 py-3 bg-gray-50 text-gray-900 rounded-xl border border-gray-200 focus:border-blue-500 outline-none text-sm font-mono text-gray-700"
            />
            <p className="text-xs text-gray-400 mt-1">Default: https://api.groq.com/openai/v1/chat/completions (Change to OpenRouter, DeepSeek, or Together AI if Groq becomes paid in future)</p>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Support WhatsApp Number</label>
            <input 
              type="text" 
              value={supportWhatsapp}
              onChange={(e) => setSupportWhatsapp(e.target.value)}
              placeholder="e.g. 923444488448"
              className="w-full px-4 py-3 bg-gray-50 text-gray-900 rounded-xl border border-gray-200 focus:border-blue-500 outline-none text-sm font-medium"
            />
            <p className="text-xs text-gray-400 mt-1">Country code format without + (e.g. 923444488448)</p>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Support Helpline Phone</label>
            <input 
              type="text" 
              value={supportPhone}
              onChange={(e) => setSupportPhone(e.target.value)}
              placeholder="e.g. 03444488448"
              className="w-full px-4 py-3 bg-gray-50 text-gray-900 rounded-xl border border-gray-200 focus:border-blue-500 outline-none text-sm font-medium"
            />
            <p className="text-xs text-gray-400 mt-1">Local phone format for direct dialing</p>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-2">Official Support Email</label>
            <input 
              type="email" 
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              placeholder="e.g. bharosalabo@gmail.com"
              className="w-full px-4 py-3 bg-gray-50 text-gray-900 rounded-xl border border-gray-200 focus:border-blue-500 outline-none text-sm font-medium"
            />
          </div>
        </div>
      </div>

      {/* Terms & Conditions (شرائط و ضوابط) */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-8">
        <div className="p-5 sm:p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            📜 Patient App Terms & Conditions (شرائط و ضوابط)
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Edit the legal terms, medical disclaimer, and home collection rules displayed to first-time patients and in the app's Terms section.
          </p>
        </div>

        <div className="p-5 sm:p-6">
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Terms & Conditions Content (قوانین و ضوابط)
          </label>
          <textarea 
            rows={8}
            value={termsAndConditions}
            onChange={(e) => setTermsAndConditions(e.target.value)}
            placeholder="Enter full legal terms, service rules, and disclaimers..."
            className="w-full p-4 bg-gray-50 text-gray-900 rounded-xl border border-gray-200 focus:border-blue-500 outline-none text-sm leading-relaxed font-medium"
          />
          <p className="text-xs text-gray-400 mt-2">
            Tip: You can write in Urdu, English, or both. Line breaks will be preserved in the mobile app.
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md flex items-center gap-2"
        >
          {isSaving ? <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</> : <><Save className="w-5 h-5" /> Save Changes</>}
        </button>
      </div>
    </div>
  );
}
