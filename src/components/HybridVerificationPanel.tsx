import React from 'react';
import { ShieldCheck, CheckCircle2, ShieldAlert, Cpu } from 'lucide-react';

interface HybridVerificationPanelProps {
  verificationType: 'optimistic' | 'zk_oracle';
  countdownSec: number;
  isConfirmedByUser: boolean;
  onConfirmSettlement?: () => void;
  status: 'verifying' | 'settled';
}

export const HybridVerificationPanel: React.FC<HybridVerificationPanelProps> = ({
  verificationType,
  countdownSec,
  isConfirmedByUser,
  onConfirmSettlement,
  status,
}) => {
  const isOptimistic = verificationType === 'optimistic';

  return (
    <div className="glass-card p-5 space-y-4 shadow-xl flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[rgba(14,30,56,0.65)] border border-[#2F6690]/50 flex items-center justify-center text-[#8DC2FF]">
            {isOptimistic ? <ShieldCheck className="w-4 h-4 text-[#8DC2FF]" /> : <Cpu className="w-4 h-4 text-[#CEF26D]" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-mono tracking-widest text-[#8DC2FF] font-bold">
                Settlement Verification Panel
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                isOptimistic
                  ? 'bg-[#2F6690]/30 text-[#8DC2FF] border border-[#8DC2FF]/30'
                  : 'bg-[rgba(14,30,56,0.65)] text-[#CEF26D] border border-[#CEF26D]/30'
              }`}>
                {isOptimistic ? 'Optimistic Window' : 'Enhanced ZK-Oracle'}
              </span>
            </div>
            <h3 className="text-sm font-bold text-white font-mono mt-0.5">
              {isOptimistic ? '🛡 Optimistic Challenge Window' : '◈ Cryptographic Proof Attestation'}
            </h3>
          </div>
        </div>

        <div className="font-mono text-xs text-right">
          <span className="text-[#CBD5E1] block text-[10px]">Verification Mode</span>
          <span className="text-[#CEF26D] font-bold">{isOptimistic ? 'Challenge Guard' : 'ZK Attestation'}</span>
        </div>
      </div>

      {/* Path 1: Standard Optimistic Verification */}
      {isOptimistic ? (
        <div className="space-y-3 font-mono text-xs">
          <div className="glass-sub-box p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="text-[10px] text-[#CBD5E1] block">Solver Delivery Proof Status</span>
              <div className="flex items-center gap-2 text-white font-bold">
                <CheckCircle2 className="w-4 h-4 text-[#CEF26D]" />
                <span>Solana Tx Signature Attested (Slot #2847192)</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-[#CEF26D]">
                <span className="w-2 h-2 rounded-full bg-[#CEF26D] animate-pulse" />
                <span>Status: No challenges detected on-chain</span>
              </div>
            </div>

            {/* Countdown Box */}
            <div className="bg-[rgba(10,20,38,0.7)] p-2.5 rounded-lg border border-[#8DC2FF]/20 text-center shrink-0">
              <span className="text-[9px] text-[#CBD5E1] block">Dispute Window</span>
              <span className="text-lg font-bold text-[#CEF26D]">
                00:{countdownSec.toString().padStart(2, '0')}
              </span>
              <span className="text-[9px] text-[#CBD5E1] block">Auto-settles on 0</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-[#CBD5E1]">
              <span>Challenge Period Progress</span>
              <span>{Math.round(((10 - countdownSec) / 10) * 100)}%</span>
            </div>
            <div className="w-full bg-[rgba(10,20,38,0.7)] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#CEF26D] h-full transition-all duration-1000 ease-linear rounded-full"
                style={{ width: `${((10 - countdownSec) / 10) * 100}%` }}
              />
            </div>
          </div>
        </div>
      ) : (
        /* Path 2: High Value Enhanced Verification */
        <div className="space-y-3 font-mono text-xs">
          <div className="grid grid-cols-3 gap-2">
            <div className="glass-sub-box p-2.5 space-y-0.5">
              <span className="text-[9px] text-[#CBD5E1] block">Proof Attestation</span>
              <span className="text-[#CEF26D] font-bold flex items-center gap-1 text-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#CEF26D]" /> Verified
              </span>
              <span className="text-[9px] text-[#CBD5E1]/70">Groth16 Valid</span>
            </div>

            <div className="glass-sub-box p-2.5 space-y-0.5">
              <span className="text-[9px] text-[#CBD5E1] block">Proof Status</span>
              <span className="text-white font-bold flex items-center gap-1 text-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#8DC2FF]" /> CONFIRMED
              </span>
              <span className="text-[9px] text-[#CBD5E1]/70">Solana CPI Log</span>
            </div>

            <div className="glass-sub-box p-2.5 space-y-0.5">
              <span className="text-[9px] text-[#CBD5E1] block">Quorum</span>
              <span className="text-[#8DC2FF] font-bold flex items-center gap-1 text-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2F6690]" /> 4/5 Quorum
              </span>
              <span className="text-[9px] text-[#CBD5E1]/70">Multisig Valid</span>
            </div>
          </div>

          {/* User Confirmation Sign-off Gate */}
          {!isConfirmedByUser && status === 'verifying' && onConfirmSettlement && (
            <div className="glass-sub-box p-3 border-[#CEF26D]/40 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#CEF26D] shrink-0" />
                <span className="text-xs text-white font-bold">
                  User Confirmation Required for Settlement
                </span>
              </div>

              <button
                type="button"
                onClick={onConfirmSettlement}
                className="px-4 py-1.5 rounded-lg bg-[#CEF26D] text-[#070F1E] hover:bg-[#D8F582] font-mono text-xs font-bold shrink-0 transition-all shadow-md cursor-pointer"
              >
                Confirm Settlement
              </button>
            </div>
          )}

          {isConfirmedByUser && (
            <div className="glass-sub-box p-2.5 border-[#CEF26D]/30 flex items-center gap-2 text-[#CEF26D]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>User Authorization Signed: Settlement Finalized.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
