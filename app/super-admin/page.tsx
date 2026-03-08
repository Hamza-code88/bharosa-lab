"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert, Lock, User, Loader2 } from 'lucide-react';
import { loginSuperAdmin } from './actions'; // Jo file abhi banayi

export default function SuperAdminLogin() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const result = await loginSuperAdmin(formData);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      // Login successful! Dashboard par bhejen
      router.push('/super-admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B1120] font-sans selection:bg-blue-500 selection:text-white">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[32px] shadow-2xl relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-blue-600/20 border border-blue-500/30 rounded-2xl flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(37,99,235,0.3)]">
            <ShieldAlert className="text-blue-500 w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">System Core Access</h1>
          <p className="text-gray-400 text-sm mt-1">Super Admin Authentication</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm font-bold p-4 rounded-xl mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Master Username</label>
            <div className="relative">
              <User className="absolute left-4 top-3.5 text-gray-500 w-5 h-5" />
              <input 
                name="username"
                type="text" 
                required
                className="w-full bg-white/5 border border-white/10 text-white rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-600 font-medium"
                placeholder="Enter root ID"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Security Key</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-gray-500 w-5 h-5" />
              <input 
                name="password"
                type="password" 
                required
                className="w-full bg-white/5 border border-white/10 text-white rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-600 font-medium"
                placeholder="••••••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 px-4 rounded-xl mt-4 transition-all flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.4)] disabled:opacity-70"
          >
            {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Authorize Access'}
          </button>
        </form>
      </div>
    </div>
  );
}