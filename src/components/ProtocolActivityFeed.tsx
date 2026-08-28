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
    <div className="glass-card p-5 space-y-3 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#8DC2FF]" />
          <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
            Live Protocol Activity Log
          </h3>
        </div>
        <span className="flex items-center gap-1.5 text-[10px] font-mono text-[#8DC2FF]">
          <span className="w-2 h-2 rounded-full bg-[#8DC2FF] animate-pulse" />
          Streaming
        </span>
      </div>

      {/* Terminal Stream Box */}
      <div className="glass-sub-box p-3 h-52 overflow-y-auto space-y-1.5 font-mono text-[11px]">
        {logs.length === 0 ? (
          <div className="text-[#CBD5E1]/50 py-12 text-center text-xs">
            Awaiting intent broadcast to stream live execution events...
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="leading-tight flex items-start gap-1.5">
              <span className="text-[#8DC2FF]/70 text-[10px] shrink-0">[{log.timestamp}]</span>
              <span
                className={
                  log.type === 'success'
                    ? 'text-[#CEF26D]'
                    : log.type === 'warn'
                    ? 'text-[#E9B872]'
                    : log.type === 'error'
                    ? 'text-[#D96C75] font-bold'
                    : 'text-white'
                }
              >
                {log.message}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between text-[10px] font-mono text-[#CBD5E1]/70 border-t border-white/5 pt-2">
        <span>SVM/EVM RPC Relayer Stream</span>
        <span>Filter: All Events</span>
      </div>
    </div>
  );
};
