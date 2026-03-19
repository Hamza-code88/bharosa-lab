'use client';

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import {  Smartphone, Image as ImageIcon, Upload, Link as LinkIcon, CheckCircle2 } from 'lucide-react';

export default function AdControlPage() {
  const [adData, setAdData] = useState<any>({
    title: '', subtitle: '', tag: '', image_url: '', is_active: false, 
    button_text: 'Book Now', bg_color: '#2563EB', text_color: '#FFFFFF',
    action_url: '/search' // 🛑 NAYA: Link save karne ke liye
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [imageMode, setImageMode] = useState<'url' | 'upload'>('url');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchAdData();
  }, []);

  const fetchAdData = async () => {
    try {
      const { data, error } = await supabase.from('app_promotions').select('*').limit(1).single();
      if (data) setAdData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      const objectUrl = URL.createObjectURL(e.target.files[0]);
      setAdData({ ...adData, image_url: objectUrl });
    }
  };

  const handleUpdateAd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      let finalImageUrl = adData.image_url;

      if (imageMode === 'upload' && selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `banner_${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage.from('banners').upload(fileName, selectedFile);
        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage.from('banners').getPublicUrl(fileName);
        finalImageUrl = publicUrlData.publicUrl;
      }

      const { error } = await supabase.from('app_promotions').update({
        title: adData.title,
        subtitle: adData.subtitle,
        tag: adData.tag,
        image_url: finalImageUrl,
        button_text: adData.button_text,
        bg_color: adData.bg_color,
        text_color: adData.text_color,
        action_url: adData.action_url, // 🛑 NAYA: Supabase mein link save ho raha hai
        is_active: adData.is_active,
        updated_at: new Date().toISOString(),
      }).eq('id', adData?.id);

      if (error) throw error;
      alert('Banner fully updated on the App! 🚀');
      
      if (imageMode === 'upload') {
        setSelectedFile(null);
        setAdData({...adData, image_url: finalImageUrl});
      }

    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-10 text-center text-gray-400">Loading Workspace...</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 md:p-12 font-sans text-gray-900">
      
      <div className="max-w-6xl mx-auto mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Campaign & Ad Manager</h1>
        <p className="text-gray-500">Full control over your mobile app&apos;s promotional banner.</p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleUpdateAd} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            
            <div className="bg-gray-50 p-1.5 rounded-xl flex gap-1 w-full max-w-sm">
              <button type="button" onClick={() => setImageMode('url')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${imageMode === 'url' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}><LinkIcon size={16} /> URL Link</button>
              <button type="button" onClick={() => setImageMode('upload')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${imageMode === 'upload' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}><Upload size={16} /> Upload File</button>
            </div>

            {imageMode === 'url' ? (
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 tracking-wider uppercase">Image URL</label>
                <input type="text" value={adData?.image_url || ''} onChange={(e) => setAdData({...adData, image_url: e.target.value})} className="w-full bg-white border border-gray-200 text-gray-900 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="https://example.com/banner.jpg" />
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 tracking-wider uppercase">Upload Image</label>
                <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full bg-white border-2 border-dashed border-gray-300 text-gray-600 rounded-xl px-4 py-6 hover:border-blue-500 hover:text-blue-600 transition-all flex flex-col items-center justify-center gap-2"><ImageIcon size={24} /><span className="font-medium">{selectedFile ? selectedFile.name : 'Click to browse image'}</span></button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-gray-500 tracking-wider uppercase">Main Headline</label>
                <input type="text" value={adData?.title || ''} onChange={(e) => setAdData({...adData, title: e.target.value})} className="w-full bg-white border border-gray-200 text-gray-900 font-bold text-lg rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-blue-500 outline-none" required />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 tracking-wider uppercase">Sub-text</label>
                <input type="text" value={adData?.subtitle || ''} onChange={(e) => setAdData({...adData, subtitle: e.target.value})} className="w-full bg-white border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 tracking-wider uppercase">Top Badge</label>
                <input type="text" value={adData?.tag || ''} onChange={(e) => setAdData({...adData, tag: e.target.value})} className="w-full bg-white border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 space-y-5 mt-4">
              <h3 className="font-bold text-gray-900 flex items-center gap-2"><Smartphone size={18} /> Button & Design Controls</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold text-gray-500 tracking-wider uppercase">Button Text</label>
                  <input type="text" value={adData?.button_text || ''} onChange={(e) => setAdData({...adData, button_text: e.target.value})} className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                {/* 🛑 NAYA: Link Input */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold text-gray-500 tracking-wider uppercase">Destination Route</label>
                  <input type="text" value={adData?.action_url || ''} onChange={(e) => setAdData({...adData, action_url: e.target.value})} className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="/search ya /labs" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 tracking-wider uppercase">Background</label>
                  <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-1.5">
                    <input type="color" value={adData?.bg_color || '#2563EB'} onChange={(e) => setAdData({...adData, bg_color: e.target.value})} className="w-8 h-8 rounded cursor-pointer border-0 p-0" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 tracking-wider uppercase">Text Color</label>
                  <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-1.5">
                    <input type="color" value={adData?.text_color || '#FFFFFF'} onChange={(e) => setAdData({...adData, text_color: e.target.value})} className="w-8 h-8 rounded cursor-pointer border-0 p-0" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <label className="relative inline-flex items-center cursor-pointer gap-3">
                <input type="checkbox" className="sr-only peer" checked={adData?.is_active || false} onChange={(e) => setAdData({...adData, is_active: e.target.checked})} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="font-bold text-gray-900">Show in App</span>
              </label>

              <button type="submit" disabled={isSaving} className="flex items-center gap-2 bg-black text-white px-8 py-3.5 rounded-xl font-bold hover:bg-gray-800 transition-all disabled:opacity-70">
                {isSaving ? 'Deploying...' : 'Publish to App'} {!isSaving && <CheckCircle2 size={18} />}
              </button>
            </div>
          </form>
        </div>

        <div className="lg:col-span-5 flex justify-center">
          <div className="w-[320px] bg-gray-50 border-[8px] border-gray-900 rounded-[40px] shadow-2xl overflow-hidden relative h-[600px] flex flex-col">
            <div className="absolute top-0 inset-x-0 h-6 bg-gray-900 rounded-b-2xl mx-16 z-20"></div>
            <div className="pt-12 pb-4 px-5 bg-white flex justify-between items-center z-10"><div className="w-24 h-4 bg-gray-200 rounded-full"></div><div className="w-8 h-8 bg-gray-200 rounded-full"></div></div>

            <div className="flex-1 p-5 overflow-hidden">
              <div 
                className={`rounded-[24px] p-6 shadow-xl relative overflow-hidden transition-all duration-300 min-h-[180px] flex flex-col justify-center ${adData?.is_active ? 'opacity-100 scale-100' : 'opacity-40 scale-95 grayscale'}`}
                style={{ backgroundColor: adData?.bg_color || '#2563EB' }} 
              >
                {adData?.image_url && (
                  <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${adData.image_url})` }}>
                    <div className="absolute inset-0 bg-black/40"></div>
                  </div>
                )}
                
                <div className="relative z-10" style={{ color: adData?.text_color || '#FFFFFF' }}>
                  {adData?.tag && <span className="font-bold mb-2 uppercase tracking-wider text-[10px] opacity-90 inline-block">{adData.tag}</span>}
                  <h3 className="font-extrabold text-2xl mb-1 leading-tight">{adData?.title || 'MAIN HEADLINE'}</h3>
                  {adData?.subtitle && <p className="text-xs mb-4 opacity-90">{adData.subtitle}</p>}
                  
                  <div className="px-4 py-2 rounded-xl self-start inline-block shadow-sm" style={{ backgroundColor: adData?.text_color || '#FFFFFF', color: adData?.bg_color || '#2563EB' }}>
                    <span className="font-bold text-sm">{adData?.button_text || 'Book Now'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}