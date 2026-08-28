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
  { id: 'log_seed_2', timestamp: '10:42:19', message: 'SOLVER B (Balanced Executor) submitted bid: $497.82 output · 42.8s ETA', type: 'info' },
  { id: 'log_seed_3', timestamp: '10:42:19', message: 'SOLVER A (Cost Optimizer) submitted bid: $498.90 output · 52.1s ETA', type: 'info' },
  { id: 'log_seed_4', timestamp: '10:42:20', message: 'SOLVER C (Speed Specialist) submitted bid: $495.50 output · 28.4s ETA', type: 'info' },
  { id: 'log_seed_5', timestamp: '10:42:21', message: 'DYNAMIC SCORING: Cost (50%) + Speed (30%) + Safety (20%) calculated', type: 'success' },
  { id: 'log_seed_6', timestamp: '10:42:22', message: 'SOLVER B SELECTED: Rank #1 Winner (91.4 Score) · $500 Bond Staked', type: 'success' },
];

export const ProtocolActivityFeed: React.FC<ProtocolActivityFeedProps> = ({ logs }) => {
  const displayLogs = logs.length > 0 ? logs : DEFAULT_SEED_LOGS;

  return (
    <div className="glass-card p-6 space-y-4 flex flex-col justify-between h-full border border-[rgba(43,43,43,0.12)] bg-[#FFFDF5] shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[rgba(43,43,43,0.08)] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#2B2B2B] text-[#FFFDF5] flex items-center justify-center shadow-xs">
            <Terminal className="w-5 h-5 text-[#D4A017]" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-[#2B2B2B] uppercase font-headline tracking-wider">
              Live Protocol Activity Stream
            </h3>
            <span className="text-xs text-[#5A5A5A] font-sans">
              Real-time cross-chain relayer & solver event telemetry
            </span>
          </div>
        </div>

        <span className="flex items-center gap-1.5 text-xs font-mono text-[#2B2B2B] bg-[#F7E7B5] px-3 py-1 rounded-full border border-[#D4A017]/30 font-bold shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[#607A3A] animate-pulse" />
          Streaming
        </span>
      </div>

      {/* Enlarged Terminal Stream Box (Charcoal #2B2B2B) for Live Presentation Legibility */}
      <div className="bg-[#2B2B2B] p-4 sm:p-5 rounded-2xl border border-black/20 flex-1 min-h-[220px] max-h-[320px] overflow-y-auto space-y-2.5 font-mono text-xs sm:text-[13px] text-[#FFFDF5] shadow-inner leading-relaxed">
        {displayLogs.map((log) => (
          <div key={log.id} className="flex items-start gap-2.5">
            <span className="text-[#F0C94C] text-xs shrink-0 font-bold">[{log.timestamp}]</span>
            <span
              className={
                log.type === 'success'
                  ? 'text-[#CEF26D] font-bold'
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
      <div className="flex items-center justify-between text-xs font-mono text-[#5A5A5A] border-t border-[rgba(43,43,43,0.08)] pt-2.5">
        <span>Dual-Consensus SVM/EVM Relayer Mesh</span>
        <span className="text-[#607A3A] font-bold flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#607A3A]" />
          <span>Feed Connected (0ms Latency)</span>
        </span>
      </div>
    </div>
  );
};
