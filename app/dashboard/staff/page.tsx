"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { resolveActiveLab, ensureLabInviteCode, LabItem, LAB_CHANGED_EVENT } from '@/lib/activeLab';
import { 
  Users, 
  Copy, 
  Check, 
  Share2, 
  RefreshCw, 
  Trash2, 
  ShieldCheck, 
  UserCheck, 
  Loader2, 
  AlertCircle,
  Building2,
  Mail,
  Calendar,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';

interface StaffMember {
  id: string;
  user_id: string;
  name: string | null;
  email: string;
  role: string;
  status: string;
  created_at: string;
}

export default function StaffManagerPage() {
  const [lab, setLab] = useState<LabItem | null>(null);
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [inviteCode, setInviteCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const inviteLink = inviteCode ? `${origin}/join-team?code=${inviteCode}` : '';

  useEffect(() => {
    loadLabAndStaff();

    // Listen for lab changes from LabSwitcher
    const handleLabChange = () => {
      loadLabAndStaff();
    };
    window.addEventListener(LAB_CHANGED_EVENT, handleLabChange);
    return () => window.removeEventListener(LAB_CHANGED_EVENT, handleLabChange);
  }, []);

  const loadLabAndStaff = async () => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const { activeLab } = await resolveActiveLab(session.user.id);
      if (!activeLab) {
        setIsLoading(false);
        return;
      }
      setLab(activeLab);

      // Only owner can generate/see invite codes
      if (activeLab.user_role === 'owner') {
        const code = await ensureLabInviteCode(activeLab.id);
        setInviteCode(code);
      }

      // Fetch Staff Members for this lab
      const { data: staff, error: staffErr } = await supabase
        .from('lab_staff')
        .select('*')
        .eq('lab_id', activeLab.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (!staffErr && staff) {
        setStaffList(staff);
      }
    } catch (e) {
      console.error('Error loading staff:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (!inviteLink) return;
    navigator.clipboard.writeText(inviteLink);
    setIsCopied(true);
    toast.success('Invite link copied to clipboard!', { icon: '📋' });
    setTimeout(() => setIsCopied(false), 3000);
  };

  const handleShareWhatsApp = () => {
    if (!inviteLink || !lab) return;
    const message = encodeURIComponent(
      `Assalam-o-Alaikum! You are invited to join the staff team of *${lab.name}* on Bharosa Lab Portal.\n\nClick the link to accept invite:\n${inviteLink}`
    );
    window.open(`https://api.whatsapp.com/send?text=${message}`, '_blank');
  };

  const handleRegenerateCode = async () => {
    if (!lab || lab.user_role !== 'owner') return;
    if (!confirm('Are you sure you want to regenerate the invite link? The previous invite link will stop working.')) {
      return;
    }

    setIsRegenerating(true);
    try {
      const newCode = 'BL-' + Math.random().toString(36).substring(2, 8).toUpperCase();
      const { error } = await supabase
        .from('labs')
        .update({ invite_code: newCode })
        .eq('id', lab.id);

      if (error) throw error;
      setInviteCode(newCode);
      toast.success('New invite link generated!', { icon: '🔄' });
    } catch (err: any) {
      toast.error('Failed to regenerate: ' + err.message);
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleRevokeStaff = async (staffId: string, staffName: string) => {
    if (!confirm(`Are you sure you want to remove ${staffName || 'this staff member'}? They will immediately lose access to this laboratory.`)) {
      return;
    }

    setRemovingId(staffId);
    try {
      const { error } = await supabase
        .from('lab_staff')
        .delete()
        .eq('id', staffId);

      if (error) throw error;
      setStaffList((prev) => prev.filter((s) => s.id !== staffId));
      toast.success('Staff access revoked successfully.');
    } catch (err: any) {
      toast.error('Failed to revoke: ' + err.message);
    } finally {
      setRemovingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!lab) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-100 shadow-sm">
        <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-800">No Active Laboratory Found</h2>
        <p className="text-sm text-slate-500 mt-1">Please create or activate a laboratory first.</p>
      </div>
    );
  }

  const isOwner = lab.user_role === 'owner';

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Banner / Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Staff & Team Management</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
              {lab.name}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Grant secure portal access to receptionists, technicians, and managers without sharing your personal Google credentials.
          </p>
        </div>
      </div>

      {/* SECTION 1: Invite Link Card (Only for Owner) */}
      {isOwner ? (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white p-6 sm:p-8 shadow-xl shadow-blue-500/10">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-60 h-60 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-blue-100 border border-white/20">
              <Sparkles size={14} className="text-yellow-300" />
              1-Click Instant Staff Invite Link
            </div>

            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Share This Link with Your Lab Staff
            </h2>

            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
              Anyone with this link can join <strong>{lab.name}</strong> as staff. They will be able to manage patient test orders, edit test catalog prices, and update profile details. Your financial billing remains protected.
            </p>

            {/* Link Box */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-2">
              <div className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 text-xs sm:text-sm font-mono truncate text-white select-all">
                {inviteLink || 'Generating invite link...'}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyLink}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-blue-700 font-bold text-xs sm:text-sm hover:bg-blue-50 transition active:scale-95 shadow-md shadow-black/10 cursor-pointer"
                >
                  {isCopied ? (
                    <>
                      <Check size={16} className="text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleShareWhatsApp}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm transition active:scale-95 shadow-md shadow-emerald-500/20 cursor-pointer"
                  title="Share on WhatsApp"
                >
                  <Share2 size={16} />
                  <span className="hidden sm:inline">WhatsApp</span>
                </button>

                <button
                  onClick={handleRegenerateCode}
                  disabled={isRegenerating}
                  className="p-3 rounded-xl bg-white/15 hover:bg-white/25 text-white transition active:scale-95 border border-white/20 cursor-pointer"
                  title="Regenerate invite code (invalidates previous link)"
                >
                  <RefreshCw size={16} className={isRegenerating ? 'animate-spin' : ''} />
                </button>
              </div>
            </div>

            <p className="text-[11px] text-blue-200/80 pt-1">
              💡 Tip: If an employee leaves, you can either revoke their access below or click the reset button to generate a new invite link.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-slate-600 leading-relaxed">
            You are currently logged in as a <strong>Staff Member</strong> of {lab.name}. You have full access to manage tests, update pricing, and handle bookings. Staff invitation links are managed exclusively by the Lab Owner.
          </div>
        </div>
      )}

      {/* SECTION 2: Active Staff Members Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Active Team Members</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              People who have access to manage this laboratory ({staffList.length + 1} total members)
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
            {staffList.length} Staff
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {/* Owner Row (Fixed) */}
          <div className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50/50 transition">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-black text-sm flex-shrink-0">
                👑
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900 truncate">
                    Laboratory Primary Owner
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                    Owner (Full Control)
                  </span>
                </div>
                <p className="text-xs text-slate-500 truncate flex items-center gap-1.5 mt-0.5">
                  <Building2 size={13} /> {lab.name}
                </p>
              </div>
            </div>

            <span className="text-xs font-semibold text-slate-400">Master Account</span>
          </div>

          {/* Staff Members List */}
          {staffList.length === 0 ? (
            <div className="p-10 text-center space-y-2">
              <Users className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-700">No Staff Members Joined Yet</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Share your invite link above with your laboratory staff. Once they click and accept, they will automatically appear here.
              </p>
            </div>
          ) : (
            staffList.map((member) => (
              <div
                key={member.id}
                className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50/50 transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {member.name ? member.name.charAt(0).toUpperCase() : member.email.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 truncate">
                        {member.name || 'Staff Member'}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 capitalize">
                        {member.role || 'Staff'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5 truncate">
                      <span className="flex items-center gap-1">
                        <Mail size={12} /> {member.email}
                      </span>
                      <span className="hidden sm:flex items-center gap-1 text-slate-400">
                        <Calendar size={12} /> Joined {new Date(member.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Revoke button (Only for Owner) */}
                {isOwner && (
                  <button
                    onClick={() => handleRevokeStaff(member.id, member.name || member.email)}
                    disabled={removingId === member.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-red-600 hover:bg-red-50 transition border border-red-200 cursor-pointer"
                    title="Revoke access"
                  >
                    {removingId === member.id ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <Trash2 size={13} />
                    )}
                    <span className="hidden sm:inline">Remove</span>
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
