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
      <div className="bg-[#151526] border border-white/10 rounded-2xl p-5 space-y-3.5 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#D1FE5D]" />
            <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
              Solver Network Risk & Health
            </h3>
          </div>
          <span className="text-[10px] font-mono text-[#D1FE5D] bg-[#20203A] px-2 py-0.5 rounded font-bold">
            Health 98.4%
          </span>
        </div>

        <div className="space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between p-2 rounded-lg bg-[#0B0B14] border border-white/5">
            <span className="text-[#A5A5B8] flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-[#D1FE5D]" />
              Total Collateral Bonded
            </span>
            <span className="text-[#D1FE5D] font-bold">$188,100 USDC ✓</span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-lg bg-[#0B0B14] border border-white/5">
            <span className="text-[#A5A5B8] flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-[#D1FE5D]" />
              Bid Clustering & Collusion Check
            </span>
            <span className="text-white font-bold">PASSED (0 alerts)</span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-lg bg-[#0B0B14] border border-white/5">
            <span className="text-[#A5A5B8] flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-[#D1FE5D]" />
              Solver Mesh Liquidity Pool
            </span>
            <span className="text-[#7171DE] font-bold">$699,000 Verified</span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-lg bg-[#0B0B14] border border-white/5">
            <span className="text-[#A5A5B8] flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-[#FF7032]" />
              Historical Slashing Flag
            </span>
            <span className="text-[#FF7032] font-bold">1 historical slash (Node C)</span>
          </div>
        </div>
      </div>

      {/* 2. Live Protocol Activity Log */}
      <div className="bg-[#151526] border border-white/10 rounded-2xl p-5 space-y-3 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#A9A7FF]" />
            <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
              Live Protocol Terminal Feed
            </h3>
          </div>
          <span className="flex items-center gap-1 text-[10px] font-mono text-[#A9A7FF]">
            <span className="w-2 h-2 rounded-full bg-[#1053D4] animate-pulse" />
            Listening
          </span>
        </div>

        <div className="bg-[#0B0B14] p-3 rounded-xl border border-white/5 h-44 overflow-y-auto space-y-1.5 font-mono text-[11px]">
          {logs.length === 0 ? (
            <div className="text-[#A5A5B8] opacity-50 py-8 text-center">
              Awaiting intent broadcast to stream live execution events...
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="leading-tight flex items-start gap-1.5">
                <span className="text-[#A5A5B8] text-[10px] shrink-0">[{log.timestamp}]</span>
                <span
                  className={
                    log.type === 'success'
                      ? 'text-[#D1FE5D]'
                      : log.type === 'warn'
                      ? 'text-[#FF7032]'
                      : log.type === 'error'
                      ? 'text-[#FF7032] font-bold'
                      : 'text-white'
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
