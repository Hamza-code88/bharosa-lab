"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { LabItem, setActiveLabId } from '@/lib/activeLab';
import { Building2, ChevronDown, Check, ShieldCheck, UserCheck, PlusCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface LabSwitcherProps {
  currentLab: LabItem | null;
  allLabs: LabItem[];
  onLabSwitched?: (lab: LabItem) => void;
}

export default function LabSwitcher({ currentLab, allLabs, onLabSwitched }: LabSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!currentLab) return null;

  const hasMultipleLabs = allLabs.length > 1;
  const hasOwnedLab = allLabs.some((l) => l.user_role === 'owner');

  const handleSelectLab = (lab: LabItem) => {
    if (lab.id === currentLab.id) {
      setIsOpen(false);
      return;
    }

    setActiveLabId(lab.id);
    setIsOpen(false);
    toast.success(`Switched to ${lab.name}`, { icon: '🏥' });
    if (onLabSwitched) {
      onLabSwitched(lab);
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all bg-slate-50 hover:bg-slate-100 border border-slate-200 cursor-pointer shadow-xs"
        title="Click to switch between your laboratories"
      >
        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 flex-shrink-0">
          <Building2 size={18} />
        </div>

        <div className="flex flex-col min-w-0 pr-1">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-900 truncate max-w-[140px] sm:max-w-[190px]">
              {currentLab.name || 'My Lab'}
            </span>
            {currentLab.user_role === 'owner' ? (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                <ShieldCheck size={10} /> Owner
              </span>
            ) : (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                <UserCheck size={10} /> Staff
              </span>
            )}
          </div>
          {currentLab.city && (
            <span className="text-[11px] text-slate-500 truncate">
              {currentLab.city}
            </span>
          )}
        </div>

        {hasMultipleLabs ? (
          <span className="hidden sm:inline-block text-[10px] font-extrabold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-md ml-1">
            Switch
          </span>
        ) : null}

        <ChevronDown
          size={16}
          className={`text-slate-400 transition-transform duration-200 ml-0.5 ${
            isOpen ? 'transform rotate-180 text-blue-600' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 mt-2 w-80 rounded-2xl bg-white shadow-2xl border border-slate-100 ring-1 ring-black/5 z-50 py-2 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-1.5 border-b border-slate-100 mb-1 flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Your Laboratories ({allLabs.length})
            </p>
            {hasMultipleLabs && (
              <span className="text-[10px] text-blue-600 font-semibold">Click to switch</span>
            )}
          </div>

          <div className="max-h-60 overflow-y-auto space-y-0.5 px-1">
            {allLabs.map((lab) => {
              const isSelected = lab.id === currentLab.id;
              return (
                <button
                  key={lab.id}
                  onClick={() => handleSelectLab(lab)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-colors ${
                    isSelected ? 'bg-blue-50 text-blue-900 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Building2 size={15} />
                    </div>
                    <div className="truncate">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs truncate font-bold">{lab.name}</span>
                        {lab.user_role === 'owner' ? (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-extrabold flex items-center gap-0.5">
                            <ShieldCheck size={9} /> Owner
                          </span>
                        ) : (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-extrabold flex items-center gap-0.5">
                            <UserCheck size={9} /> Staff
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400">{lab.city || 'Pakistan'}</p>
                    </div>
                  </div>

                  {isSelected && <Check size={16} className="text-blue-600 flex-shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>

          {/* Option to create own lab if user does not own one yet */}
          {!hasOwnedLab && (
            <div className="pt-2 border-t border-slate-100 mt-2 px-1">
              <Link
                href="/dashboard/labprofile"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
              >
                <PlusCircle size={15} />
                <span>+ Register My Own Lab (Owner)</span>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
