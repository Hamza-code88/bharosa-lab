"use client";

import React, { useState, useRef, useEffect } from 'react';
import { LabItem, setActiveLabId } from '@/lib/activeLab';
import { Building2, ChevronDown, Check, ShieldCheck, UserCheck } from 'lucide-react';
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
        onClick={() => hasMultipleLabs && setIsOpen(!isOpen)}
        type="button"
        disabled={!hasMultipleLabs}
        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all ${
          hasMultipleLabs
            ? 'bg-slate-50 hover:bg-slate-100 border border-slate-200 cursor-pointer shadow-sm'
            : 'bg-transparent border border-transparent cursor-default'
        }`}
      >
        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 flex-shrink-0">
          <Building2 size={18} />
        </div>

        <div className="flex flex-col min-w-0 pr-1">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-900 truncate max-w-[150px] sm:max-w-[200px]">
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

        {hasMultipleLabs && (
          <ChevronDown
            size={16}
            className={`text-slate-400 transition-transform duration-200 ml-1 ${
              isOpen ? 'transform rotate-180 text-blue-600' : ''
            }`}
          />
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && hasMultipleLabs && (
        <div className="absolute left-0 mt-2 w-72 rounded-2xl bg-white shadow-2xl border border-slate-100 ring-1 ring-black/5 z-50 py-2 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-1.5 border-b border-slate-100 mb-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Switch Laboratory ({allLabs.length})
            </p>
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
                        <span className="text-xs truncate">{lab.name}</span>
                        {lab.user_role === 'owner' ? (
                          <span className="text-[9px] px-1 rounded bg-amber-100 text-amber-800 font-bold">
                            Owner
                          </span>
                        ) : (
                          <span className="text-[9px] px-1 rounded bg-emerald-100 text-emerald-800 font-bold">
                            Staff
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
        </div>
      )}
    </div>
  );
}
