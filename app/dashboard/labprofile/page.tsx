'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image'; // 🛑 NAYA: Next.js Image component import kiya
import { supabase } from '@/lib/supabase';
import { Smartphone, Image as ImageIcon, MapPin, Phone, User, Activity, CheckCircle2, Star, MoreVertical } from 'lucide-react';

// Components
import BasicInfo, { LabData } from '../../components/labprofile/BasicInfo'; // 🛑 NAYA: LabData interface BasicInfo se import kiya
import LocationPicker from '../../components/labprofile/LocationPicker';

export default function PremiumLabProfile() {
  // 🛑 FIX: <any> hata kar <LabData> lagaya
  const [labData, setLabData] = useState<LabData>({
    name: '', city: '', address: '', experience_years: '', phone_number: '', speciality: 'Pathology & Radiology',
    owner_name: '', logo_url: '', owner_image: '', 
    latitude: '', longitude: ''
  });
  
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const ownerInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchExistingData();
  }, []);

  const fetchExistingData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUserId(session.user.id);
        const { data: dbData } = await supabase.from('labs').select('*').eq('owner_id', session.user.id).maybeSingle();
        
        if (dbData) {
          let lat = '', lng = '';
          if (dbData.location_pin) {
            const coords = dbData.location_pin.match(/[+-]?([0-9]*[.])?[0-9]+/g);
            if (coords && coords.length >= 2) {
              lng = coords[0];
              lat = coords[1];
            }
          }
          setLabData({ ...dbData, latitude: lat, longitude: lng });
        }
      }
    } catch (err: unknown) { // 🛑 FIX: 'any' ki jagah 'unknown'
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (file: File, folder: string) => {
    if (file.size > 4 * 1024 * 1024) {
      alert(`File too large. Max 4MB allowed.`);
      return null;
    }
    const fileName = `${userId}-${folder}-${Date.now()}.${file.name.split('.').pop()}`;
    const { error } = await supabase.storage.from('lab-images').upload(fileName, file);
    if (error) {
      alert("Upload failed: " + error.message);
      return null;
    }
    return supabase.storage.from('lab-images').getPublicUrl(fileName).data.publicUrl;
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'owner' | 'certificates') => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const objectUrl = URL.createObjectURL(file);
      if (type === 'logo') setLabData({ ...labData, logo_url: objectUrl });
      if (type === 'owner') setLabData({ ...labData, owner_image: objectUrl });

      const uploadedUrl = await handleImageUpload(file, type);
      if (uploadedUrl) {
        // 🛑 FIX: prev parameter ko explicit type (LabData) de di
        if (type === 'logo') setLabData((prev: LabData) => ({ ...prev, logo_url: uploadedUrl }));
        if (type === 'owner') setLabData((prev: LabData) => ({ ...prev, owner_image: uploadedUrl }));
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!labData.name?.trim() || !labData.city?.trim() || !labData.phone_number?.trim()) {
      alert("Lab Name, City, and Phone Number are required!");
      return;
    }

    if (!userId) return;
    setIsSaving(true);

    try {
      await supabase.from('profiles').upsert({ id: userId, role: 'lab_admin' });
      
      let locationPoint = null;
      if (labData.latitude && labData.longitude) {
        locationPoint = `POINT(${labData.longitude} ${labData.latitude})`;
      }

      const dataToSave = {
        owner_id: userId,
        name: labData.name,
        city: labData.city,
        address: labData.address,
        experience_years: labData.experience_years === '' ? null : parseInt(String(labData.experience_years)),
        phone_number: labData.phone_number,
        speciality: labData.speciality,
        owner_name: labData.owner_name,
        logo_url: labData.logo_url,
        owner_image: labData.owner_image,
        location_pin: locationPoint,
        is_verified: true, 
      };

      const { error } = await supabase.from('labs').upsert(dataToSave, { onConflict: 'owner_id' });

      if (error) throw error;
      alert('Profile Saved Successfully! 🚀');
    } catch (err: unknown) { // 🛑 FIX: 'any' ki jagah 'unknown'
      if (err instanceof Error) {
        alert('Save Error: ' + err.message);
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-10 text-center text-gray-400">Loading Workspace...</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 md:p-12 font-sans text-gray-900">
      
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Lab Profile Center</h1>
        <p className="text-gray-500">Manage your laboratory&apos;s public identity, branding, and live location.</p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LEFT: Master Form Container */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSave}>
            
            {/* Component 1: Basic Info */}
            <BasicInfo labData={labData} setLabData={setLabData} />

            {/* Component 2: Location Picker */}
            <LocationPicker labData={labData} setLabData={setLabData} />
            
            {/* Branding & Images Container */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 mt-6">
              <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-purple-600" /> Branding & Images
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-xs font-bold text-gray-500 tracking-wider uppercase">Lab Logo (Max 4MB)</label>
                  <input type="file" ref={logoInputRef} onChange={(e) => onFileChange(e, 'logo')} accept="image/*" className="hidden" />
                  <button type="button" onClick={() => logoInputRef.current?.click()} className="relative w-full h-32 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-blue-500 hover:bg-blue-50 transition-all overflow-hidden bg-gray-50">
                    {/* 🛑 FIX: <img /> ko <Image /> se replace kiya aur required props diye */}
                    {labData.logo_url ? <Image src={labData.logo_url} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" alt="Logo" unoptimized /> : <><ImageIcon className="text-gray-400" /><span className="text-sm font-medium text-gray-500">Upload Logo</span></>}
                  </button>
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-bold text-gray-500 tracking-wider uppercase">Owner Photo (Max 4MB)</label>
                  <input type="file" ref={ownerInputRef} onChange={(e) => onFileChange(e, 'owner')} accept="image/*" className="hidden" />
                  <button type="button" onClick={() => ownerInputRef.current?.click()} className="relative w-full h-32 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-blue-500 hover:bg-blue-50 transition-all overflow-hidden bg-gray-50">
                     {/* 🛑 FIX: <img /> ko <Image /> se replace kiya */}
                    {labData.owner_image ? <Image src={labData.owner_image} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" alt="Owner" unoptimized /> : <><User className="text-gray-400" /><span className="text-sm font-medium text-gray-500">Upload Photo</span></>}
                  </button>
                </div>
              </div>
            </div>

            <button type="submit" disabled={isSaving} className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-70 mt-6">
              {isSaving ? 'Saving Profile...' : 'Save & Publish to App'} {!isSaving && <CheckCircle2 size={20} />}
            </button>
          </form>
        </div>

        {/* RIGHT: Live Mobile Preview */}
        <div className="lg:col-span-5 flex justify-center lg:sticky lg:top-10 h-fit">
          <div className="w-[320px] bg-gray-50 border-[8px] border-gray-900 rounded-[40px] shadow-2xl overflow-hidden relative h-[650px] flex flex-col">
            <div className="absolute top-0 inset-x-0 h-6 bg-gray-900 rounded-b-2xl mx-16 z-20"></div>
            
            <div className="pt-12 pb-4 px-5 bg-white flex justify-between items-center z-10 shadow-sm">
              <div className="w-24 h-4 bg-gray-200 rounded-full"></div>
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            </div>

            <div className="flex-1 p-5 overflow-y-auto">
              <div className="flex items-center gap-2 mb-6 text-gray-400">
                <Smartphone size={16} />
                <span className="text-xs font-bold uppercase tracking-widest">Live App Preview</span>
              </div>

              {/* LIST ITEM PREVIEW */}
              <div className="bg-white rounded-[20px] p-3 mb-6 flex-row items-center shadow-sm border border-gray-100 flex">
                 {/* 🛑 FIX: <img /> ko <Image /> se replace kiya, design ki wajah se isko relative container me dala */}
                 <div className="relative w-[84px] h-[84px] rounded-[16px] overflow-hidden bg-gray-50 shrink-0">
                    <Image 
                      src={labData.logo_url || 'https://via.placeholder.com/150'} 
                      fill
                      sizes="84px"
                      className="object-cover" 
                      alt="Logo"
                      unoptimized
                    />
                 </div>
                <div className="flex-1 ml-4 justify-center">
                  <div className="flex flex-row justify-between items-start">
                    <span className="text-[16px] font-bold text-gray-900 leading-tight pr-2 truncate">{labData.name || 'Your Lab Name'}</span>
                    <MoreVertical size={16} color="#9CA3AF" />
                  </div>
                  <span className="text-[12px] text-gray-500 mt-1 block truncate">{labData.speciality || 'Pathology & Radiology'}</span>
                  <div className="flex items-center mt-2.5">
                    <Star size={12} color="#F59E0B" fill="#F59E0B" />
                    <span className="text-[11px] text-gray-700 font-bold ml-1">New</span>
                    <span className="text-gray-300 mx-1.5 text-[10px]">●</span>
                    <MapPin size={11} color="#38BDF8" />
                    <span className="text-[11px] text-gray-500 ml-0.5 font-medium truncate">{labData.city || 'City'}</span>
                  </div>
                </div>
              </div>

              {/* DETAIL CARD PREVIEW */}
              <div className="bg-white rounded-[20px] p-5 shadow-sm border border-gray-100 mb-6">
                <h4 className="font-bold text-gray-900 mb-4 text-sm">Lab Administration</h4>
                <div className="flex items-center gap-4">
                   {/* 🛑 FIX: <img /> ko <Image /> se replace kiya */}
                  <div className="relative w-14 h-14 rounded-full bg-gray-100 border-2 border-white shadow-sm overflow-hidden shrink-0">
                    <Image 
                      src={labData.owner_image || 'https://via.placeholder.com/150'} 
                      fill
                      sizes="56px"
                      className="object-cover" 
                      alt="Owner"
                      unoptimized
                    />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{labData.owner_name || 'Owner Name'}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Lab Director / Admin</p>
                  </div>
                </div>
                
                <div className="mt-5 pt-4 border-t border-gray-100 space-y-3">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Phone size={14} className="text-blue-500" />
                    <span className="text-xs">{labData.phone_number || 'Phone Number'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Activity size={14} className="text-blue-500" />
                    <span className="text-xs">{labData.experience_years ? `${labData.experience_years} Years Experience` : 'Experience not set'}</span>
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