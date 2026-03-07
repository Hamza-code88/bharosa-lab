"use client";
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Booking } from '@/types'; 
import { Loader2, ClipboardList, Phone, MapPin, User, Clock, AlertCircle, Lock, UploadCloud, FileCheck, TestTube } from 'lucide-react';
import { sendPushNotification } from '../../../lib/sendNotification';

export default function BookingsManagerPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [labId, setLabId] = useState<string | null>(null);
  
  // Upload States
  const [uploadingReportId, setUploadingReportId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeUploadBookingId, setActiveUploadBookingId] = useState<string | null>(null);

  // 1. Initial Fetch
  useEffect(() => {
    const initData = async () => {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: lab } = await supabase.from('labs').select('id').eq('owner_id', session.user.id).single();
        if (lab) {
          setLabId(lab.id);
          
          const { data: fetchedBookings, error: fetchError } = await supabase
            .from('bookings')
            .select(`
              *,
              booking_items (
                price_at_booking,
                lab_tests (
                  master_tests ( title )
                )
              )
            `)
            .eq('lab_id', lab.id)
            .order('created_at', { ascending: false });

          if (fetchError) {
            console.error("Supabase Error:", fetchError.message);
            
            const { data: fallbackBookings } = await supabase
              .from('bookings')
              .select('*')
              .eq('lab_id', lab.id)
              .order('created_at', { ascending: false });
              
            if (fallbackBookings) setBookings(fallbackBookings);
          } else if (fetchedBookings) {
            setBookings(fetchedBookings);
          }
        }
      }
      setIsLoading(false);
    };
    initData();
  }, []);

  // 2. Realtime Listener
  useEffect(() => {
    if (!labId) return;
    const channel = supabase
      .channel('realtime-lab-bookings')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings', filter: `lab_id=eq.${labId}` }, async (payload) => {
          if (payload.eventType === 'INSERT') {
            const { data: newBooking, error } = await supabase
              .from('bookings')
              .select(`*, booking_items(price_at_booking, lab_tests(master_tests(title)))`)
              .eq('id', payload.new.id)
              .single();
              
            if (!error && newBooking) {
               setBookings((prev) => [newBooking, ...prev]);
            } else {
               const { data: fallbackNew } = await supabase.from('bookings').select('*').eq('id', payload.new.id).single();
               if (fallbackNew) setBookings((prev) => [fallbackNew, ...prev]);
            }
          }
          else if (payload.eventType === 'UPDATE') {
            setBookings((prev) => prev.map(b => b.id === payload.new.id ? { ...b, ...payload.new } : b));
          }
          else if (payload.eventType === 'DELETE') {
            setBookings((prev) => prev.filter(b => b.id !== payload.old.id));
          }
      }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [labId]);

  // 🛑 FIX: Parameter ka naam userId se patientId kar diya
  const handleStatusChange = async (bookingId: string, newStatus: string, patientId: string) => {
    if (newStatus === 'Cancelled' && !window.confirm("Are you sure you want to cancel this order?")) return;
    if (newStatus === 'Completed' && !window.confirm("Mark this order as completed?")) return;

    setUpdatingId(bookingId);
    try {
      const { error } = await supabase.from('bookings').update({ status: newStatus }).eq('id', bookingId);
      if (error) throw error;

      // 🛑 FIX: Agar patientId hai tabhi notification bhejni hai
      if (patientId) {
        let notifTitle = "Order Update";
        let notifBody = `Aapke test ka status ab '${newStatus}' hai.`;

        if (newStatus === 'Accepted') {
          notifTitle = "Test Accepted ✅";
          notifBody = "Lab ne aapka test accept kar liya hai. Rider jald hi aayega.";
        } else if (newStatus === 'Dispatched') {
          notifTitle = "Rider Dispatched 🏍️";
          notifBody = "Hamara rider sample lene ke liye raaste mein hai!";
        } else if (newStatus === 'Completed') {
          notifTitle = "Test Completed 🎉";
          notifBody = "Aapka test complete ho gaya hai. Report jald upload ho jayegi.";
        }

        // Notification bhejo
        await sendPushNotification(patientId, notifTitle, notifBody);
      }

    } catch (error: any) {
      alert("Status Update Failed: " + error.message);
    } finally {
      setUpdatingId(null);
    }
  };

  // Upload System
  const triggerFileSelect = (bookingId: string) => {
    setActiveUploadBookingId(bookingId); 
    fileInputRef.current?.click(); 
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeUploadBookingId) return;

    setUploadingReportId(activeUploadBookingId);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `report-${activeUploadBookingId}-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('reports').upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('reports').getPublicUrl(fileName);
      const { error: dbError } = await supabase.from('bookings').update({ report_url: publicUrl }).eq('id', activeUploadBookingId);
      if (dbError) throw dbError;

      alert("🎉 Report Uploaded Successfully! Patient can now see it in their app.");
      setBookings(prev => prev.map(b => b.id === activeUploadBookingId ? { ...b, report_url: publicUrl } : b));

      const currentBooking = bookings.find(b => b.id === activeUploadBookingId);
      // 🛑 FIX: Yahan booking.user_id ki jagah booking.patient_id aayega
      if (currentBooking && currentBooking.patient_id) {
        await sendPushNotification(
          currentBooking.patient_id, 
          "Report Uploaded 📄", 
          "Aapke test ki report upload ho gayi hai. App mein check karein!"
        );
      }

    } catch (error: any) {
      alert("Upload Failed: " + error.message);
    } finally {
      setUploadingReportId(null);
      setActiveUploadBookingId(null);
      if (fileInputRef.current) fileInputRef.current.value = ''; 
    }
  };

  // UI Helpers
  const getCardStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'border-l-amber-400 bg-white';
      case 'accepted': return 'border-l-blue-500 bg-blue-50/30';
      case 'dispatched': return 'border-l-purple-500 bg-purple-50/30';
      case 'completed': return 'border-l-green-500 bg-green-50/30 opacity-90';
      case 'cancelled': return 'border-l-red-500 bg-red-50/30 opacity-70';
      default: return 'border-l-gray-300 bg-white';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><AlertCircle className="w-3 h-3"/> PENDING</span>;
      case 'accepted': return <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold">ACCEPTED</span>;
      case 'dispatched': return <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-bold">RIDER DISPATCHED</span>;
      case 'completed': return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Lock className="w-3 h-3"/> COMPLETED</span>;
      case 'cancelled': return <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Lock className="w-3 h-3"/> CANCELLED</span>;
      default: return <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-bold">{status}</span>;
    }
  };

  if (isLoading) return <div className="flex justify-center items-center h-[60vh]"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>;

  return (
    <div className="max-w-6xl mx-auto pb-12">
      
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*,application/pdf" className="hidden" />

      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Patient Bookings</h1>
          <p className="text-gray-500 mt-1 text-sm">Manage test orders, view test details, and upload Reports.</p>
        </div>
        <div className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-600/30">
          <ClipboardList className="w-5 h-5" />
          {bookings.length} Orders
        </div>
      </div>

      <div className="grid gap-5">
        {bookings.map((booking) => {
          const statusLower = booking.status.toLowerCase();
          const isLocked = statusLower === 'completed' || statusLower === 'cancelled';
          const isCompleted = statusLower === 'completed';

          return (
            <div key={booking.id} className={`rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col md:flex-row transition-all border-l-[6px] hover:shadow-md ${getCardStyle(booking.status)}`}>
              
              {/* LEFT COLUMN: Patient Info */}
              <div className="p-6 md:w-[35%] bg-white/50 border-b md:border-b-0 md:border-r border-gray-100">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center border border-gray-200">
                    <User className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-gray-900 leading-tight">{booking.patient_name}</h3>
                    <p className="text-sm text-gray-500 font-medium">{booking.patient_age} yrs • {booking.patient_gender}</p>
                  </div>
                </div>
                <div className="space-y-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-50 p-1.5 rounded-md"><Phone className="w-4 h-4 text-blue-600" /></div>
                    <span className="text-sm font-bold text-gray-700">{booking.patient_phone}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-red-50 p-1.5 rounded-md mt-0.5"><MapPin className="w-4 h-4 text-red-600" /></div>
                    <span className="text-sm font-medium text-gray-600 leading-snug">{booking.patient_address}</span>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Test Details, Price & Actions */}
              <div className="p-6 md:w-[65%] flex flex-col justify-between bg-white">
                
                {/* TESTS LIST SECTION */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <TestTube className="w-5 h-5 text-gray-400" />
                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Tests Ordered</h4>
                  </div>
                  
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                    {booking.booking_items && booking.booking_items.length > 0 ? (
                      <ul className="space-y-3">
                        {booking.booking_items.map((item: any, idx: number) => {
                          const testTitle = item.lab_tests?.master_tests?.title || 'Unknown Medical Test';
                          const testPrice = item.price_at_booking || '0';

                          return (
                            <li key={idx} className="flex justify-between items-center text-sm">
                              <span className="font-bold text-gray-800 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                {testTitle}
                              </span>
                              <span className="text-gray-600 font-medium whitespace-nowrap">Rs. {testPrice}</span>
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <p className="text-sm text-red-500 font-medium italic">No test details found in database.</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-end mb-6 pb-6 border-b border-gray-100">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Order Time</p>
                    <p className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-gray-400" />
                      {new Date(booking.created_at).toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Grand Total</p>
                    <p className="text-2xl font-black text-gray-900 tracking-tight">Rs. {booking.total_amount}</p>
                  </div>
                </div>

                {/* Status & Upload Area */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-gray-500">Status:</span>
                    {getStatusBadge(booking.status)}
                  </div>

                  <div className="flex items-center gap-3">
                    {isLocked ? (
                      <>
                        <div className="bg-gray-100 border border-gray-200 text-gray-500 text-sm rounded-xl px-4 py-2.5 font-bold flex items-center gap-2">
                          <Lock className="w-4 h-4" /> Locked
                        </div>
                        
                        {isCompleted && (
                          booking.report_url ? (
                            <div className="bg-green-50 text-green-700 border border-green-200 text-sm rounded-xl px-4 py-2.5 font-bold flex items-center gap-2">
                              <FileCheck className="w-4 h-4" /> Report Uploaded
                            </div>
                          ) : (
                            <button
                              onClick={() => triggerFileSelect(booking.id)}
                              disabled={uploadingReportId === booking.id}
                              className="bg-green-600 hover:bg-green-700 text-white text-sm rounded-xl px-4 py-2.5 font-bold flex items-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-sm shadow-green-600/30"
                            >
                              {uploadingReportId === booking.id ? (
                                <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</>
                              ) : (
                                <><UploadCloud className="w-4 h-4" /> Upload Report</>
                              )}
                            </button>
                          )
                        )}
                      </>
                    ) : (
                      <select 
                        value={booking.status}
                        disabled={updatingId === booking.id}
                        // 🛑 FIX: Yahan booking.user_id ki jagah booking.patient_id pass ho raha hai
                        onChange={(e) => handleStatusChange(booking.id, e.target.value, booking.patient_id)}
                        className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-blue-600 focus:border-blue-600 block p-2.5 font-bold cursor-pointer transition-all shadow-sm"
                      >
                        {statusLower === 'pending' && <option value="Pending">Pending</option>}
                        {(statusLower === 'pending' || statusLower === 'accepted') && <option value="Accepted">Accept Order</option>}
                        {(statusLower === 'accepted' || statusLower === 'dispatched') && <option value="Dispatched">Dispatch Rider</option>}
                        <option value="Completed">Mark Completed</option>
                        <option value="Cancelled">Cancel Order</option>
                      </select>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}