import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileInput, ShieldAlert, Settings, LogOut, Scale } from 'lucide-react';
import { cn } from '../../lib/utils';

export const Sidebar = () => {
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: FileInput, label: 'New Transaction', path: '/transaction' },
    { icon: ShieldAlert, label: 'Risk Summary', path: '/risk' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-slate-950 text-slate-300 h-screen fixed left-0 top-0 border-r border-slate-800">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3 text-white font-bold text-xl tracking-tight">
          <div className="w-8 h-8 bg-emerald-600 rounded-sm flex items-center justify-center">
            <Scale className="w-5 h-5 text-white" />
          </div>
          RegulAIte
        </div>
        <p className="text-[10px] uppercase tracking-wider text-slate-500 mt-2 font-semibold">
          Enterprise Compliance
        </p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-all duration-200",
              isActive 
                ? "bg-slate-800 text-emerald-400 border-l-2 border-emerald-500" 
                : "hover:bg-slate-900 hover:text-white border-l-2 border-transparent"
            )}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 space-y-1">
        <button className="flex w-full items-center gap-3 px-4 py-3 rounded-md text-sm font-medium hover:bg-slate-900 hover:text-white transition-colors">
          <Settings className="w-4 h-4" />
          System Settings
        </button>
        <button className="flex w-full items-center gap-3 px-4 py-3 rounded-md text-sm font-medium text-slate-400 hover:text-rose-400 transition-colors">
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};
