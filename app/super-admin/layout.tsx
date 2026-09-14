// app/super-admin/layout.tsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Megaphone, Bike, ShieldAlert, PhoneCall, CreditCard, FileText, Settings, Menu, X, Package } from 'lucide-react';

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { name: 'All Data (Analytics)', href: '/super-admin/dashboard', icon: LayoutDashboard },
    { name: 'Health Packages', href: '/super-admin/packages', icon: Package },
    { name: 'Orders Management', href: '/super-admin/orders', icon: FileText },
    { name: 'Ad Manager', href: '/super-admin/ads', icon: Megaphone },
    { name: 'Rider Management', href: '/super-admin/riders', icon: Bike },
    { name: 'Support Settings', href: '/super-admin/support', icon: PhoneCall },
    { name: 'Registration Approvals', href: '/super-admin/registrations', icon: ShieldAlert },
    { name: 'Billing & Commissions', href: '/super-admin/billing', icon: CreditCard },
    { name: 'Platform Settings', href: '/super-admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans overflow-hidden">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="h-20 flex items-center justify-between px-6 border-b border-gray-100 shrink-0">
          <div className="flex items-center">
            <ShieldAlert className="text-blue-600 mr-2" size={28} />
            <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Super<span className="text-blue-600">Admin</span></h2>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link key={item.name} href={item.href} 
                onClick={() => setIsSidebarOpen(false)}
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
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto relative">
        {/* Mobile Header Toggle */}
        <div className="md:hidden sticky top-0 z-30 flex items-center justify-between bg-white/90 backdrop-blur-md border-b border-gray-200 px-4 py-4 shrink-0">
          <div className="flex items-center gap-2">
            <ShieldAlert className="text-blue-600" size={24} />
            <h2 className="text-lg font-extrabold text-gray-900">Super<span className="text-blue-600">Admin</span></h2>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
          >
            <Menu size={20} />
          </button>
        </div>

        {children}
      </main>
    </div>
  );
}