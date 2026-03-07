"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image'; // 🛑 NAYA: Next.js Image import
import { supabase } from '@/lib/supabase';
import AddTestForm from '../../components/lab-tests/AddTestForm';
import TestList from '../../components/lab-tests/TestList';
import { Loader2, Star, Info, MapPin, CheckCircle2, ShoppingCart, ArrowLeft, MoreHorizontal } from 'lucide-react';

// 🛑 NAYA: Interfaces taake 'any' se jaan chootay
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
  // 🛑 FIX: 'any' hata kar proper interfaces lagaye
  const [labInfo, setLabInfo] = useState<LabInfo | null>(null);
  const [masterTests, setMasterTests] = useState<MasterTestItem[]>([]);
  const [myTests, setMyTests] = useState<LabTestItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Live Preview State
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
        
      if (lTests) setMyTests(lTests as unknown as LabTestItem[]); // Supabase nested relation types ko handle karne ke liye
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  if (isLoading) return <div className="flex justify-center items-center h-[60vh]"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>;
  if (!labInfo) return <div className="text-center mt-20 text-red-500 font-bold">Please setup Lab Profile first!</div>;

  return (
    <div className="max-w-[1400px] mx-auto pb-12 p-6 font-sans">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Test Catalog Manager</h1>
        <p className="text-gray-500 mt-2 text-base">Add tests from master list, set your prices, and see exactly how they look on the patient's mobile app.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Left Side: Logic (Form + TestList) */}
        <div className="xl:col-span-8 space-y-8">
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
        <div className="xl:col-span-4 flex justify-center lg:sticky lg:top-10 h-fit">
          <div className="w-[340px] bg-white border-[8px] border-gray-900 rounded-[45px] shadow-2xl overflow-hidden relative h-[700px] flex flex-col">
            <div className="absolute top-0 inset-x-0 h-6 bg-gray-900 rounded-b-2xl mx-20 z-20"></div>

            <div className="flex-1 overflow-y-auto pb-24 relative bg-gray-50">
              <div className="w-full h-56 relative bg-blue-900">
                {/* 🛑 FIX: img ko Next/Image me convert kiya */}
                <Image 
                  src="https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=1000&auto=format&fit=crop" 
                  fill
                  sizes="340px"
                  className="object-cover opacity-60" 
                  alt="Medical" 
                  unoptimized
                />
                <div className="absolute top-12 w-full flex justify-between px-5">
                  <div className="bg-white/20 p-2 rounded-full backdrop-blur-md"><ArrowLeft size={20} color="#fff" /></div>
                  <div className="bg-white/20 p-2 rounded-full backdrop-blur-md"><MoreHorizontal size={20} color="#fff" /></div>
                </div>
              </div>

              <div className="bg-white rounded-t-[30px] -mt-6 px-5 pt-6 min-h-screen relative z-10">
                
                <div className="flex justify-between items-start mb-5">
                  <div className="flex-1 pr-2">
                    <h2 className="text-xl font-extrabold text-gray-900 leading-tight mb-1">{preview.title}</h2>
                    <p className="text-sm text-gray-500 font-medium">Medical Test</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <Star size={20} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-gray-900 font-bold mt-1 text-sm">4.8</span>
                  </div>
                </div>

                <div className="flex gap-3 mb-6">
                  <div className="flex-1 bg-blue-600 rounded-2xl p-3 text-center shadow-lg shadow-blue-500/30">
                    <p className="text-blue-100 font-medium text-xs mb-1">Available in</p>
                    <p className="text-white font-extrabold text-lg">1 Labs</p>
                  </div>
                  <div className="flex-1 bg-orange-500 rounded-2xl p-3 text-center shadow-lg shadow-orange-500/30">
                    <p className="text-orange-100 font-medium text-xs mb-1">Starting Price</p>
                    <p className="text-white font-extrabold text-lg">Rs. {preview.price || '0'}</p>
                  </div>
                </div>

                <h3 className="text-lg font-extrabold text-gray-900 mb-2">About Test</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-5">{preview.about}</p>

                <div className="bg-blue-50 p-3 rounded-xl mb-6 flex items-start gap-3 border border-blue-100">
                  <Info size={18} className="text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-bold text-blue-900 text-sm mb-0.5">Preparation</p>
                    <p className="text-blue-800/80 text-xs">{preview.preparation}</p>
                  </div>
                </div>

                <h3 className="text-lg font-extrabold text-gray-900 mb-3">Select a Lab</h3>
                
                <div className="border-2 border-blue-600 bg-blue-50/50 rounded-2xl p-3.5 relative overflow-hidden mb-4 cursor-pointer">
                  <div className="flex items-center gap-3">
                    {/* 🛑 FIX: img ko Next/Image me convert kiya aur proper container banaya */}
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-gray-200 bg-white shrink-0">
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
                      <h4 className="font-bold text-gray-900 text-[15px]">{labInfo?.name || 'Your Lab Name'}</h4>
                      <div className="flex items-center gap-1.5 mt-0.5 text-xs text-gray-500">
                        <Star size={10} className="text-yellow-500 fill-yellow-500" /> <span className="font-medium">{labInfo?.rating || '4.5'}</span>
                        <span>•</span> <MapPin size={10} /> <span>{labInfo?.city || 'City'}</span>
                      </div>
                      <p className="text-blue-600 font-bold mt-1.5 text-sm">Rs. {preview.price || '0'}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">Report: {preview.time || '24 Hrs'}</p>
                    </div>
                    <CheckCircle2 size={24} className="text-blue-600 fill-blue-100" />
                  </div>
                </div>

              </div>
            </div>

            <div className="absolute bottom-0 inset-x-0 bg-white px-5 py-4 border-t border-gray-100 flex items-center justify-between z-30 shadow-[0_-10px_30px_rgba(0,0,0,0.08)]">
              <div>
                <p className="text-gray-500 text-xs font-medium">Total Price</p>
                <p className="text-xl font-extrabold text-blue-600">Rs. {preview.price || '0'}</p>
              </div>
              <div className="bg-blue-600 px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-blue-500/40">
                <ShoppingCart size={16} color="#fff" />
                <span className="text-white font-bold text-sm">ADD TO CART</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}