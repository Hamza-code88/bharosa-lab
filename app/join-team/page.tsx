"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { setActiveLabId, getUserAuthorizedLabs } from '@/lib/activeLab';
import logo from '../../public/logo.png';
import { 
  Building2, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  AlertCircle, 
  Loader2, 
  LogOut, 
  Sparkles,
  MapPin,
  Users
} from 'lucide-react';
import toast from 'react-hot-toast';

function JoinTeamContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code');

  const [lab, setLab] = useState<any | null>(null);
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [existingLabs, setExistingLabs] = useState<any[]>([]);
  const [isAlreadyMember, setIsAlreadyMember] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!code) {
      setErrorMsg('No invite code provided in the URL.');
      setIsLoading(false);
      return;
    }
    loadInviteDetails();
  }, [code]);

  const loadInviteDetails = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      // 1. Fetch Lab from invite_code
      const { data: matchedLab, error: labErr } = await supabase
        .from('labs')
        .select('id, name, city, logo_url, is_active, owner_id')
        .eq('invite_code', code?.trim())
        .maybeSingle();

      if (labErr || !matchedLab) {
        setErrorMsg('Invalid or expired invitation link. Please request a new link from your lab owner.');
        setIsLoading(false);
        return;
      }

      setLab(matchedLab);

      // 2. Check current session
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setCurrentUser(session.user);

        // Check if user is already a member of this lab
        const { data: staffRecord } = await supabase
          .from('lab_staff')
          .select('id, status')
          .eq('lab_id', matchedLab.id)
          .eq('user_id', session.user.id)
          .maybeSingle();

        const isOwner = session.user.id === matchedLab.owner_id;
        if (isOwner || (staffRecord && staffRecord.status === 'active')) {
          setIsAlreadyMember(true);
        }

        // Fetch other authorized labs this user has
        const userLabs = await getUserAuthorizedLabs(session.user.id);
        setExistingLabs(userLabs.filter((l) => l.id !== matchedLab.id));
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Error verifying invite link: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsSubmitting(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.href, // Redirects back to this exact invite URL after Google login
        },
      });
      if (error) {
        toast.error('Google login failed: ' + error.message);
        setIsSubmitting(false);
      }
    } catch (e: any) {
      toast.error('Login error: ' + e.message);
      setIsSubmitting(false);
    }
  };

  const handleAcceptInvite = async () => {
    if (!currentUser || !lab) return;

    setIsSubmitting(true);
    try {
      const staffName = currentUser.user_metadata?.full_name || currentUser.user_metadata?.name || currentUser.email?.split('@')[0];

      // Upsert into lab_staff
      const { error } = await supabase
        .from('lab_staff')
        .upsert(
          {
            lab_id: lab.id,
            user_id: currentUser.id,
            email: currentUser.email,
            name: staffName,
            role: 'staff',
            status: 'active',
          },
          { onConflict: 'lab_id,user_id' }
        );

      if (error) throw error;

      // Set active lab in storage
      setActiveLabId(lab.id);
      toast.success(`Welcome to ${lab.name} staff team! 🎉`, { duration: 4000 });
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Accept invite error:', err);
      toast.error('Failed to accept invite: ' + err.message);
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-3" />
        <p className="text-sm font-semibold text-slate-600">Verifying Laboratory Invitation...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50/30 flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8 font-sans">
      
      {/* Top Header */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src={logo} alt="Bharosa Lab" width={40} height={40} className="object-contain" />
          <span className="font-black text-lg text-slate-900 tracking-tight">
            Bharosa <span className="text-blue-600">Lab</span>
          </span>
        </Link>
      </div>

      {/* Main Card */}
      <div className="max-w-md w-full mx-auto my-8">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-7 sm:p-9 relative overflow-hidden">
          
          {errorMsg ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                <AlertCircle size={28} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Invalid Invitation Link</h2>
              <p className="text-sm text-slate-500 leading-relaxed">{errorMsg}</p>
              <div className="pt-2">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                <Sparkles size={14} className="text-blue-600" />
                Staff Team Invitation
              </div>

              {/* Lab Info */}
              <div className="space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-blue-500/20">
                  <Building2 size={28} />
                </div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  Join {lab?.name}
                </h1>
                {lab?.city && (
                  <p className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                    <MapPin size={13} className="text-blue-600" /> {lab.city}, Pakistan
                  </p>
                )}
              </div>

              {/* Scope & Permissions List */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2.5">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Your Staff Access Includes:
                </p>
                <div className="space-y-2 text-xs font-medium text-slate-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-emerald-600 flex-shrink-0" />
                    <span>Manage patient test orders & sample reports</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-emerald-600 flex-shrink-0" />
                    <span>Add new diagnostic tests & edit catalog prices</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-emerald-600 flex-shrink-0" />
                    <span>Update lab profile, address & operating hours</span>
                  </div>
                </div>
              </div>

              {/* Multi-Lab Notice (if user already in other labs) */}
              {existingLabs.length > 0 && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    💡 Multi-Lab Account Detected
                  </p>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    You already have access to <strong>{existingLabs.map((l) => l.name).join(', ')}</strong>. Accepting this invite will add <strong>{lab?.name}</strong> to your account. You can switch between laboratories anytime from the top bar dropdown!
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2">
                {!currentUser ? (
                  // STATE 1: User needs to login with Google
                  <button
                    onClick={handleGoogleLogin}
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-sm hover:bg-slate-50 transition active:scale-95 shadow-sm cursor-pointer"
                  >
                    {isSubmitting ? (
                      <Loader2 size={18} className="animate-spin text-blue-600" />
                    ) : (
                      <>
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                          />
                        </svg>
                        <span>Sign In with Google to Accept</span>
                      </>
                    )}
                  </button>
                ) : isAlreadyMember ? (
                  // STATE 2: User is already a member
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
                      <span>You are already a member of this laboratory!</span>
                    </div>
                    <button
                      onClick={() => {
                        setActiveLabId(lab.id);
                        router.push('/dashboard');
                      }}
                      className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition active:scale-95 shadow-md shadow-blue-500/20 cursor-pointer"
                    >
                      <span>Open Lab Dashboard</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                ) : (
                  // STATE 3: User logged in, ready to accept
                  <div className="space-y-3">
                    <p className="text-xs text-slate-500 text-center">
                      Logged in as <strong>{currentUser.email}</strong>
                    </p>
                    <button
                      onClick={handleAcceptInvite}
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition active:scale-95 shadow-md shadow-blue-500/20 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <>
                          <span>Accept Invitation & Enter Lab</span>
                          <ArrowRight size={16} />
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Bharosa Healthcare. All Rights Reserved.
      </div>
    </div>
  );
}

export default function JoinTeamPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      }
    >
      <JoinTeamContent />
    </Suspense>
  );
}
