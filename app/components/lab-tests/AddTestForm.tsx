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

  // Helper to find exact matching master test OR create a new one with the EXACT name
  const resolveMasterTestId = async (inputTitle: string): Promise<string> => {
    const cleanTitle = inputTitle.trim();
    const cleanLower = cleanTitle.toLowerCase();

    // 1. Exact match in local masterTests list (case-insensitive)
    const exactLocal = masterTests.find(m => m.title.trim().toLowerCase() === cleanLower);
    if (exactLocal) return exactLocal.id;

    // 2. Exact match in Supabase master_tests table (case-insensitive)
    const { data: dbExact } = await supabase
      .from('master_tests')
      .select('id')
      .ilike('title', cleanTitle)
      .limit(1)
      .maybeSingle();

    if (dbExact?.id) return dbExact.id;

    // 3. User ne jo EXACT name likha ha, usi name se new master_test create karein (NO GUESSING / NO AUTO-REPLACE)
    const { data: newMaster, error: masterErr } = await supabase
      .from('master_tests')
      .insert({
        title: cleanTitle,
        about: 'Diagnostic laboratory medical test.',
        preparation: 'Please follow standard laboratory instructions.'
      })
      .select('id')
      .single();

    if (!masterErr && newMaster) {
      return newMaster.id;
    }

    if (masterErr) {
      console.error("Error creating master test:", masterErr);
      // Agar duplicate ya concurrency ki wajah se insert fail hua ho, dobara check karein
      const { data: retryMatch } = await supabase
        .from('master_tests')
        .select('id')
        .ilike('title', cleanTitle)
        .limit(1)
        .maybeSingle();

      if (retryMatch?.id) return retryMatch.id;

      throw new Error(`Test save nahi ho saka: ${masterErr.message || 'Unknown error'}`);
    }

    throw new Error("Test save karne mein masla aya.");
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
            list="available-master-tests"
            value={testName}
            onChange={(e) => setTestName(e.target.value)}
            placeholder="Enter Test Name (e.g. CBC, Lipid Profile, LFT, Blood Sugar)"
            className="w-full bg-white text-gray-900 placeholder-gray-400 border border-gray-300 rounded-xl px-4 py-3 sm:py-3.5 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
            autoComplete="off"
          />
          <datalist id="available-master-tests">
            {masterTests.map((m) => (
              <option key={m.id} value={m.title} />
            ))}
          </datalist>
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