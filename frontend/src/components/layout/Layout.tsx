import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Menu, Scale } from 'lucide-react';
import { useState } from 'react';

export const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Sidebar />
      
      {/* Mobile Header */}
      <div className="md:hidden bg-slate-950 text-white p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="font-bold text-lg flex items-center gap-2">
           <div className="w-6 h-6 bg-emerald-600 rounded-sm flex items-center justify-center">
             <Scale className="w-4 h-4 text-white" />
           </div>
           RegulAIte
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <main className="md:ml-64 min-h-screen p-6 md:p-10 max-w-7xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
};
