"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { FileText, Plus, Search, CheckCircle, Loader2, RefreshCw, PhoneCall } from 'lucide-react';

export default function OrdersManagementPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [labs, setLabs] = useState<any[]>([]);
  const [tests, setTests] = useState<any[]>([]);
  
  // Form states
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientAddress, setPatientAddress] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientGender, setPatientGender] = useState('Male');
  const [selectedLabId, setSelectedLabId] = useState('');
  const [selectedTestId, setSelectedTestId] = useState('');
  const [deliveryFee, setDeliveryFee] = useState('50'); // Default

  useEffect(() => {
    fetchOrders();
    fetchLabs();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id, created_at, status, total_amount, patient_name, patient_phone, patient_address, booking_source, report_url,
          labs ( name ),
          booking_items (
            lab_test_id
          )
        `)
        .order('created_at', { ascending: false });

      if (data) setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLabs = async () => {
    const { data } = await supabase.from('labs').select('id, name');
    if (data) setLabs(data);
  };

  const fetchTestsForLab = async (labId: string) => {
    try {
      const { data, error } = await supabase.from('lab_tests').select('id, price, master_tests(title)').eq('lab_id', labId);
      if (error) console.error("Error fetching tests:", error);
      if (data) setTests(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLabChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const labId = e.target.value;
    setSelectedLabId(labId);
    setSelectedTestId('');
    if (labId) {
      fetchTestsForLab(labId);
    } else {
      setTests([]);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const confirmChange = window.confirm(`Are you sure you want to mark this order as ${newStatus.toUpperCase()}?`);
    if (!confirmChange) return;

    try {
      const { error } = await supabase.from('bookings').update({ status: newStatus }).eq('id', orderId);
      if (error) throw error;
      alert(`Order updated to ${newStatus}`);
      fetchOrders();
    } catch (error: any) {
      alert("Failed to update status: " + error.message);
    }
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLabId || !selectedTestId || !patientName || !patientPhone || !patientAddress) {
      alert("Please fill all required fields!");
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedTest = tests.find(t => t.id === selectedTestId);
      const testPrice = selectedTest?.price || 0;
      const totalAmount = testPrice + Number(deliveryFee);

      // Insert Booking
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          patient_id: null, // Always null for manual Call/WhatsApp orders
          lab_id: selectedLabId,
          total_amount: totalAmount,
          status: 'pending',
          patient_address: patientAddress,
          patient_phone: patientPhone,
          patient_name: patientName,
          patient_age: patientAge,
          patient_gender: patientGender,
          booking_source: 'whatsapp_call'
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      // Insert Booking Item
      const { error: itemError } = await supabase
        .from('booking_items')
        .insert({
          booking_id: booking.id,
          lab_test_id: selectedTestId,
          price_at_booking: testPrice
        });

      if (itemError) throw itemError;

      alert("Manual order created successfully! It will now appear in the Rider's app.");
      setIsModalOpen(false);
      
      // Reset form
      setPatientName(''); setPatientPhone(''); setPatientAddress(''); setPatientAge('');
      setSelectedLabId(''); setSelectedTestId(''); setTests([]);
      fetchOrders();
    } catch (error: any) {
      alert("Error creating order: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return order.patient_name?.toLowerCase().includes(q) || order.patient_phone?.includes(q) || order.id.includes(q);
  });

  return (
    <div className="p-8 max-w-7xl mx-auto font-sans relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            <FileText className="text-indigo-600 w-8 h-8" /> 
            Orders Management
          </h1>
          <p className="text-gray-500 mt-2">Manage all system orders and create manual bookings for Call/WhatsApp customers.</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md"
        >
          <PhoneCall size={18} /> New Manual Booking
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-lg font-bold text-gray-900">All Orders</h2>
          <div className="relative w-full sm:w-72">
            <Search size={18} className="absolute left-3 top-3 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by name, phone or ID..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-indigo-600 w-10 h-10" /></div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-xs uppercase tracking-wider text-gray-500 border-b border-gray-100">
                  <th className="px-6 py-4 font-bold">Order Details</th>
                  <th className="px-6 py-4 font-bold">Customer Info</th>
                  <th className="px-6 py-4 font-bold">Source</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold text-center">Report</th>
                  <th className="px-6 py-4 font-bold text-right">Update Status (Admin Override)</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredOrders.map((order) => {
                  const testName = 'Test Data'; // Simplified for now
                  const isWhatsApp = order.booking_source === 'whatsapp_call';

                  return (
                    <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900">{isWhatsApp ? 'Manual/Call Order' : 'App Order'}</p>
                        <p className="text-xs text-gray-500">Lab: {order.labs?.name}</p>
                        <p className="text-xs font-mono text-gray-400 mt-1">#{order.id.split('-')[0]}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900">{order.patient_name}</p>
                        <p className="text-xs text-gray-500">{order.patient_phone}</p>
                      </td>
                      <td className="px-6 py-4">
                        {isWhatsApp ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                            <PhoneCall size={12} /> WhatsApp / Call
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-100 text-blue-800 text-[10px] font-bold uppercase tracking-wider">
                            App Order
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${order.status === 'completed' ? 'bg-green-100 text-green-700' : order.status === 'pending' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {order.report_url ? (
                          <a href={order.report_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-900 font-bold text-xs bg-blue-50 px-3 py-1.5 rounded-full inline-block">
                            Download
                          </a>
                        ) : (
                          <span className="text-gray-400 text-xs">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <select 
                          className="bg-white border border-gray-200 text-xs font-bold rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="accepted">Accepted (Lab)</option>
                          <option value="sample_collected">Sample Collected (Rider)</option>
                          <option value="report_uploaded">Report Uploaded (Lab)</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Manual Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[30px] p-8 w-full max-w-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-900 bg-gray-100 rounded-full">
              ✕
            </button>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
              <PhoneCall className="text-indigo-600" /> Create Manual Booking
            </h2>

            <form onSubmit={handleCreateOrder} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Patient Name *</label>
                  <input type="text" required value={patientName} onChange={e => setPatientName(e.target.value)} className="w-full px-4 py-3 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" placeholder="Ali Khan" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Patient Phone *</label>
                  <input type="text" required value={patientPhone} onChange={e => setPatientPhone(e.target.value)} className="w-full px-4 py-3 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" placeholder="03001234567" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Complete Address *</label>
                <textarea required value={patientAddress} onChange={e => setPatientAddress(e.target.value)} className="w-full px-4 py-3 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" placeholder="House 1, Street 2, Area... (Include specific instructions for rider)" rows={2}></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Age</label>
                  <input type="number" value={patientAge} onChange={e => setPatientAge(e.target.value)} className="w-full px-4 py-3 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" placeholder="25" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Gender</label>
                  <select value={patientGender} onChange={e => setPatientGender(e.target.value)} className="w-full px-4 py-3 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Select Lab *</label>
                  <select required value={selectedLabId} onChange={handleLabChange} className="w-full px-4 py-3 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500">
                    <option value="">-- Choose Lab --</option>
                    {labs.map(lab => <option key={lab.id} value={lab.id}>{lab.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Select Test *</label>
                  <select required value={selectedTestId} onChange={e => setSelectedTestId(e.target.value)} disabled={!selectedLabId} className="w-full px-4 py-3 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 disabled:opacity-50">
                    <option value="">-- Choose Test --</option>
                    {tests.map(test => <option key={test.id} value={test.id}>{test.master_tests?.title || 'Unknown Test'} (Rs. {test.price})</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Delivery Fee (Rs)</label>
                <input type="number" required value={deliveryFee} onChange={e => setDeliveryFee(e.target.value)} className="w-full px-4 py-3 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" />
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-4 rounded-xl font-extrabold flex items-center justify-center gap-2 transition-all disabled:opacity-70 shadow-lg shadow-indigo-600/30">
                {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <CheckCircle size={20} />}
                {isSubmitting ? 'Creating Order...' : 'Create Manual Booking'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
