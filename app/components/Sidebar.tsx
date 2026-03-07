"use client"; 
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image'; 
import { usePathname } from 'next/navigation';
import { LayoutDashboard, TestTube, ClipboardList, Settings, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import logo from '../../public/logo.png'; 

export default function Sidebar() {
  const pathname = usePathname(); 
  
  // 🛑 NAYA: Sidebar ko collapse/expand karne ke liye state
  const [isCollapsed, setIsCollapsed] = useState(false);

  // 🛑 NAYA: Screen size check karne ke liye (Responsive Design)
  useEffect(() => {
    const handleResize = () => {
      // Agar screen choti hai (Tablet/Mobile) toh auto-collapse kar do
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };
    
    handleResize(); // Pehli baar load hone par check karega
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    { name: 'Test Orders', href: '/dashboard/bookings', icon: ClipboardList }, 
    { name: 'Analytics', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Tests & Prices', href: '/dashboard/tests', icon: TestTube },
    { name: 'Lab Profile', href: '/dashboard/labprofile', icon: Settings },
  
  ];

  return (
    // Width ab state ke hisaab se change hogi (w-64 ya w-20)
    <aside className={`bg-white border-r border-gray-100 flex flex-col shadow-sm z-20 transition-all duration-300 relative ${isCollapsed ? 'w-20' : 'w-64'}`}>
      
      {/* 🛑 NAYA: Collapse/Expand Button */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-10 bg-blue-600 text-white p-1 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50 flex items-center justify-center"
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* Logo Area */}
      <div className={`pt-6 pb-2 min-h-[100px] flex items-center justify-center overflow-hidden transition-all duration-300 ${isCollapsed ? 'px-2' : 'px-4'}`}>
        {isCollapsed ? (
          // Jab sidebar band ho toh sirf icon dikhaye taake layout kharab na ho
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100 mt-2">
            <span className="text-2xl font-black text-blue-600">B</span>
          </div>
        ) : (
          // 🛑 FIX: Aapka Original Logo Code (Isko bilkul nahi chhera)
          <div className="flex flex-col items-center justify-center">
            <Image 
              src={logo} 
              alt="بھروسہ لیب" 
              width={200} 
              className="object-contain" 
              priority 
            />
            <h1 className='text-xl font-extrabold text-blue-600 -mt-4'>
              Bharosa Lab
            </h1>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto overflow-x-hidden scrollbar-hide">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link 
              key={item.name} 
              href={item.href} 
              title={isCollapsed ? item.name : ""} // Jab chota ho toh hover par naam dikhaye
              className={`flex items-center rounded-xl font-semibold transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-50 text-blue-700 shadow-sm' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900' 
              } ${isCollapsed ? 'justify-center p-3' : 'px-4 py-3.5'}`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-400'} ${isCollapsed ? '' : 'mr-3'}`} />
              
              {/* Text sirf tab dikhaye jab sidebar open ho */}
              {!isCollapsed && <span className="truncate">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-100">
        <button 
          title={isCollapsed ? "Logout" : ""}
          className={`flex items-center text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl font-semibold transition-colors ${isCollapsed ? 'justify-center p-3 w-full' : 'px-4 py-3.5 w-full'}`}
        >
          <LogOut className={`w-5 h-5 flex-shrink-0 ${isCollapsed ? '' : 'mr-3'}`} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}