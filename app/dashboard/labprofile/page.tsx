'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image'; 
import { supabase } from '@/lib/supabase';
import { Smartphone, Image as ImageIcon, MapPin, Phone, User, Activity, CheckCircle2, Star, MoreVertical } from 'lucide-react';

import BasicInfo, { LabData } from '../../components/labprofile/BasicInfo'; 
import LocationPicker from '../../components/labprofile/LocationPicker';

export default function PremiumLabProfile() {
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
          const finalLat = dbData.lat ? String(dbData.lat) : lat;
          const finalLng = dbData.lng ? String(dbData.lng) : lng;

          setLabData({ ...dbData, latitude: finalLat, longitude: finalLng });
        }
      }
    } catch (err: unknown) { 
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
        lat: labData.latitude ? parseFloat(String(labData.latitude)) : null,
        lng: labData.longitude ? parseFloat(String(labData.longitude)) : null,
      };

      const { error } = await supabase.from('labs').upsert(dataToSave, { onConflict: 'owner_id' });

      if (error) throw error;
      alert('Profile Saved Successfully! 🚀');
    } catch (err: unknown) { 
      if (err instanceof Error) {
        alert('Save Error: ' + err.message);
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-10 text-center text-gray-400">Loading Workspace...</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 sm:p-6 md:p-12 font-sans text-gray-900">
      
      <div className="max-w-7xl mx-auto mb-6 sm:mb-8 text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-1 sm:mb-2">Lab Profile Center</h1>
        <p className="text-sm sm:text-base text-gray-500">Manage your laboratory&apos;s public identity, branding, and live location.</p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        
        {/* LEFT: Master Form Container */}
        <div className="lg:col-span-7 space-y-6 order-2 lg:order-1">
          <form onSubmit={handleSave}>
            
            {/* Component 1: Basic Info */}
            <BasicInfo labData={labData} setLabData={setLabData} />

            {/* Component 2: Location Picker */}
            <LocationPicker labData={labData} setLabData={setLabData} />
            
            {/* Branding & Images Container */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-8 mt-6">
              <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-5 sm:mb-6 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-purple-600" /> Branding & Images
              </h2>
              {/* 🛑 FIX: Mobile par grid-cols-1, laptop par grid-cols-2 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] sm:text-xs font-bold text-gray-500 tracking-wider uppercase">Lab Logo (Max 4MB)</label>
                  <input type="file" ref={logoInputRef} onChange={(e) => onFileChange(e, 'logo')} accept="image/*" className="hidden" />
                  <button type="button" onClick={() => logoInputRef.current?.click()} className="relative w-full h-32 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-blue-500 hover:bg-blue-50 transition-all overflow-hidden bg-gray-50">
                    {labData.logo_url ? <Image src={labData.logo_url} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" alt="Logo" unoptimized /> : <><ImageIcon className="text-gray-400" /><span className="text-xs sm:text-sm font-medium text-gray-500">Upload Logo</span></>}
                  </button>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] sm:text-xs font-bold text-gray-500 tracking-wider uppercase">Owner Photo (Max 4MB)</label>
                  <input type="file" ref={ownerInputRef} onChange={(e) => onFileChange(e, 'owner')} accept="image/*" className="hidden" />
                  <button type="button" onClick={() => ownerInputRef.current?.click()} className="relative w-full h-32 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-blue-500 hover:bg-blue-50 transition-all overflow-hidden bg-gray-50">
                    {labData.owner_image ? <Image src={labData.owner_image} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" alt="Owner" unoptimized /> : <><User className="text-gray-400" /><span className="text-xs sm:text-sm font-medium text-gray-500">Upload Photo</span></>}
                  </button>
                </div>
              </div>
            </div>

            <button type="submit" disabled={isSaving} className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-70 mt-6 shadow-sm shadow-blue-600/30">
              {isSaving ? 'Saving Profile...' : 'Save & Publish to App'} {!isSaving && <CheckCircle2 size={20} />}
            </button>
          </form>
        </div>

        {/* RIGHT: Live Mobile Preview */}
        <div className="lg:col-span-5 flex justify-center lg:sticky lg:top-10 h-fit order-1 lg:order-2 mb-4 lg:mb-0">
          {/* 🛑 FIX: scale down on very small screens so it doesn't overflow */}
          <div className="w-[300px] sm:w-[320px] bg-gray-50 border-[6px] sm:border-[8px] border-gray-900 rounded-[35px] sm:rounded-[40px] shadow-2xl overflow-hidden relative h-[600px] sm:h-[650px] flex flex-col transform origin-top scale-[0.95] sm:scale-100">
            <div className="absolute top-0 inset-x-0 h-5 sm:h-6 bg-gray-900 rounded-b-xl sm:rounded-b-2xl mx-14 sm:mx-16 z-20"></div>
            
            <div className="pt-10 sm:pt-12 pb-3 sm:pb-4 px-4 sm:px-5 bg-white flex justify-between items-center z-10 shadow-sm">
              <div className="w-20 sm:w-24 h-3 sm:h-4 bg-gray-200 rounded-full"></div>
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-200 rounded-full"></div>
            </div>

            <div className="flex-1 p-4 sm:p-5 overflow-y-auto custom-scrollbar">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-5 sm:mb-6 text-gray-400">
                <Smartphone size={14} className="sm:w-[16px] sm:h-[16px]" />
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest">Live App Preview</span>
              </div>

              {/* LIST ITEM PREVIEW */}
              <div className="bg-white rounded-[16px] sm:rounded-[20px] p-2.5 sm:p-3 mb-5 sm:mb-6 flex-row items-center shadow-sm border border-gray-100 flex">
                 <div className="relative w-[70px] h-[70px] sm:w-[84px] sm:h-[84px] rounded-[12px] sm:rounded-[16px] overflow-hidden bg-gray-50 shrink-0">
                    <Image 
                      src={labData.logo_url || 'https://via.placeholder.com/150'} 
                      fill
                      sizes="84px"
                      className="object-cover" 
                      alt="Logo"
                      unoptimized
                    />
                 </div>
                <div className="flex-1 ml-3 sm:ml-4 justify-center">
                  <div className="flex flex-row justify-between items-start">
                    <span className="text-[14px] sm:text-[16px] font-bold text-gray-900 leading-tight pr-2 truncate max-w-[130px] sm:max-w-[150px]">{labData.name || 'Your Lab Name'}</span>
                    <MoreVertical size={14} color="#9CA3AF" className="sm:w-[16px] sm:h-[16px]" />
                  </div>
                  <span className="text-[10px] sm:text-[12px] text-gray-500 mt-0.5 sm:mt-1 block truncate">{labData.speciality || 'Pathology & Radiology'}</span>
                  <div className="flex items-center mt-2 sm:mt-2.5 flex-wrap gap-y-1">
                    <Star size={10} color="#F59E0B" fill="#F59E0B" className="sm:w-[12px] sm:h-[12px]" />
                    <span className="text-[9px] sm:text-[11px] text-gray-700 font-bold ml-1">New</span>
                    <span className="text-gray-300 mx-1 sm:mx-1.5 text-[8px] sm:text-[10px]">●</span>
                    <MapPin size={9} color="#38BDF8" className="sm:w-[11px] sm:h-[11px]" />
                    <span className="text-[9px] sm:text-[11px] text-gray-500 ml-0.5 font-medium truncate max-w-[70px]">{labData.city || 'City'}</span>
                  </div>
                </div>
              </div>

              {/* DETAIL CARD PREVIEW */}
              <div className="bg-white rounded-[16px] sm:rounded-[20px] p-4 sm:p-5 shadow-sm border border-gray-100 mb-6">
                <h4 className="font-bold text-gray-900 mb-3 sm:mb-4 text-xs sm:text-sm">Lab Administration</h4>
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-100 border-2 border-white shadow-sm overflow-hidden shrink-0">
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
                    <p className="font-bold text-gray-900 text-xs sm:text-sm truncate max-w-[120px]">{labData.owner_name || 'Owner Name'}</p>
                    <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">Lab Director / Admin</p>
                  </div>
                </div>
                
                <div className="mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-gray-100 space-y-2 sm:space-y-3">
                  <div className="flex items-center gap-2 sm:gap-3 text-gray-600">
                    <Phone size={12} className="text-blue-500 sm:w-[14px] sm:h-[14px]" />
                    <span className="text-[10px] sm:text-xs truncate">{labData.phone_number || 'Phone Number'}</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 text-gray-600">
                    <Activity size={12} className="text-blue-500 sm:w-[14px] sm:h-[14px]" />
                    <span className="text-[10px] sm:text-xs truncate">{labData.experience_years ? `${labData.experience_years} Years Experience` : 'Experience not set'}</span>
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