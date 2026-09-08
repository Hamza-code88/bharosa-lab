"use client";

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

export default function NotificationListener() {
  const [labId, setLabId] = useState<string | null>(null);
  const [labName, setLabName] = useState<string>('Partner Lab');
  const [showPermissionModal, setShowPermissionModal] = useState<boolean>(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const localAudioRef = useRef<HTMLAudioElement | null>(null);
  const isAudioUnlockedRef = useRef<boolean>(false);

  // 1. Web Audio API Loud Chime Synthesizer (Works 100% offline & without network latency)
  const playAlertSound = () => {
    try {
      // Method A: Native Web Audio API Synthesizer (Urgent Dual Chime)
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        if (!audioContextRef.current) {
          audioContextRef.current = new AudioCtx();
        }
        const ctx = audioContextRef.current;
        if (ctx.state === 'suspended') {
          ctx.resume();
        }

        const now = ctx.currentTime;
        const playTone = (freq: number, start: number, dur: number) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + start);
          gain.gain.setValueAtTime(0.5, now + start);
          gain.gain.exponentialRampToValueAtTime(0.01, now + start + dur);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + start);
          osc.stop(now + start + dur);
        };

        // Chime sequence: High Ding-Dong Ding-Dong
        playTone(784, 0, 0.25);    // G5
        playTone(1046, 0.2, 0.35);  // C6
        playTone(784, 0.5, 0.25);   // G5
        playTone(1175, 0.7, 0.45);  // D6
      }
    } catch (e) {
      console.warn("Web Audio chime error:", e);
    }

    // Method B: Local WAV sound file fallback
    try {
      if (!localAudioRef.current) {
        localAudioRef.current = new Audio('/sounds/order_alert.wav');
      }
      localAudioRef.current.currentTime = 0;
      localAudioRef.current.volume = 1.0;
      localAudioRef.current.play().catch((err) => {
        console.log("Local audio play note:", err);
      });
    } catch (err) {
      console.warn("Local audio fallback note:", err);
    }

    // Method C: Device Vibration (Supported on Android phones)
    try {
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([0, 500, 200, 500, 200, 800]);
      }
    } catch (e) {}
  };

  // 2. Unlock Audio on User Gesture
  const unlockAudioEngine = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        if (!audioContextRef.current) {
          audioContextRef.current = new AudioCtx();
        }
        if (audioContextRef.current.state === 'suspended') {
          audioContextRef.current.resume();
        }
      }

      if (!localAudioRef.current) {
        localAudioRef.current = new Audio('/sounds/order_alert.wav');
      }
      localAudioRef.current.load();

      isAudioUnlockedRef.current = true;
      if (typeof window !== 'undefined') {
        localStorage.setItem('bharosa_lab_sound_unlocked', 'true');
      }
    } catch (e) {
      console.warn("Audio unlock error:", e);
    }
  };

  // 3. Background Audio Unlock on First Touch
  useEffect(() => {
    const onFirstUserInteraction = () => {
      unlockAudioEngine();
    };

    window.addEventListener('click', onFirstUserInteraction, { once: true });
    window.addEventListener('touchstart', onFirstUserInteraction, { once: true });
    window.addEventListener('keydown', onFirstUserInteraction, { once: true });

    return () => {
      window.removeEventListener('click', onFirstUserInteraction);
      window.removeEventListener('touchstart', onFirstUserInteraction);
      window.removeEventListener('keydown', onFirstUserInteraction);
    };
  }, []);

  // 4. Force Activation Button Handler
  const handleEnableAlerts = async () => {
    // 1. Request Notification Permission
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        await Notification.requestPermission();
      } catch (e) {
        console.warn("Permission request error:", e);
      }
    }

    // 2. Unlock Audio & Play Confirmation Chime
    unlockAudioEngine();
    playAlertSound();

    // 3. Save State & Dismiss Modal permanently
    setShowPermissionModal(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('bharosa_lab_sound_unlocked', 'true');
      localStorage.setItem('bharosa_lab_alert_dismissed', 'true');
    }

    toast.success("Order Sound & Notifications Activated! 🔔", {
      duration: 4000,
      icon: '✅',
      style: {
        background: '#eff6ff',
        color: '#1e3a8a',
        border: '1px solid #bfdbfe'
      }
    });
  };

  // 4b. Dismiss Modal Handler (Remembers user choice so it doesn't bother them on refresh)
  const handleDismissModal = () => {
    setShowPermissionModal(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('bharosa_lab_alert_dismissed', 'true');
    }
  };

  // 5. Robust Lab ID Resolution (Automatic for both Existing & New Labs)
  useEffect(() => {
    const resolveLab = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: lab } = await supabase
            .from('labs')
            .select('id, name')
            .eq('owner_id', session.user.id)
            .maybeSingle();

          if (lab?.id) {
            setLabId(lab.id);
            if (lab.name) setLabName(lab.name);
          }
        }
      } catch (err) {
        console.warn("Error resolving lab for notifications:", err);
      }
    };

    resolveLab();

    // Dynamically tracks login/logout/session refresh
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        resolveLab();
      } else {
        setLabId(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // 5b. Show activation modal ONLY for logged-in labs who haven't enabled or dismissed it yet
  useEffect(() => {
    if (!labId) return;
    if (typeof window === 'undefined') return;

    const isDismissed = localStorage.getItem('bharosa_lab_alert_dismissed') === 'true';
    const isSoundUnlocked = localStorage.getItem('bharosa_lab_sound_unlocked') === 'true';

    // If already enabled or dismissed, do NOT show
    if (isDismissed || isSoundUnlocked) {
      return;
    }

    const timer = setTimeout(() => {
      setShowPermissionModal(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, [labId]);

  // 6. Realtime Booking Alerts Listener
  useEffect(() => {
    if (!labId) return;

    const channel = supabase
      .channel(`lab-orders-${labId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bookings',
          filter: `lab_id=eq.${labId}`
        },
        (payload: any) => {
          const newOrder = payload.new;
          if (!newOrder) return;

          // 1. 🔊 Play Alert Sound & Vibration Immediately
          playAlertSound();

          // 2. 📱 Show Native Android OS Notification if permitted
          if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
            try {
              new Notification('🚨 NAYA ORDER AAGAYA!', {
                body: `Patient: ${newOrder.patient_name || 'Patient'} • Rs. ${newOrder.total_amount || 0}\nTap to view details`,
                icon: '/favicon.ico',
                tag: `booking-${newOrder.id}`
              });
            } catch (notifErr) {
              console.warn("Native notification display note:", notifErr);
            }
          }

          // 3. 🔔 In-App High-Visibility Toast Popup Alert
          toast.success(
            (t) => (
              <div 
                onClick={() => {
                  toast.dismiss(t.id);
                  if (typeof window !== 'undefined') {
                    window.location.href = '/dashboard/bookings';
                  }
                }}
                className="cursor-pointer"
              >
                <div className="font-extrabold text-blue-900 text-sm flex items-center gap-1.5">
                  <span>🚨</span> NAYA TEST ORDER AAGAYA!
                </div>
                <div className="text-xs text-blue-800 mt-1">
                  <span className="font-bold">{newOrder.patient_name || 'Patient'}</span> • Rs. {newOrder.total_amount || 0}
                </div>
                <div className="text-[10px] text-blue-600 mt-0.5">
                  Tap to open Bookings tab
                </div>
              </div>
            ),
            {
              duration: 8000,
              icon: '🔔',
              style: {
                background: '#eff6ff',
                color: '#1e3a8a',
                border: '2px solid #3b82f6',
                boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.3)',
                padding: '12px 16px',
                borderRadius: '16px'
              }
            }
          );
        }
      )
      .subscribe();

    // 7. Visibility Change Auto-Reconnection (When lab admin unlocks phone / re-opens app)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
          audioContextRef.current.resume().catch(() => {});
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      supabase.removeChannel(channel);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [labId]);

  return (
    <>
      {/* Force Activation Popup for Mobile PWA & Desktop */}
      {showPermissionModal && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 sm:p-7 shadow-2xl border border-gray-100 flex flex-col items-center text-center">
            
            {/* Animated Pulse Bell Icon */}
            <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-3xl mb-4 shadow-inner relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-20"></span>
              🔔
            </div>

            <h3 className="text-lg font-black text-gray-900 mb-5">
              Enable Order Ringtone
            </h3>

            <button
              type="button"
              onClick={handleEnableAlerts}
              className="w-full py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition active:scale-95"
            >
              <span>🔔 Enable Order Ringtone</span>
            </button>

            <button
              type="button"
              onClick={handleDismissModal}
              className="mt-3 text-xs text-gray-400 hover:text-gray-600 font-semibold py-1.5 transition cursor-pointer"
            >
              I will enable later
            </button>

          </div>
        </div>
      )}
    </>
  );
}