import { Search, Bell, ShieldCheck } from 'lucide-react';
import { UserRole } from '../../types/lexguard';

interface TopBarProps {
  role: UserRole;
  setRole: (role: UserRole) => void;
}

export const TopBar = ({ role, setRole }: TopBarProps) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 fixed top-0 left-0 right-0 z-20">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-indigo-200 shadow-lg">
          <ShieldCheck className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-slate-900 tracking-tight leading-none">LexGuard AI</h1>
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Workspace</p>
        </div>
      </div>

      <div className="flex-1 max-w-xl mx-8">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search by ID, Vendor, or Risk..." 
            className="w-full bg-slate-50 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Role Switcher for Demo */}
        <div className="flex bg-slate-100 p-1 rounded-lg">
          {(['PAO', 'Auditor', 'Senior'] as UserRole[]).map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                role === r ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
          <div className="text-right hidden md:block">
            <p className="text-sm font-semibold text-slate-900">Alex Morgan</p>
            <p className="text-xs text-slate-500">{role}</p>
          </div>
          <div className="w-9 h-9 bg-indigo-50 rounded-full flex items-center justify-center border border-indigo-100 text-indigo-600 font-bold text-sm">
            AM
          </div>
        </div>
      </div>
    </header>
  );
};
