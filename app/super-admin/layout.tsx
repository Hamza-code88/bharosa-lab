// app/super-admin/layout.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Megaphone, Bike, ShieldAlert, PhoneCall, CreditCard } from 'lucide-react';

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: 'All Data (Analytics)', href: '/super-admin/dashboard', icon: LayoutDashboard },
    { name: 'Ad Manager', href: '/super-admin/ads', icon: Megaphone },
    { name: 'Rider Management', href: '/super-admin/riders', icon: Bike },
    { name: 'Support Settings', href: '/super-admin/support', icon: PhoneCall },
    // 🛑 NAYA LINK ADD KIYA HAI
    { name: 'Billing & Approvals', href: '/super-admin/billing', icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex">
        <div className="h-20 flex items-center px-6 border-b border-gray-100">
          <ShieldAlert className="text-blue-600 mr-2" size={28} />
          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Super<span className="text-blue-600">Admin</span></h2>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link key={item.name} href={item.href} 
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all ${
                  isActive ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-white' : 'text-gray-400'} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}