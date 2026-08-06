"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Clock, Loader2, Save, AlertTriangle, Play, Pause } from 'lucide-react';

export default function PlatformSettingsPage() {
  const [startTime, setStartTime] = useState('09:00:00');
  const [endTime, setEndTime] = useState('18:00:00');
  const [isPaused, setIsPaused] = useState(false);
  const [registrationFee, setRegistrationFee] = useState(5000);
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
        .select('registration_fee')
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
      
      if (appData && appData.registration_fee !== undefined) {
        setRegistrationFee(appData.registration_fee);
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

      // 🔴 Update Registration Fee in app_settings (id=1)
      await supabase.from('app_settings').update({ registration_fee: registrationFee }).eq('id', 1);
      
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
