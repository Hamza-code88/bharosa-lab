"use client";

import React, { useState, useEffect } from 'react';
import { Download, X, Laptop, Smartphone, Sparkles, CheckCircle2, Building2 } from 'lucide-react';

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    // 1. Check if already running in standalone PWA mode
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // 2. Check if iOS Safari
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // 3. Check dismissal timestamp (suppress for 3 days if dismissed)
    const dismissedAt = localStorage.getItem('bharosa_lab_pwa_dismissed_at');
    const threeDaysMs = 3 * 24 * 60 * 60 * 1000;
    const isRecentlyDismissed = dismissedAt && Date.now() - parseInt(dismissedAt, 10) < threeDaysMs;

    // 4. Capture beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!isRecentlyDismissed) {
        setTimeout(() => {
          setShowPrompt(true);
        }, 1500);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 5. Handle successful installation
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    if (isIosDevice && !isRecentlyDismissed && !isStandalone) {
      setTimeout(() => {
        setShowPrompt(true);
      }, 2000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSGuide(true);
      return;
    }

    if (!deferredPrompt) {
      alert("To install, click the Install icon in your browser address bar.");
      return;
    }

    deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;
    if (choiceResult.outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    localStorage.setItem('bharosa_lab_pwa_dismissed_at', Date.now().toString());
    setShowPrompt(false);
    setShowIOSGuide(false);
  };

  if (isInstalled || !showPrompt) return null;

  return (
    <aside aria-label="Install Lab Portal Application" className="fixed bottom-4 right-4 z-50 max-w-sm sm:max-w-md w-[calc(100%-2rem)] bg-white rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-teal-500/30 p-4 sm:p-5 animate-in fade-in slide-in-from-bottom-6 duration-300">
      
      {/* Close button */}
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100 transition-colors"
        title="Dismiss"
      >
        <X size={18} />
      </button>

      <div className="flex items-start gap-3.5 pr-6">
        {/* App Icon / Graphic */}
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#1E3A5F] to-teal-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-teal-500/20">
          <Building2 className="w-6 h-6" />
        </div>

        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-teal-50 text-teal-700 px-2 py-0.5 rounded-md border border-teal-100">
              Lab SaaS Desktop & Mobile App
            </span>
          </div>
          <h4 className="text-sm sm:text-base font-bold text-gray-900 leading-tight">
            Install Lab Portal App
          </h4>
          <p className="text-xs text-gray-500 leading-relaxed">
            Install on your PC or mobile for instant order sound alerts, offline report management, and 1-click dashboard access.
          </p>
        </div>
      </div>

      {/* iOS Safari Guide (if user on iPhone/iPad) */}
      {showIOSGuide && (
        <div className="mt-3.5 p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 space-y-1.5">
          <p className="font-bold">How to install on iOS Safari:</p>
          <p className="text-[11px]">1. Tap the <strong>Share</strong> icon at bottom of Safari.</p>
          <p className="text-[11px]">2. Tap <strong>&quot;Add to Home Screen&quot;</strong>.</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
        <button
          onClick={handleDismiss}
          className="flex-1 py-2.5 px-3 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors text-center cursor-pointer"
        >
          Maybe Later
        </button>
        <button
          onClick={handleInstallClick}
          className="flex-1 py-2.5 px-4 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-all shadow-md shadow-teal-600/25 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
        >
          <Download size={14} />
          <span>Install Lab Portal</span>
        </button>
      </div>

    </aside>
  );
}
