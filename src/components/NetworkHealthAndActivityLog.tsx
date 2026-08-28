import React from 'react';
import { ShieldCheck, AlertTriangle, Terminal, Check } from 'lucide-react';

export interface ActivityLogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warn' | 'error';
}

interface NetworkHealthAndActivityLogProps {
  logs: ActivityLogEntry[];
}

export const NetworkHealthAndActivityLog: React.FC<NetworkHealthAndActivityLogProps> = ({ logs }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* 1. Solver Risk & Network Health Panel */}
      <div className="bg-[#162A46] border border-[#8DC2FF]/20 rounded-2xl p-5 space-y-3.5 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#CEF26D]" />
            <h3 className="text-xs font-bold text-[#F3F6FF] uppercase font-mono tracking-wider">
              Solver Network Risk & Health
            </h3>
          </div>
          <span className="text-[10px] font-mono text-[#CEF26D] bg-[#1A3152] px-2 py-0.5 rounded font-bold border border-[#CEF26D]/30">
            Health 98.4%
          </span>
        </div>

        <div className="space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between p-2 rounded-lg bg-[#101C2C] border border-white/5">
            <span className="text-[#8DC2FF]/75 flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-[#CEF26D]" />
              Total Collateral Bonded
            </span>
            <span className="text-[#CEF26D] font-bold">$188,100 USDC ✓</span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-lg bg-[#101C2C] border border-white/5">
            <span className="text-[#8DC2FF]/75 flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-[#CEF26D]" />
              Bid Clustering & Collusion Check
            </span>
            <span className="text-[#F3F6FF] font-bold">PASSED (0 alerts)</span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-lg bg-[#101C2C] border border-white/5">
            <span className="text-[#8DC2FF]/75 flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-[#CEF26D]" />
              Solver Mesh Liquidity Pool
            </span>
            <span className="text-[#8DC2FF] font-bold">$699,000 Verified</span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-lg bg-[#101C2C] border border-white/5">
            <span className="text-[#8DC2FF]/75 flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-[#FF7032]" />
              Historical Slashing Flag
            </span>
            <span className="text-[#FF7032] font-bold">1 historical slash (Node C)</span>
          </div>
        </div>
      </div>

      {/* 2. Live Protocol Activity Log */}
      <div className="bg-[#162A46] border border-[#8DC2FF]/20 rounded-2xl p-5 space-y-3 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#8DC2FF]" />
            <h3 className="text-xs font-bold text-[#F3F6FF] uppercase font-mono tracking-wider">
              Live Protocol Terminal Feed
            </h3>
          </div>
          <span className="flex items-center gap-1 text-[10px] font-mono text-[#8DC2FF]">
            <span className="w-2 h-2 rounded-full bg-[#8DC2FF] animate-pulse" />
            Listening
          </span>
        </div>

        <div className="bg-[#101C2C] p-3 rounded-xl border border-white/5 h-44 overflow-y-auto space-y-1.5 font-mono text-[11px]">
          {logs.length === 0 ? (
            <div className="text-[#8DC2FF]/50 py-8 text-center">
              Awaiting intent broadcast to stream live execution events...
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="leading-tight flex items-start gap-1.5">
                <span className="text-[#8DC2FF]/60 text-[10px] shrink-0">[{log.timestamp}]</span>
                <span
                  className={
                    log.type === 'success'
                      ? 'text-[#CEF26D]'
                      : log.type === 'warn'
                      ? 'text-[#FF7032]'
                      : log.type === 'error'
                      ? 'text-[#FF7032] font-bold'
                      : 'text-[#F3F6FF]'
                  }
                >
                  {log.message}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
