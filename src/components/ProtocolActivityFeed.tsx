import React, { useState } from 'react';
import { Terminal, Maximize2, Minimize2, X } from 'lucide-react';

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
  { id: 'log_seed_7', timestamp: '10:42:23', message: 'ESCROW LOCKED: $500 USDC deposited in EscrowVault.sol', type: 'info' },
  { id: 'log_seed_8', timestamp: '10:42:24', message: 'SVM RELAYER: Atomic cross-chain transaction submitted to Solana', type: 'info' },
  { id: 'log_seed_9', timestamp: '10:42:27', message: 'DELIVERY CONFIRMED: 497.82 USDC verified on Solana destination account', type: 'success' },
  { id: 'log_seed_10', timestamp: '10:42:28', message: 'DUAL-CONSENSUS: Groth16 ZK & optimistic challenge cleared · Settlement finalized', type: 'success' },
];

export const ProtocolActivityFeed: React.FC<ProtocolActivityFeedProps> = ({ logs }) => {
  const [isExpandedModal, setIsExpandedModal] = useState<boolean>(false);
  const displayLogs = logs.length > 0 ? logs : DEFAULT_SEED_LOGS;

  return (
    <>
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

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsExpandedModal(true)}
              className="p-1.5 rounded-lg bg-[#FFFDF5] hover:bg-[#F7E7B5] border border-[rgba(43,43,43,0.12)] text-[#2B2B2B] transition-all cursor-pointer shadow-xs"
              title="Expand live terminal"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>

            <span className="flex items-center gap-1.5 text-xs font-mono text-[#2B2B2B] bg-[#F7E7B5] px-2.5 py-1 rounded-full border border-[#D4A017]/30 font-bold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#607A3A] animate-pulse" />
              Streaming
            </span>
          </div>
        </div>

        {/* Enlarged Terminal Stream Box (Shows 8-10 lines, +20% larger text) */}
        <div className="bg-[#2B2B2B] p-4 sm:p-5 rounded-2xl border border-black/20 flex-1 min-h-[280px] max-h-[360px] overflow-y-auto space-y-2.5 font-mono text-xs sm:text-[13.5px] text-[#FFFDF5] shadow-inner leading-relaxed">
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
          <span className="text-[#607A3A] font-bold">● Feed Connected (0ms Latency)</span>
        </div>
      </div>

      {/* Expanded Modal Takeover for Live Demo Presentation */}
      {isExpandedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2B2B2B]/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#2B2B2B] text-[#FFFDF5] border-2 border-[#D4A017] rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-5 shadow-2xl font-mono">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#D4A017] text-[#2B2B2B] flex items-center justify-center font-bold">
                  <Terminal className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#F0C94C] font-headline uppercase">
                    Full Protocol Telemetry & Relayer Terminal
                  </h3>
                  <p className="text-xs text-[#FFFDF5]/70">Live decentralized cross-chain execution logs</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsExpandedModal(false)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-black/60 p-5 rounded-2xl border border-white/10 max-h-[60vh] overflow-y-auto space-y-3 text-sm sm:text-base leading-relaxed">
              {displayLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-3">
                  <span className="text-[#F0C94C] text-sm shrink-0 font-bold">[{log.timestamp}]</span>
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

            <div className="flex items-center justify-between text-xs text-[#FFFDF5]/60 pt-2 border-t border-white/10">
              <span>● 100% Cryptographic Verification Log</span>
              <button
                type="button"
                onClick={() => setIsExpandedModal(false)}
                className="px-4 py-2 rounded-xl bg-[#D4A017] text-[#2B2B2B] font-bold hover:bg-[#E0AB1E] transition-all cursor-pointer uppercase flex items-center gap-1.5"
              >
                <Minimize2 className="w-4 h-4" /> Close Terminal
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
