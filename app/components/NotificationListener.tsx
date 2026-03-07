"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase'; // Path check kar lein
import toast from 'react-hot-toast';

export default function NotificationListener() {
  const [labId, setLabId] = useState<string | null>(null);

  // 1. Pehle pata karo kon sa admin login hai aur uski Lab ID kya hai
  useEffect(() => {
    const fetchLab = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: lab } = await supabase.from('labs').select('id').eq('owner_id', session.user.id).single();
        if (lab) setLabId(lab.id);
      }
    };
    fetchLab();
  }, []);

  // 2. Real-time Naye Orders ka intezar karo
  useEffect(() => {
    if (!labId) return;

    const channel = supabase
      .channel('admin-new-orders')
      .on(
        'postgres_changes',
        {
          event: 'INSERT', // Sirf naye (INSERT) aane wale orders par alert dega
          schema: 'public',
          table: 'bookings',
          filter: `lab_id=eq.${labId}`
        },
        (payload) => {
          // Alert Sound Play karega (Chota sa Notification Beep)
          const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
          audio.play().catch(e => console.log("Browser ne sound block kar di"));

          // Screen par khoobsurat Toast Popup
          toast.success(
            `Naya Test Order!\nPatient: ${payload.new.patient_name}`, 
            {
              duration: 6000,
              icon: '🔔',
              style: {
                background: '#eff6ff',
                color: '#1e3a8a',
                border: '1px solid #bfdbfe'
              }
            }
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [labId]);

  // Yeh UI par kuch render nahi karega, sirf background mein chalega
  return null; 
}