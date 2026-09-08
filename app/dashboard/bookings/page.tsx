"use client";
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, ClipboardList, Phone, MapPin, User, Clock, AlertCircle, Lock, UploadCloud, FileCheck, TestTube, CheckCircle, Navigation, FlaskConical } from 'lucide-react';
import { sendPushNotification } from '../../../lib/sendNotification';

export default function BookingsManagerPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [labId, setLabId] = useState<string | null>(null);
  
  const [uploadingReportId, setUploadingReportId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeUploadBookingId, setActiveUploadBookingId] = useState<string | null>(null);

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
            const { data: fallbackBookings } = await supabase.from('bookings').select('*').eq('lab_id', lab.id).order('created_at', { ascending: false });
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

  useEffect(() => {
    if (!labId) return;
    const channel = supabase
      .channel('realtime-lab-bookings')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings', filter: `lab_id=eq.${labId}` }, async (payload) => {
          if (payload.eventType === 'INSERT') {
            const { data: newBooking, error } = await supabase.from('bookings').select(`*, booking_items(price_at_booking, lab_tests(master_tests(title)))`).eq('id', payload.new.id).single();
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

  const handleStatusChange = async (bookingId: string, newStatus: string, patientId: string) => {
    if (newStatus === 'Cancelled' && !window.confirm("Are you sure you want to cancel this order?")) return;
    if (newStatus === 'Completed' && !window.confirm("Is the test complete and report ready?")) return;

    setUpdatingId(bookingId);
    try {
      const { error } = await supabase.from('bookings').update({ status: newStatus }).eq('id', bookingId);
      if (error) throw error;

      if (patientId) {
        let notifTitle = "Order Update";
        let notifBody = `Aapke test ka status ab '${newStatus}' hai.`;

        if (newStatus === 'Accepted') {
          notifTitle = "Test Accepted ✅";
          notifBody = "Lab ne aapka test accept kar liya hai. Rider jald assign hoga.";
        } else if (newStatus === 'Completed') {
          notifTitle = "Test Completed 🎉";
          notifBody = "Aapka test complete ho gaya hai. Report check karein!";
        }
        await sendPushNotification(patientId, notifTitle, notifBody);
      }
    } catch (error: any) {
      alert("Status Update Failed: " + error.message);
    } finally {
      setUpdatingId(null);
    }
  };

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
      if (currentBooking && currentBooking.patient_id) {
        await sendPushNotification(
          currentBooking.patient_id, 
          "Report Uploaded 📄", 
          "Aapke test ki report upload ho gayi hai. App mein check karein!"
        );
      }

      // 🛑 Send report notification and file to Discord #reports channel
      try {
        const testTitles = currentBooking?.booking_items?.map((item: any) => item.lab_tests?.master_tests?.title).filter(Boolean).join(', ') || currentBooking?.test_names || 'Diagnostic Tests';

        let labName = 'Partner Diagnostic Lab';
        let labCity = '';
        if (labId) {
          const { data: labInfo } = await supabase.from('labs').select('name, city').eq('id', labId).maybeSingle();
          if (labInfo?.name) labName = labInfo.name;
          if (labInfo?.city) labCity = labInfo.city;
        }

        const reportPayload = {
          bookingId: activeUploadBookingId,
          reportUrl: publicUrl,
          patientName: currentBooking?.patient_name || 'Patient',
          patientPhone: currentBooking?.patient_phone || '',
          patientAge: currentBooking?.patient_age || '',
          patientGender: currentBooking?.patient_gender || '',
          testNames: testTitles,
          totalAmount: currentBooking?.total_amount || 0,
          labName,
          labCity,
        };

        let sent = false;
        try {
          const apiRes = await fetch('/api/discord/report', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reportPayload),
          });
          if (apiRes.ok) sent = true;
        } catch (apiErr) {
          console.warn("API route dispatch failed, trying direct webhook...", apiErr);
        }

        // Direct fallback if API route fails or is not yet compiled
        if (!sent) {
          const webhookUrl = process.env.NEXT_PUBLIC_DISCORD_REPORTS_WEBHOOK_URL || 'https://discord.com/api/webhooks/1546709938871476355/A9nm7hcHBowlEcuOnb-mnjbgAUAYd9CYzV3LpR6nYb21-wV91_48wE3oIQm2px41IYnM';
          await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username: 'Bharosa Reports Bot',
              avatar_url: 'https://ksclwdqyqielntcsawbf.supabase.co/storage/v1/object/public/logos/bharosa-logo.png',
              embeds: [{
                title: '📄 New Patient Test Report Uploaded!',
                description: `A diagnostic lab has finalized and uploaded a medical report for patient **${reportPayload.patientName}**.`,
                color: 0x2563EB,
                fields: [
                  { name: '👤 Patient Details', value: `**Name:** ${reportPayload.patientName}\n**Phone:** ${reportPayload.patientPhone || 'N/A'}\n**Demographics:** ${reportPayload.patientAge ? `${reportPayload.patientAge} Y` : 'N/A'} • ${reportPayload.patientGender || 'N/A'}`, inline: true },
                  { name: '🏥 Laboratory', value: `**${reportPayload.labName}**\n📍 ${reportPayload.labCity || 'Verified Partner'}`, inline: true },
                  { name: '🧪 Tests Conducted', value: reportPayload.testNames, inline: false },
                  { name: '💰 Order Amount', value: `Rs. ${reportPayload.totalAmount}`, inline: true },
                  { name: '🆔 Booking ID', value: `\`${reportPayload.bookingId}\``, inline: true },
                  { name: '📥 Report Access', value: reportPayload.reportUrl ? `[🔗 Click to Open / Download Report](${reportPayload.reportUrl})` : 'N/A', inline: false },
                ],
                footer: { text: 'Bharosa Healthcare • Realtime Report Dispatch' },
                timestamp: new Date().toISOString(),
              }],
            }),
          });
        }
      } catch (discordErr) {
        console.warn("Discord report webhook error:", discordErr);
      }
    } catch (error: any) {
      alert("Upload Failed: " + error.message);
    } finally {
      setUploadingReportId(null);
      setActiveUploadBookingId(null);
      if (fileInputRef.current) fileInputRef.current.value = ''; 
    }
  };

  const getCardStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'border-l-amber-400 bg-white';
      case 'accepted': return 'border-l-blue-500 bg-blue-50/30';
      case 'on the way': return 'border-l-purple-500 bg-purple-50/30';
      case 'sample collected': return 'border-l-teal-500 bg-teal-50/30';
      case 'completed': return 'border-l-green-500 bg-green-50/30 opacity-90';
      case 'cancelled': return 'border-l-red-500 bg-red-50/30 opacity-70';
      default: return 'border-l-gray-300 bg-white';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold flex items-center gap-1 w-max"><AlertCircle className="w-3 h-3"/> PENDING</span>;
      case 'accepted': return <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold flex items-center gap-1 w-max"><CheckCircle className="w-3 h-3"/> ACCEPTED</span>;
      case 'on the way': return <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold flex items-center gap-1 w-max"><Navigation className="w-3 h-3"/> RIDER ON THE WAY</span>;
      case 'sample collected': return <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold flex items-center gap-1 w-max"><FlaskConical className="w-3 h-3"/> SAMPLE COLLECTED</span>;
      case 'completed': return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold flex items-center gap-1 w-max"><FileCheck className="w-3 h-3"/> COMPLETED</span>;
      case 'cancelled': return <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold flex items-center gap-1 w-max"><Lock className="w-3 h-3"/> CANCELLED</span>;
      default: return <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold w-max">{status}</span>;
    }
  };

  if (isLoading) return <div className="flex justify-center items-center h-[60vh]"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>;

  return (
    <div className="max-w-6xl mx-auto pb-12 px-4 sm:px-0">
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*,application/pdf" className="hidden" />

      {/* 🌟 Responsive Header */}
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Patient Bookings</h1>
          <p className="text-gray-500 mt-1 text-xs sm:text-sm">Manage test orders, view test details, and upload Reports.</p>
        </div>
        <div className="w-full sm:w-auto bg-blue-600 text-white px-5 py-3 sm:py-2.5 rounded-xl font-bold flex items-center justify-center sm:justify-start gap-2 shadow-lg shadow-blue-600/30">
          <ClipboardList className="w-5 h-5" />
          {bookings.length} Orders
        </div>
      </div>

      <div className="grid gap-4 sm:gap-5">
        {bookings.map((booking) => {
          const statusLower = booking.status.toLowerCase();
          const isLocked = statusLower === 'completed' || statusLower === 'cancelled';
          const isCompleted = statusLower === 'completed';

          return (
            <div key={booking.id} className={`rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col md:flex-row transition-all border-l-[6px] hover:shadow-md ${getCardStyle(booking.status)}`}>
              
              {/* 🌟 Patient Info Side (Responsive Paddings) */}
              <div className="p-4 sm:p-6 md:w-[35%] bg-white/50 border-b md:border-b-0 md:border-r border-gray-100">
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center border border-gray-200 shrink-0">
                    <User className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-gray-900 leading-tight">{booking.patient_name}</h3>
                    <p className="text-xs sm:text-sm text-gray-500 font-medium">{booking.patient_age} yrs • {booking.patient_gender}</p>
                  </div>
                </div>
                <div className="space-y-2 sm:space-y-3 bg-white p-3 sm:p-4 rounded-xl border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="bg-blue-50 p-1.5 rounded-md"><Phone className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" /></div>
                    <span className="text-xs sm:text-sm font-bold text-gray-700">{booking.patient_phone}</span>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="bg-red-50 p-1.5 rounded-md mt-0.5"><MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" /></div>
                    <span className="text-xs sm:text-sm font-medium text-gray-600 leading-snug">{booking.patient_address}</span>
                  </div>
                </div>
              </div>

              {/* 🌟 Test Details Side */}
              <div className="p-4 sm:p-6 md:w-[65%] flex flex-col justify-between bg-white">
                <div className="mb-4 sm:mb-6">
                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <TestTube className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                    <h4 className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider">Tests Ordered</h4>
                  </div>
                  
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 sm:p-4">
                    {booking.booking_items && booking.booking_items.length > 0 ? (
                      <ul className="space-y-2 sm:space-y-3">
                        {booking.booking_items.map((item: any, idx: number) => {
                          const testTitle = item.lab_tests?.master_tests?.title || 'Unknown Medical Test';
                          const testPrice = item.price_at_booking || '0';
                          return (
                            <li key={idx} className="flex justify-between items-start sm:items-center text-xs sm:text-sm gap-2">
                              <span className="font-bold text-gray-800 flex items-start sm:items-center gap-2 flex-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 sm:mt-0 shrink-0"></span>
                                {testTitle}
                              </span>
                              <span className="text-gray-600 font-medium whitespace-nowrap">Rs. {testPrice}</span>
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <p className="text-xs sm:text-sm text-red-500 font-medium italic">No test details found in database.</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-end mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-100">
                  <div>
                    <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Order Time</p>
                    <p className="text-xs sm:text-sm font-bold text-gray-800 flex items-center gap-1 sm:gap-1.5">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                      {new Date(booking.created_at).toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Grand Total</p>
                    <p className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">Rs. {booking.total_amount}</p>
                  </div>
                </div>

                {/* 🌟 Action Buttons (Stacked on Mobile, Row on Desktop) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto">
                    <span className="text-xs sm:text-sm font-bold text-gray-500">Status:</span>
                    {getStatusBadge(booking.status)}
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                    {isLocked ? (
                      <>
                        <div className="w-full sm:w-auto justify-center bg-gray-100 border border-gray-200 text-gray-500 text-xs sm:text-sm rounded-xl px-4 py-2.5 sm:py-2.5 font-bold flex items-center gap-2">
                          <Lock className="w-4 h-4" /> Locked
                        </div>
                        
                        {isCompleted && (
                          booking.report_url ? (
                            <a href={booking.report_url} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto justify-center bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-xs sm:text-sm rounded-xl px-4 py-2.5 sm:py-2.5 font-bold flex items-center gap-2 transition-colors">
                              <FileCheck className="w-4 h-4" /> Download Report
                            </a>
                          ) : (
                            <button
                              onClick={() => triggerFileSelect(booking.id)}
                              disabled={uploadingReportId === booking.id}
                              className="w-full sm:w-auto justify-center bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm rounded-xl px-4 py-3 sm:py-2.5 font-bold flex items-center gap-2 transition-colors disabled:opacity-70 shadow-sm shadow-green-600/30"
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
                        onChange={(e) => handleStatusChange(booking.id, e.target.value, booking.patient_id)}
                        className="w-full sm:w-auto bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-blue-600 focus:border-blue-600 block p-3 sm:p-2.5 font-bold cursor-pointer transition-all shadow-sm"
                      >
                        {statusLower === 'pending' && <option value="Pending">Pending</option>}
                        {(statusLower === 'pending' || statusLower === 'accepted') && <option value="Accepted">Accept Order</option>}
                        {statusLower === 'on the way' && <option value="On The Way" disabled>Rider On The Way</option>}
                        {statusLower === 'sample collected' && <option value="Sample Collected" disabled>Sample Collected</option>}
                        {(statusLower === 'sample collected' || statusLower === 'completed') && <option value="Completed">Mark Completed</option>}
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