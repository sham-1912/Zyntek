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

const DEFAULT_SEED_LOGS: ActivityLogEntry[] = [
  { id: 'log_seed_1', timestamp: '10:42:18', message: 'INTENT BROADCAST: 500 USDC Ethereum → Solana USDC (#INT-8492)', type: 'info' },
  { id: 'log_seed_2', timestamp: '10:42:19', message: 'SOLVER 01 (Alpha Route) submitted bid: $497.50 output', type: 'info' },
  { id: 'log_seed_3', timestamp: '10:42:19', message: 'SOLVER 02 (Flash Relay) submitted bid: 42.8s ETA', type: 'info' },
  { id: 'log_seed_4', timestamp: '10:42:20', message: 'SOLVER 03 (Shield Vault) submitted bid: $500 Bond', type: 'info' },
  { id: 'log_seed_5', timestamp: '10:42:21', message: 'SCORING COMPLETE: Dynamic weights calculated', type: 'success' },
  { id: 'log_seed_6', timestamp: '10:42:21', message: 'SOLVER 02 SELECTED: Rank #1 Winner (Final Score 91.4)', type: 'success' },
];

export const ProtocolActivityFeed: React.FC<ProtocolActivityFeedProps> = ({ logs }) => {
  const displayLogs = logs.length > 0 ? logs : DEFAULT_SEED_LOGS;

  return (
    <div className="glass-card p-6 space-y-3.5 flex flex-col justify-between h-full border border-[rgba(43,43,43,0.12)] bg-[#FFFDF5]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[rgba(43,43,43,0.08)] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#2B2B2B] text-[#FFFDF5] flex items-center justify-center shadow-xs">
            <Terminal className="w-4 h-4 text-[#D4A017]" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-[#2B2B2B] uppercase font-headline tracking-wider">
              Live Protocol Activity Stream
            </h3>
            <span className="text-xs text-[#5A5A5A] font-sans">
              Real-time cross-chain relayer event log
            </span>
          </div>
        </div>

        <span className="flex items-center gap-1.5 text-[10px] font-mono text-[#2B2B2B] bg-[#F7E7B5] px-2.5 py-1 rounded-full border border-[#D4A017]/30 font-bold shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[#D4A017] animate-pulse" />
          Streaming
        </span>
      </div>

      {/* Terminal Stream Box (Charcoal #2B2B2B) */}
      <div className="bg-[#2B2B2B] p-4 rounded-xl border border-black/20 flex-1 min-h-[190px] max-h-[260px] overflow-y-auto space-y-2 font-mono text-xs text-[#FFFDF5] shadow-inner">
        {displayLogs.map((log) => (
          <div key={log.id} className="leading-tight flex items-start gap-2">
            <span className="text-[#F0C94C] text-[11px] shrink-0 font-bold">[{log.timestamp}]</span>
            <span
              className={
                log.type === 'success'
                  ? 'text-[#CEF26D] font-medium'
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
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-[11px] font-mono text-[#5A5A5A] border-t border-[rgba(43,43,43,0.08)] pt-2">
        <span>Dual-Consensus SVM/EVM Relayer</span>
        <span className="text-[#607A3A] font-bold">● Feed Connected</span>
      </div>
    </div>
  );
};
