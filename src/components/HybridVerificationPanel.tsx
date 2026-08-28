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
    <div className="bg-[#162A46] border border-[#8DC2FF]/20 rounded-2xl p-6 space-y-5 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1A3152] border border-[#2F6690]/50 flex items-center justify-center text-[#8DC2FF]">
            {isOptimistic ? <ShieldCheck className="w-5 h-5 text-[#8DC2FF]" /> : <Cpu className="w-5 h-5 text-[#CEF26D]" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-mono tracking-widest text-[#8DC2FF] font-bold">
                Settlement Verification Panel
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                isOptimistic
                  ? 'bg-[#2F6690]/30 text-[#8DC2FF] border border-[#8DC2FF]/30'
                  : 'bg-[#1A3152] text-[#CEF26D] border border-[#CEF26D]/30'
              }`}>
                {isOptimistic ? 'Standard: Optimistic Window' : 'High-Value: Enhanced ZK/Oracle'}
              </span>
            </div>
            <h3 className="text-base font-bold text-[#F3F6FF] font-mono mt-0.5">
              {isOptimistic ? '🛡 Optimistic Challenge Window' : '◈ Enhanced Oracle / Proof Attestation'}
            </h3>
          </div>
        </div>

        <div className="font-mono text-xs text-right">
          <span className="text-[#8DC2FF]/70 block text-[10px]">Verification Mode</span>
          <span className="text-[#CEF26D] font-bold">{isOptimistic ? 'Challenge Guard' : 'Cryptographic Proof'}</span>
        </div>
      </div>

      {/* Path 1: Standard Optimistic Verification */}
      {isOptimistic ? (
        <div className="space-y-4 font-mono text-xs">
          <div className="bg-[#101C2C] p-4 rounded-xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] text-[#8DC2FF]/70 block">Solver Delivery Proof Status</span>
              <div className="flex items-center gap-2 text-[#F3F6FF] font-bold">
                <CheckCircle2 className="w-4 h-4 text-[#CEF26D]" />
                <span>Solana Transaction Signature Attested (Slot #2847192)</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-[#CEF26D]">
                <span className="w-2 h-2 rounded-full bg-[#CEF26D] animate-pulse" />
                <span>Status: No challenges detected on-chain</span>
              </div>
            </div>

            {/* Countdown Box */}
            <div className="bg-[#1A3152] p-3 rounded-xl border border-[#8DC2FF]/20 text-center shrink-0">
              <span className="text-[10px] text-[#8DC2FF]/70 block">Challenge Window</span>
              <span className="text-xl font-bold text-[#CEF26D]">
                00:{countdownSec.toString().padStart(2, '0')}
              </span>
              <span className="text-[10px] text-[#8DC2FF]/70 block">Auto-settles on zero</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-[#8DC2FF]/70">
              <span>Dispute Period Monitoring</span>
              <span>{Math.round(((15 - countdownSec) / 15) * 100)}%</span>
            </div>
            <div className="w-full bg-[#101C2C] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#CEF26D] h-full transition-all duration-1000 ease-linear rounded-full"
                style={{ width: `${((15 - countdownSec) / 15) * 100}%` }}
              />
            </div>
          </div>
        </div>
      ) : (
        /* Path 2: High Value Enhanced Verification */
        <div className="space-y-4 font-mono text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-[#101C2C] p-3.5 rounded-xl border border-white/5 space-y-1">
              <span className="text-[10px] text-[#8DC2FF]/70 block">Oracle / Proof Attestation</span>
              <span className="text-[#CEF26D] font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#CEF26D]" /> Verified
              </span>
              <span className="text-[10px] text-[#8DC2FF]/60">zk-SNARK Groth16 valid</span>
            </div>

            <div className="bg-[#101C2C] p-3.5 rounded-xl border border-white/5 space-y-1">
              <span className="text-[10px] text-[#8DC2FF]/70 block">Proof Status</span>
              <span className="text-[#F3F6FF] font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#8DC2FF]" /> CONFIRMED
              </span>
              <span className="text-[10px] text-[#8DC2FF]/60">Solana CPI receipt logged</span>
            </div>

            <div className="bg-[#101C2C] p-3.5 rounded-xl border border-white/5 space-y-1">
              <span className="text-[10px] text-[#8DC2FF]/70 block">Network Attestation</span>
              <span className="text-[#8DC2FF] font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#2F6690]" /> VALID
              </span>
              <span className="text-[10px] text-[#8DC2FF]/60">Multisig quorum 4/5</span>
            </div>
          </div>

          {/* User Confirmation Sign-off Gate */}
          {!isConfirmedByUser && status === 'verifying' && onConfirmSettlement && (
            <div className="bg-[#1A3152] p-4 rounded-xl border border-[#CEF26D]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-5 h-5 text-[#CEF26D] shrink-0" />
                <div>
                  <span className="font-bold text-[#F3F6FF] block">User Confirmation Required Before Final Settlement</span>
                  <span className="text-[#8DC2FF]/80 text-[11px] font-sans">
                    High-value proof confirmed. Click below to sign release authorization.
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onConfirmSettlement}
                className="px-5 py-2.5 rounded-xl bg-[#CEF26D] text-[#101C2C] hover:bg-[#D8F582] font-mono text-xs font-bold shrink-0 transition-all shadow-md cursor-pointer"
              >
                Confirm Settlement
              </button>
            </div>
          )}

          {isConfirmedByUser && (
            <div className="bg-[#101C2C] p-3 rounded-xl border border-[#CEF26D]/30 flex items-center gap-2 text-[#CEF26D]">
              <CheckCircle2 className="w-4 h-4" />
              <span>User Confirmation Signed: Settlement Approved.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
