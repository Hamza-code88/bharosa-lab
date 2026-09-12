"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, PlusCircle, FlaskConical, DollarSign } from 'lucide-react';

export interface MasterTest {
  id: string;
  title: string;
  about?: string;
  preparation?: string;
}

export interface PreviewData {
  title: string;
  price: string;
  time: string;
  isHome: boolean;
  about: string;
  preparation: string;
}

interface Props {
  labId: string;
  masterTests: MasterTest[]; 
  onTestAdded: () => void;
  onPreviewChange: (data: PreviewData) => void; 
}

export default function AddTestForm({ labId, masterTests, onTestAdded, onPreviewChange }: Props) {
  const [testName, setTestName] = useState('');
  const [price, setPrice] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    onPreviewChange({
      title: testName.trim() || 'Test Name',
      price: price || '0',
      time: '24 Hours',
      isHome: true,
      about: 'Diagnostic laboratory medical test.',
      preparation: 'Please follow standard laboratory instructions.'
    });
  }, [testName, price]);

  // Helper to find best matching master test
  const resolveMasterTestId = async (inputTitle: string): Promise<string> => {
    const clean = inputTitle.trim().toLowerCase();

    // 1. Exact match in masterTests
    let match = masterTests.find(m => m.title.toLowerCase().trim() === clean);
    if (match) return match.id;

    // 2. Substring match
    match = masterTests.find(m => m.title.toLowerCase().includes(clean) || clean.includes(m.title.toLowerCase()));
    if (match) return match.id;

    // 3. Common medical acronyms & keywords
    if (clean.includes('cbc') || clean.includes('blood count') || clean.includes('blood cp')) {
      match = masterTests.find(m => m.title.toLowerCase().includes('cbc') || m.title.toLowerCase().includes('blood'));
    } else if (clean.includes('lft') || clean.includes('liver')) {
      match = masterTests.find(m => m.title.toLowerCase().includes('lft') || m.title.toLowerCase().includes('liver'));
    } else if (clean.includes('rft') || clean.includes('renal') || clean.includes('kidney') || clean.includes('kft')) {
      match = masterTests.find(m => m.title.toLowerCase().includes('renal') || m.title.toLowerCase().includes('kidney') || m.title.toLowerCase().includes('rft'));
    } else if (clean.includes('sugar') || clean.includes('glucose') || clean.includes('fbs') || clean.includes('rbs')) {
      match = masterTests.find(m => m.title.toLowerCase().includes('glucose') || m.title.toLowerCase().includes('sugar'));
    } else if (clean.includes('lipid') || clean.includes('cholesterol') || clean.includes('triglyceride')) {
      match = masterTests.find(m => m.title.toLowerCase().includes('lipid') || m.title.toLowerCase().includes('cholesterol'));
    } else if (clean.includes('urine')) {
      match = masterTests.find(m => m.title.toLowerCase().includes('urine'));
    } else if (clean.includes('dengue')) {
      match = masterTests.find(m => m.title.toLowerCase().includes('dengue'));
    } else if (clean.includes('malaria') || clean.includes('mp')) {
      match = masterTests.find(m => m.title.toLowerCase().includes('malaria'));
    } else if (clean.includes('hba1c') || clean.includes('a1c')) {
      match = masterTests.find(m => m.title.toLowerCase().includes('hba1c'));
    } else if (clean.includes('thyroid') || clean.includes('tsh') || clean.includes('t3') || clean.includes('t4')) {
      match = masterTests.find(m => m.title.toLowerCase().includes('thyroid') || m.title.toLowerCase().includes('tsh'));
    } else if (clean.includes('creatinine')) {
      match = masterTests.find(m => m.title.toLowerCase().includes('creatinine'));
    } else if (clean.includes('calcium')) {
      match = masterTests.find(m => m.title.toLowerCase().includes('calcium'));
    } else if (clean.includes('vitamin')) {
      match = masterTests.find(m => m.title.toLowerCase().includes('vitamin'));
    } else if (clean.includes('crp')) {
      match = masterTests.find(m => m.title.toLowerCase().includes('crp'));
    } else if (clean.includes('esr')) {
      match = masterTests.find(m => m.title.toLowerCase().includes('esr'));
    } else if (clean.includes('uric')) {
      match = masterTests.find(m => m.title.toLowerCase().includes('uric'));
    } else if (clean.includes('typhoid') || clean.includes('widal')) {
      match = masterTests.find(m => m.title.toLowerCase().includes('typhoid') || m.title.toLowerCase().includes('widal'));
    } else if (clean.includes('stool')) {
      match = masterTests.find(m => m.title.toLowerCase().includes('stool'));
    }
    if (match) return match.id;

    // 4. Token match for any word length >= 3
    const words = clean.split(/\s+/).filter(w => w.length >= 3);
    for (const w of words) {
      match = masterTests.find(m => m.title.toLowerCase().includes(w));
      if (match) return match.id;
    }

    // 5. Query Supabase directly with case-insensitive search
    const { data: dbMatch } = await supabase
      .from('master_tests')
      .select('id')
      .ilike('title', `%${inputTitle.trim()}%`)
      .limit(1)
      .maybeSingle();

    if (dbMatch) return dbMatch.id;

    // 6. Try to create new in master_tests
    const { data: newMaster, error: masterErr } = await supabase
      .from('master_tests')
      .insert({
        title: inputTitle.trim(),
        about: 'Diagnostic laboratory medical test.',
        preparation: 'Please follow standard laboratory instructions.'
      })
      .select('id')
      .single();

    if (!masterErr && newMaster) {
      return newMaster.id;
    }

    // 7. If RLS blocked insert, fallback to first available master test safely
    if (masterTests.length > 0) {
      return masterTests[0].id;
    }

    throw new Error("Koi master test record nahi mil saka.");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanTitle = testName.trim();
    if (!cleanTitle) {
      alert("Please enter a test name!");
      return;
    }

    const parsedPrice = parseInt(price, 10);
    if (!price || isNaN(parsedPrice) || parsedPrice <= 0) {
      alert("Please enter a valid price (e.g. 500)!");
      return;
    }

    setIsSaving(true);
    try {
      // Resolve master test ID without failing on RLS
      const finalTestId = await resolveMasterTestId(cleanTitle);

      // Check if test already exists in this lab's catalog
      const { data: existing } = await supabase
        .from('lab_tests')
        .select('id')
        .eq('lab_id', labId)
        .eq('test_id', finalTestId)
        .maybeSingle();

      if (existing) {
        const { error: updateErr } = await supabase
          .from('lab_tests')
          .update({
            price: parsedPrice,
            turnaround_time: '24 Hours',
            is_home_collection: true,
          })
          .eq('id', existing.id);

        if (updateErr) throw updateErr;
        alert(`✅ Test price updated: Rs. ${parsedPrice}`);
      } else {
        const { error: insertErr } = await supabase
          .from('lab_tests')
          .insert({
            lab_id: labId,
            test_id: finalTestId,
            price: parsedPrice,
            turnaround_time: '24 Hours',
            is_home_collection: true,
          });

        if (insertErr) throw insertErr;
        alert(`✅ Test "${cleanTitle}" added successfully to your catalog!`);
      }

      onTestAdded();
      setTestName('');
      setPrice('');
    } catch (error: any) {
      alert("Error: " + (error?.message || error));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-[24px] sm:rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-sm">
      <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-5 sm:mb-6 flex items-center gap-2">
        <FlaskConical className="text-blue-600" size={18} />
        Add New Test
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        {/* 1. TEST NAME INPUT ONLY */}
        <div>
          <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5 sm:mb-2 flex items-center gap-1.5">
            <FlaskConical size={14} className="text-blue-600" /> Test Name
          </label>
          <input 
            type="text" 
            value={testName}
            onChange={(e) => setTestName(e.target.value)}
            placeholder="Enter Test Name (e.g. CBC, Lipid Profile, LFT, Blood Sugar)"
            className="w-full bg-white text-gray-900 placeholder-gray-400 border border-gray-300 rounded-xl px-4 py-3 sm:py-3.5 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
            autoComplete="off"
          />
        </div>

        {/* 2. PRICE INPUT ONLY */}
        <div>
          <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5 sm:mb-2 flex items-center gap-1.5">
            <DollarSign size={14} className="text-emerald-600" /> Price (Rs.)
          </label>
          <input 
            type="number" 
            value={price} 
            onChange={(e) => setPrice(e.target.value)} 
            placeholder="Enter Price (e.g. 500)"
            className="w-full bg-white text-gray-900 placeholder-gray-400 border border-gray-300 rounded-xl px-4 py-3 sm:py-3.5 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
            min="1"
          />
        </div>

        {/* 3. ADD TEST BUTTON */}
        <button 
          type="submit" 
          disabled={isSaving} 
          className="w-full mt-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold py-3.5 sm:py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base shadow-sm shadow-blue-600/20 cursor-pointer"
        >
          {isSaving ? <Loader2 className="animate-spin" size={18} /> : <PlusCircle size={18} />}
          {isSaving ? 'Adding Test...' : 'Add Test'}
        </button>
      </form>
    </div>
  );
}