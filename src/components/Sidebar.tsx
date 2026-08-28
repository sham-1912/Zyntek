import React from 'react';
import { LayoutGrid, FileText, Cpu, Clock, Plus } from 'lucide-react';

interface SidebarProps {
  activeTab: 'swap' | 'dashboard' | 'intents' | 'solvers' | 'result' | 'activity';
  onSelectTab: (tab: 'swap' | 'dashboard' | 'intents' | 'solvers' | 'result' | 'activity') => void;
  pendingIntentsCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab, pendingIntentsCount = 0 }) => {
  const navItems = [
    {
      id: 'dashboard' as const,
      label: 'Dashboard',
      icon: LayoutGrid,
    },
    {
      id: 'intents' as const,
      label: 'My Intents',
      icon: FileText,
      badge: pendingIntentsCount > 0 ? pendingIntentsCount : undefined,
    },
    {
      id: 'solvers' as const,
      label: 'Solvers',
      icon: Cpu,
    },
    {
      id: 'activity' as const,
      label: 'Activity',
      icon: Clock,
    },
  ];

  return (
    <aside className="w-20 md:w-24 shrink-0 bg-[#FAF8F5] border-r border-[#E8E4DA] flex flex-col items-center justify-between py-6 min-h-[calc(100vh-4rem)]">
      
      {/* Navigation Items */}
      <div className="flex flex-col items-center gap-6 w-full px-2">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={`${item.id}-${index}`}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex flex-col items-center gap-1.5 py-2.5 px-1 rounded-xl transition-all group ${
                isActive
                  ? 'bg-white border border-[#E8E4DA] text-[#1A1915] shadow-xs'
                  : 'text-[#7A7568] hover:text-[#1A1915] hover:bg-[#F5F2EA]'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform group-hover:scale-105 ${
                  isActive ? 'text-[#C69214]' : 'text-[#7A7568]'
                }`} />
                {item.badge && (
                  <span className="absolute -top-1.5 -right-2 px-1.5 py-0.2 rounded-full bg-[#C69214] text-white text-[9px] font-mono font-bold">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[11px] font-medium tracking-tight text-center ${
                isActive ? 'font-semibold text-[#1A1915]' : 'text-[#7A7568]'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Floating Gold "+" Action Button (Create Intent Page /Swap) */}
      <button
        type="button"
        onClick={() => onSelectTab('swap')}
        className="w-10 h-10 rounded-xl bg-[#C69214] hover:bg-[#B0810F] text-white flex items-center justify-center shadow-md shadow-[#C69214]/20 transition-all hover:scale-105 active:scale-95"
        title="Create New Intent"
        aria-label="Create New Intent"
      >
        <Plus className="w-5 h-5 stroke-[2.5]" />
      </button>

    </aside>
  );
};
