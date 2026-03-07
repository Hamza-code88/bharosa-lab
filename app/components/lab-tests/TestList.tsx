"use client";
import React from 'react';
import { Trash2, Beaker, Home } from 'lucide-react';
import { LabTestWithDetails } from '@/types';
import { supabase } from '@/lib/supabase';

interface Props {
  tests: LabTestWithDetails[];
  onTestDeleted: () => void;
}

export default function TestList({ tests, onTestDeleted }: Props) {

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this test from your offerings?")) return;
    
    const { error } = await supabase.from('lab_tests').delete().eq('id', id);
    if (error) alert("Error deleting test: " + error.message);
    else onTestDeleted(); 
  };

  if (tests.length === 0) {
    return (
      <div className="bg-white p-16 rounded-3xl border border-dashed border-gray-300 shadow-sm text-center flex flex-col items-center justify-center min-h-[400px]">
        <div className="bg-gray-50 p-6 rounded-full mb-4">
          <Beaker className="w-10 h-10 text-gray-300" />
        </div>
        <h3 className="text-xl font-extrabold text-gray-800">Your Catalog is Empty</h3>
        <p className="text-gray-500 mt-2 max-w-sm">Use the form on the left to add tests you offer. You can search existing ones or create new custom tests.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
        <h3 className="font-bold text-gray-900">Active Test Offerings</h3>
        <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">{tests.length} Total</span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Test Name</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Pricing</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Report Info</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {tests.map((test) => (
              <tr key={test.id} className="hover:bg-gray-50 transition-colors group">
                <td className="px-6 py-5">
                  <p className="font-bold text-gray-900 text-sm">{test.master_tests?.title || 'Unknown Test'}</p>
                </td>
                <td className="px-6 py-5">
                  <p className="font-extrabold text-blue-600">Rs. {test.price}</p>
                </td>
                <td className="px-6 py-5">
                  <p className="text-sm font-medium text-gray-700">{test.turnaround_time}</p>
                  {test.is_home_collection && (
                    <div className="flex items-center gap-1 text-[10px] font-bold text-green-600 mt-1 uppercase tracking-wide">
                      <Home size={10} /> Home Coll.
                    </div>
                  )}
                </td>
                <td className="px-6 py-5 text-right">
                  <button 
                    onClick={() => handleDelete(test.id)} 
                    className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                    title="Remove Test"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}