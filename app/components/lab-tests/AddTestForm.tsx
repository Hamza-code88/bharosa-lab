"use client";
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, PlusCircle, FlaskConical, Clock, DollarSign, Search } from 'lucide-react';

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
  const [selectedTestId, setSelectedTestId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const [price, setPrice] = useState('');
  const [time, setTime] = useState('');
  const [isHome, setIsHome] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredTests = masterTests.filter((t: MasterTest) => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const selectedTest = masterTests.find((t: MasterTest) => t.id === selectedTestId);
    
    onPreviewChange({
      title: selectedTest ? selectedTest.title : (searchQuery || 'Type to search test'),
      price: price || '0',
      time: time || 'e.g. 30 Mins',
      isHome: isHome,
      about: selectedTest?.about || 'Test description will appear here.',
      preparation: selectedTest?.preparation || 'Preparation details here.'
    });
    // 🛑 FIX: Infinite loop yahan se khatam kiya hai! 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTestId, searchQuery, price, time, isHome, masterTests]);

  const handleSelectTest = (test: MasterTest) => {
    setSelectedTestId(test.id);
    setSearchQuery(test.title);
    setIsDropdownOpen(false);
  };

  const handleAddCustomTest = async () => {
    if (!searchQuery.trim()) return;
    setIsSaving(true);
    try {
      const { data, error } = await supabase
        .from('master_tests')
        .insert({
          title: searchQuery.trim(),
          about: 'Custom test added manually.',
          preparation: 'Please follow standard lab instructions.'
        })
        .select()
        .single();

      if (error) throw error;
      
      alert("New Test Added to Master List!");
      handleSelectTest(data as MasterTest); 
      onTestAdded(); 
    } catch (error: unknown) { 
      if (error instanceof Error) {
        alert('Error creating custom test: ' + error.message);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTestId || !price || !time) {
      alert("Please fill all the details (Test, Price, and Time)!");
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase.from('lab_tests').insert({
        lab_id: labId,
        test_id: selectedTestId, 
        price: parseInt(price),
        turnaround_time: time,
        is_home_collection: isHome
      });

      if (error) throw error;
      
      alert("Test Added Successfully!");
      onTestAdded(); 
      
      setSelectedTestId('');
      setSearchQuery('');
      setPrice('');
      setTime(''); 
    } catch (error: unknown) { 
      if (error instanceof Error) {
        alert('Error: ' + error.message);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-[24px] sm:rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-sm">
      <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-5 sm:mb-6 flex items-center gap-2">
        <FlaskConical className="text-blue-600" size={18} />
        Add New Test to Catalog
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        
        {/* SEARCHABLE DROPDOWN AREA */}
        <div className="relative" ref={dropdownRef}>
          <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5 sm:mb-2">Search or Type New Test</label>
          <div className="relative">
            <Search size={18} className="absolute left-3.5 top-[14px] text-gray-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsDropdownOpen(true);
                setSelectedTestId(''); 
              }}
              onFocus={() => setIsDropdownOpen(true)}
              placeholder="e.g. CBC, Dengue..."
              className="w-full bg-white text-gray-900 placeholder-gray-400 border border-gray-300 rounded-xl pl-10 pr-4 py-3 sm:py-3.5 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          {isDropdownOpen && (
            <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
              {filteredTests.length > 0 ? (
                filteredTests.map((test: MasterTest) => ( 
                  <div 
                    key={test.id} 
                    onClick={() => handleSelectTest(test)} 
                    className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-0"
                  >
                    <p className="font-bold text-gray-900 text-sm">{test.title}</p>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center">
                  <p className="text-gray-500 text-sm mb-3">No test found with this name.</p>
                  <button 
                    type="button" 
                    onClick={handleAddCustomTest}
                    disabled={isSaving}
                    className="bg-blue-100 text-blue-700 font-bold px-4 py-2 rounded-lg text-sm hover:bg-blue-200 transition-colors w-full sm:w-auto"
                  >
                    + Add &quot;{searchQuery}&quot; as New Test
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5 sm:mb-2 flex items-center gap-1">
              <DollarSign size={14} /> Price (Rs.)
            </label>
            <input 
              type="number" 
              value={price} 
              onChange={(e) => setPrice(e.target.value)} 
              placeholder="e.g. 500"
              className="w-full bg-white text-gray-900 placeholder-gray-400 border border-gray-300 rounded-xl px-4 py-3 sm:py-3.5 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>
          
          <div>
            <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5 sm:mb-2 flex items-center gap-1">
              <Clock size={14} /> Report Time
            </label>
            <input 
              type="text" 
              value={time} 
              onChange={(e) => setTime(e.target.value)}
              placeholder="e.g. 30 Mins, 2 Hours"
              className="w-full bg-white text-gray-900 placeholder-gray-400 border border-gray-300 rounded-xl px-4 py-3 sm:py-3.5 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>
        </div>

        <div className="flex items-center gap-3 bg-blue-50/50 border border-blue-100 p-3.5 sm:p-4 rounded-xl mt-2">
          <input 
            type="checkbox" 
            id="homeCollection"
            checked={isHome}
            onChange={(e) => setIsHome(e.target.checked)}
            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 shrink-0" 
          />
          <label htmlFor="homeCollection" className="font-medium text-sm sm:text-base text-blue-900 cursor-pointer">
            Offer Home Sample Collection
          </label>
        </div>

        <button 
          type="submit" 
          disabled={isSaving || !selectedTestId} 
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 sm:py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed text-sm sm:text-base shadow-sm shadow-blue-600/20"
        >
          {isSaving ? <Loader2 className="animate-spin" size={18} /> : <PlusCircle size={18} />}
          {isSaving ? 'Adding...' : 'Add Test'}
        </button>
      </form>
    </div>
  );
}