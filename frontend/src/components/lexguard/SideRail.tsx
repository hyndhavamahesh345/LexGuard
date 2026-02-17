import { LayoutGrid, FileText, History, Settings, Scale } from 'lucide-react';
import { cn } from '../../lib/utils';

export const SideRail = () => {
  const items = [
    { icon: LayoutGrid, label: 'Workspace', active: true },
    { icon: Scale, label: 'Laws', active: false },
    { icon: FileText, label: 'Reports', active: false },
    { icon: History, label: 'History', active: false },
  ];

  return (
    <div className="w-16 bg-slate-900 h-screen fixed left-0 top-0 flex flex-col items-center py-20 z-10">
      <div className="flex-1 space-y-8 w-full">
        {items.map((item, idx) => (
          <button 
            key={idx}
            className={cn(
              "w-full flex flex-col items-center gap-1 group relative py-2",
              item.active ? "text-indigo-400" : "text-slate-500 hover:text-slate-300"
            )}
          >
            {item.active && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-r-full" />
            )}
            <item.icon className="w-6 h-6 transition-transform group-hover:scale-110" />
            <span className="text-[9px] font-medium opacity-0 group-hover:opacity-100 absolute left-14 bg-slate-800 text-white px-2 py-1 rounded transition-opacity whitespace-nowrap z-50">
              {item.label}
            </span>
          </button>
        ))}
      </div>
      <button className="text-slate-600 hover:text-slate-400 mb-6">
        <Settings className="w-6 h-6" />
      </button>
    </div>
  );
};
