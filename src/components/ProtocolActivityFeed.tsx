import React from 'react';
import { Terminal } from 'lucide-react';

export interface ActivityLogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warn' | 'error';
}

interface ProtocolActivityFeedProps {
  logs: ActivityLogEntry[];
}

export const ProtocolActivityFeed: React.FC<ProtocolActivityFeedProps> = ({ logs }) => {
  return (
    <div className="glass-card p-5 space-y-3 flex flex-col justify-between h-full border border-[rgba(43,43,43,0.12)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[rgba(43,43,43,0.08)] pb-2.5">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#D4A017]" />
          <h3 className="text-xs font-bold text-[#2B2B2B] uppercase font-headline tracking-wider">
            Live Protocol Activity Log
          </h3>
        </div>
        <span className="flex items-center gap-1.5 text-[10px] font-mono text-[#2B2B2B] bg-[#F7E7B5] px-2 py-0.5 rounded-full border border-[#D4A017]/30 font-bold">
          <span className="w-2 h-2 rounded-full bg-[#D4A017] animate-pulse" />
          Streaming
        </span>
      </div>

      {/* Terminal Stream Box (Charcoal #2B2B2B with Off-White and Mustard/Warm Yellow text) */}
      <div className="bg-[#2B2B2B] p-3.5 rounded-xl border border-black/20 flex-1 min-h-[180px] max-h-[260px] overflow-y-auto space-y-1.5 font-mono text-[11px] text-[#FFFDF5] shadow-inner">
        {logs.length === 0 ? (
          <div className="text-[#FFFDF5]/40 py-12 text-center text-xs">
            Awaiting intent broadcast to stream live execution events...
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="leading-tight flex items-start gap-1.5">
              <span className="text-[#F0C94C] text-[10px] shrink-0 font-bold">[{log.timestamp}]</span>
              <span
                className={
                  log.type === 'success'
                    ? 'text-[#CEF26D]'
                    : log.type === 'warn'
                    ? 'text-[#F0C94C]'
                    : log.type === 'error'
                    ? 'text-[#B84A39] font-bold'
                    : 'text-[#FFFDF5]'
                }
              >
                {log.message}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between text-[10px] font-mono text-[#5A5A5A] border-t border-[rgba(43,43,43,0.08)] pt-2">
        <span>SVM/EVM RPC Relayer Stream</span>
        <span>Filter: All Events</span>
      </div>
    </div>
  );
};
