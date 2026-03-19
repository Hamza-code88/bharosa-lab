"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import AddTestForm from '../../components/lab-tests/AddTestForm';
import TestList from '../../components/lab-tests/TestList';
// 🛑 FIX: Star icon yahan se bhi hata diya
import { Loader2, Info, MapPin, CheckCircle2, ShoppingCart, ArrowLeft, MoreHorizontal } from 'lucide-react';

export interface LabInfo {
  id: string;
  name: string;
  city: string;
  logo_url: string;
  rating: number | string;
}

export interface MasterTestItem {
  id: string;
  title: string;
  about?: string;
  preparation?: string;
}

export interface LabTestItem {
  id: string;
  price: number;
  turnaround_time: string;
  is_home_collection: boolean;
  master_tests: {
    title: string;
  };
}

export interface PreviewState {
  title: string;
  price: string | number;
  time: string;
  isHome: boolean;
  about: string;
  preparation: string;
}

export default function TestsManagerPage() {
  const [labInfo, setLabInfo] = useState<LabInfo | null>(null);
  const [masterTests, setMasterTests] = useState<MasterTestItem[]>([]);
  const [myTests, setMyTests] = useState<LabTestItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [preview, setPreview] = useState<PreviewState>({
    title: 'Select a Test Name',
    price: '0',
    time: '24 Hours',
    isHome: true,
    about: 'Test description will appear here.',
    preparation: 'Preparation details here.'
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const { data: lab } = await supabase
        .from('labs')
        .select('id, name, city, logo_url, rating')
        .eq('owner_id', session.user.id)
        .single();
        
      if (!lab) { setIsLoading(false); return; }
      setLabInfo(lab as LabInfo);

      const { data: mTests } = await supabase.from('master_tests').select('*').order('title');
      if (mTests) setMasterTests(mTests as MasterTestItem[]);

      const { data: lTests } = await supabase
        .from('lab_tests')
        .select(`id, price, turnaround_time, is_home_collection, master_tests ( title )`)
        .eq('lab_id', lab.id)
        .order('created_at', { ascending: false });
        
      if (lTests) setMyTests(lTests as unknown as LabTestItem[]); 
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  if (isLoading) return <div className="flex justify-center items-center h-[60vh]"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>;
  if (!labInfo) return <div className="text-center mt-20 text-red-500 font-bold px-4">Please setup Lab Profile first!</div>;

  return (
    <div className="max-w-[1400px] mx-auto pb-12 px-4 sm:p-6 font-sans">
      <div className="mb-6 sm:mb-8 text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Test Catalog Manager</h1>
        <p className="text-gray-500 mt-2 text-sm sm:text-base">Add tests from master list, set your prices, and see exactly how they look on the patient&apos;s mobile app.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Left Side: Logic (Form + TestList) */}
        <div className="xl:col-span-8 space-y-6 sm:space-y-8 order-2 xl:order-1">
          <AddTestForm 
            labId={labInfo.id} 
            masterTests={masterTests} 
            onTestAdded={loadData} 
            onPreviewChange={(data) => setPreview(data as PreviewState)} 
          />
          <TestList 
            tests={myTests} 
            onTestDeleted={loadData} 
          />
        </div>

        {/* Right Side: LIVE MOBILE PREVIEW */}
        <div className="xl:col-span-4 flex justify-center xl:sticky xl:top-10 h-fit order-1 xl:order-2 mb-8 xl:mb-0">
          <div className="w-[320px] sm:w-[340px] bg-white border-[6px] sm:border-[8px] border-gray-900 rounded-[40px] sm:rounded-[45px] shadow-2xl overflow-hidden relative h-[650px] sm:h-[700px] flex flex-col transform origin-top scale-[0.95] sm:scale-100">
            <div className="absolute top-0 inset-x-0 h-5 sm:h-6 bg-gray-900 rounded-b-2xl mx-16 sm:mx-20 z-20"></div>

            <div className="flex-1 overflow-y-auto pb-24 relative bg-gray-50 custom-scrollbar">
              <div className="w-full h-48 sm:h-56 relative bg-blue-900">
                <Image 
                  src="https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=1000&auto=format&fit=crop" 
                  fill
                  sizes="(max-width: 640px) 320px, 340px"
                  className="object-cover opacity-60" 
                  alt="Medical" 
                  unoptimized
                />
                <div className="absolute top-10 sm:top-12 w-full flex justify-between px-4 sm:px-5">
                  <div className="bg-white/20 p-2 rounded-full backdrop-blur-md"><ArrowLeft size={18} color="#fff" /></div>
                  <div className="bg-white/20 p-2 rounded-full backdrop-blur-md"><MoreHorizontal size={18} color="#fff" /></div>
                </div>
              </div>

              <div className="bg-white rounded-t-[25px] sm:rounded-t-[30px] -mt-5 sm:-mt-6 px-4 sm:px-5 pt-5 sm:pt-6 min-h-screen relative z-10">
                
                <div className="flex justify-between items-start mb-4 sm:mb-5">
                  <div className="flex-1 pr-2">
                    <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 leading-tight mb-1">{preview.title}</h2>
                    <p className="text-xs sm:text-sm text-gray-500 font-medium">Medical Test</p>
                  </div>
                  {/* 🛑 FIX: Stars udaye */}
                </div>

                <div className="flex gap-2 sm:gap-3 mb-5 sm:mb-6">
                  <div className="flex-1 bg-blue-600 rounded-2xl p-2.5 sm:p-3 text-center shadow-lg shadow-blue-500/30">
                    <p className="text-blue-100 font-medium text-[10px] sm:text-xs mb-0.5 sm:mb-1">Available in</p>
                    <p className="text-white font-extrabold text-base sm:text-lg">1 Labs</p>
                  </div>
                  <div className="flex-1 bg-orange-500 rounded-2xl p-2.5 sm:p-3 text-center shadow-lg shadow-orange-500/30">
                    <p className="text-orange-100 font-medium text-[10px] sm:text-xs mb-0.5 sm:mb-1">Starting Price</p>
                    <p className="text-white font-extrabold text-base sm:text-lg">Rs. {preview.price || '0'}</p>
                  </div>
                </div>

                <h3 className="text-base sm:text-lg font-extrabold text-gray-900 mb-2">About Test</h3>
                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-5">{preview.about}</p>

                <div className="bg-blue-50 p-2.5 sm:p-3 rounded-xl mb-5 sm:mb-6 flex items-start gap-2.5 sm:gap-3 border border-blue-100">
                  <Info size={16} className="text-blue-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-bold text-blue-900 text-xs sm:text-sm mb-0.5">Preparation</p>
                    <p className="text-blue-800/80 text-[10px] sm:text-xs">{preview.preparation}</p>
                  </div>
                </div>

                <h3 className="text-base sm:text-lg font-extrabold text-gray-900 mb-2 sm:mb-3">Select a Lab</h3>
                
                <div className="border-2 border-blue-600 bg-blue-50/50 rounded-2xl p-3 sm:p-3.5 relative overflow-hidden mb-4 cursor-pointer">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden border border-gray-200 bg-white shrink-0">
                      <Image 
                        src={labInfo?.logo_url || 'https://via.placeholder.com/150'} 
                        fill
                        sizes="48px"
                        className="object-cover" 
                        alt="Lab" 
                        unoptimized
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 text-[13px] sm:text-[15px]">{labInfo?.name || 'Your Lab Name'}</h4>
                      <div className="flex items-center gap-1.5 mt-0.5 text-[10px] sm:text-xs text-gray-500 flex-wrap">
                        {/* 🛑 FIX: Yahan se bhi stars udaye */}
                        <MapPin size={10} /> <span className="truncate max-w-[120px] sm:max-w-[150px]">{labInfo?.city || 'City'}</span>
                      </div>
                      <p className="text-blue-600 font-bold mt-1 sm:mt-1.5 text-xs sm:text-sm">Rs. {preview.price || '0'}</p>
                      <p className="text-[9px] sm:text-[10px] text-gray-500 mt-0.5">Report: {preview.time || '24 Hrs'}</p>
                    </div>
                    <CheckCircle2 size={20} className="text-blue-600 fill-blue-100 sm:w-6 sm:h-6" />
                  </div>
                </div>

              </div>
            </div>

            <div className="absolute bottom-0 inset-x-0 bg-white px-4 sm:px-5 py-3 sm:py-4 border-t border-gray-100 flex items-center justify-between z-30 shadow-[0_-10px_30px_rgba(0,0,0,0.08)]">
              <div>
                <p className="text-gray-500 text-[10px] sm:text-xs font-medium">Total Price</p>
                <p className="text-lg sm:text-xl font-extrabold text-blue-600">Rs. {preview.price || '0'}</p>
              </div>
              <div className="bg-blue-600 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl flex items-center gap-1.5 sm:gap-2 shadow-lg shadow-blue-500/40">
                <ShoppingCart size={14} color="#fff" className="sm:w-4 sm:h-4" />
                <span className="text-white font-bold text-xs sm:text-sm">ADD TO CART</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}