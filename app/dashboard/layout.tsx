import Sidebar from '../components/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      
      {/* 1. Componentized Sidebar */}
      <Sidebar />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* 🛑 FIX: Clean & Professional Header (Fake data hata diya) */}
        <header className="h-[72px] bg-white border-b border-gray-100 flex items-center justify-between px-8 shadow-sm z-0">
          <h1 className="text-xl font-extrabold text-gray-800 tracking-tight">Partner Portal</h1>
          
          {/* System Online Status */}
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-sm font-bold text-gray-600 tracking-wide uppercase">System Online</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}