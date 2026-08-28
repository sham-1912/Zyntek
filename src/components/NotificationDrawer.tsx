import React from 'react';
import { Bell, X, CheckCircle2, ShieldAlert, Lock } from 'lucide-react';

export interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  type: 'info' | 'success' | 'warning' | 'slashed';
  read: boolean;
}

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onSelectNotification?: (item: NotificationItem) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#1A1915]/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="ix-card w-full max-w-md h-full rounded-none rounded-l-2xl p-6 space-y-6 shadow-2xl bg-[#FAF8F5] border-l border-[#E8E4DA] flex flex-col justify-between animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="space-y-4 border-b border-[#E8E4DA] pb-4 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#FAF5E8] border border-[#E5D19E] flex items-center justify-center text-[#8C6407]">
                <Bell className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold text-[#1A1915] font-sans">
                Notifications
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-[#7A7568] hover:text-[#1A1915] p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center justify-between font-mono text-xs">
            <span className="text-[#7A7568]">
              {notifications.filter((n) => !n.read).length} Unread
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onMarkAllAsRead}
                className="text-[#C69214] hover:underline font-semibold"
              >
                Mark Read
              </button>
              <button
                type="button"
                onClick={onClearAll}
                className="text-[#7A7568] hover:text-[#922B21]"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {notifications.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-center text-[#7A7568] space-y-2">
              <Bell className="w-8 h-8 stroke-1 text-[#C5BEB0]" />
              <p className="text-xs font-sans">No notifications yet. Protocol events will appear here live!</p>
            </div>
          ) : (
            notifications.map((item) => {
              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border text-xs font-mono transition-all ${
                    !item.read
                      ? 'bg-white border-[#C69214] shadow-2xs'
                      : 'bg-[#FAF8F5] border-[#E8E4DA] text-[#6B6659]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      {item.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                      {item.type === 'slashed' && <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />}
                      {item.type === 'warning' && <ShieldAlert className="w-4 h-4 text-[#C69214] shrink-0" />}
                      {item.type === 'info' && <Lock className="w-4 h-4 text-[#8C6407] shrink-0" />}
                      <span className="font-bold text-[#1A1915] font-sans text-sm">{item.title}</span>
                    </div>
                    <span className="text-[10px] text-[#7A7568] shrink-0">{item.time}</span>
                  </div>

                  <p className="text-[11px] text-[#6B6659] leading-relaxed font-sans pl-6">
                    {item.desc}
                  </p>

                  {!item.read && (
                    <div className="w-full h-0.5 bg-[#FAF5E8] rounded-full overflow-hidden mt-2.5">
                      <div className="h-full bg-[#C69214] animate-toast-timer" />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer */}
        <div className="pt-4 border-t border-[#E8E4DA] text-center font-mono text-[10px] text-[#7A7568] shrink-0">
          IntentX Protocol Real-Time Event Stream
        </div>

      </div>
    </div>
  );
};
