"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, Save, CheckCircle2, FlaskConical } from 'lucide-react';
import { MasterTestItem, LabTestItem } from '../../dashboard/tests/page';

interface Props {
  labId: string;
  masterTests: MasterTestItem[];
  myTests: LabTestItem[];
  onTestsUpdated: () => void;
}

export default function BulkAddTestForm({ labId, masterTests, myTests, onTestsUpdated }: Props) {
  const [testPrices, setTestPrices] = useState<{ [key: string]: string }>({});
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Initialize inputs with existing prices
  useEffect(() => {
    const initialPrices: { [key: string]: string } = {};
    myTests.forEach(test => {
      // Find the master_test_id for this test (we need to match by title since labTest doesn't have master_test_id populated directly, or we can fetch it)
      // Actually myTests has `master_tests: { title: string }`. We can match by title.
      const master = masterTests.find(m => m.title === test.master_tests?.title);
      if (master) {
        initialPrices[master.id] = test.price.toString();
      }
    });
    setTestPrices(initialPrices);
  }, [masterTests, myTests]);

  const handlePriceChange = (masterTestId: string, value: string) => {
    setTestPrices(prev => ({
      ...prev,
      [masterTestId]: value
    }));
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    setSavedSuccess(false);

    try {
      const testsToUpsert = Object.entries(testPrices)
        .filter(([_, price]) => price && !isNaN(Number(price)))
        .map(([masterTestId, price]) => ({
          lab_id: labId,
          test_id: masterTestId,
          price: Number(price),
          turnaround_time: '24 Hours',
          is_home_collection: true
        }));

      if (testsToUpsert.length === 0) {
        alert('Please enter at least one price to save.');
        setIsSaving(false);
        return;
      }

      // Upsert: Need to make sure lab_tests has a unique constraint on (lab_id, test_id) for upsert to work properly.
      // Since we don't know the unique constraint, the safest way is to delete existing and insert new, OR just insert avoiding duplicates.
      // To be safe, we'll fetch existing and only insert new or update existing.

      // We will do this individually for reliability
      for (const item of testsToUpsert) {
        // check if exists
        const { data: existing } = await supabase
          .from('lab_tests')
          .select('id')
          .eq('lab_id', labId)
          .eq('test_id', item.test_id)
          .single();

        if (existing) {
          // Update
          await supabase
            .from('lab_tests')
            .update({ price: item.price })
            .eq('id', existing.id);
        } else {
          // Insert
          await supabase
            .from('lab_tests')
            .insert(item);
        }
      }

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
      onTestsUpdated();
    } catch (error: any) {
      alert("Error saving tests: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-[24px] p-6 sm:p-8 shadow-xl shadow-gray-200/50 border border-gray-100 h-full flex flex-col">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <FlaskConical className="w-6 h-6 mr-2 text-blue-600" />
            Bulk Add Tests
          </h2>
          <p className="text-sm text-gray-500 mt-1">Enter prices for the tests you offer. Leave blank if you do not offer them. Press Tab to move quickly.</p>
        </div>
        
        <button
          onClick={handleSaveAll}
          disabled={isSaving}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md flex items-center justify-center whitespace-nowrap"
        >
          {isSaving ? (
            <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Saving...</>
          ) : savedSuccess ? (
            <><CheckCircle2 className="w-5 h-5 mr-2" /> Saved!</>
          ) : (
            <><Save className="w-5 h-5 mr-2" /> Save All Prices</>
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-4 custom-scrollbar">
        <div className="w-full border border-gray-300 rounded-lg overflow-hidden">
          <table className="w-full text-left border-collapse bg-white">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300">
                <th className="py-2.5 px-3 sm:px-4 font-bold text-xs sm:text-sm text-gray-700 border-r border-gray-300 w-3/5">Test Name</th>
                <th className="py-2.5 px-3 sm:px-4 font-bold text-xs sm:text-sm text-gray-700 text-center w-2/5">Price (Rs.)</th>
              </tr>
            </thead>
            <tbody>
              {masterTests.map((test, index) => (
                <tr key={test.id} className="border-b border-gray-200 hover:bg-blue-50/30 transition-colors">
                  <td className="py-2 px-3 sm:px-4 text-xs sm:text-sm font-semibold text-gray-800 border-r border-gray-200">
                    {test.title}
                  </td>
                  <td className="p-0">
                    <input
                      type="number"
                      placeholder="0"
                      value={testPrices[test.id] || ''}
                      onChange={(e) => handlePriceChange(test.id, e.target.value)}
                      className="w-full h-full min-h-[40px] px-3 text-center sm:text-right font-bold text-blue-700 bg-transparent outline-none focus:bg-blue-50 focus:ring-inset focus:ring-2 focus:ring-blue-500 transition-colors"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {masterTests.length === 0 && (
          <div className="text-center py-16">
            <FlaskConical className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No master tests available in the database yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
