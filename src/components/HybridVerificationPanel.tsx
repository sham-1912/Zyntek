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
    <div className="glass-card p-5 space-y-4 shadow-md flex flex-col justify-between h-full border border-[rgba(43,43,43,0.12)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[rgba(43,43,43,0.08)] pb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#F7E7B5] border border-[#D4A017]/40 flex items-center justify-center text-[#2B2B2B]">
            {isOptimistic ? <ShieldCheck className="w-4 h-4 text-[#D4A017]" /> : <Cpu className="w-4 h-4 text-[#D4A017]" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-mono tracking-widest text-[#D4A017] font-bold">
                Settlement Verification Panel
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                isOptimistic
                  ? 'bg-[#F7E7B5] text-[#2B2B2B] border border-[#D4A017]/30'
                  : 'bg-[#F7E7B5] text-[#2B2B2B] border border-[#D4A017]/30'
              }`}>
                {isOptimistic ? 'Optimistic Window' : 'Enhanced ZK-Oracle'}
              </span>
            </div>
            <h3 className="text-sm font-bold text-[#2B2B2B] font-headline mt-0.5">
              {isOptimistic ? '🛡 Optimistic Challenge Window' : '◈ Cryptographic Proof Attestation'}
            </h3>
          </div>
        </div>

        <div className="font-mono text-xs text-right">
          <span className="text-[#5A5A5A] block text-[10px]">Verification Mode</span>
          <span className="text-[#607A3A] font-bold">{isOptimistic ? 'Challenge Guard' : 'ZK Attestation'}</span>
        </div>
      </div>

      {/* Path 1: Standard Optimistic Verification */}
      {isOptimistic ? (
        <div className="space-y-3 font-mono text-xs">
          <div className="glass-sub-box p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#F7E7B5]/60 border border-[rgba(43,43,43,0.1)]">
            <div className="space-y-1">
              <span className="text-[10px] text-[#5A5A5A] block">Solver Delivery Proof Status</span>
              <div className="flex items-center gap-2 text-[#2B2B2B] font-bold">
                <CheckCircle2 className="w-4 h-4 text-[#607A3A]" />
                <span>Solana Tx Signature Attested (Slot #2847192)</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-[#607A3A] font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#607A3A] animate-pulse" />
                <span>Status: No challenges detected on-chain</span>
              </div>
            </div>

            {/* Countdown Box */}
            <div className="bg-[#FFFDF5] p-2.5 rounded-lg border border-[rgba(43,43,43,0.12)] text-center shrink-0 shadow-xs">
              <span className="text-[9px] text-[#5A5A5A] block">Dispute Window</span>
              <span className="text-lg font-bold text-[#D4A017]">
                00:{countdownSec.toString().padStart(2, '0')}
              </span>
              <span className="text-[9px] text-[#5A5A5A] block">Auto-settles on 0</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-[#5A5A5A]">
              <span>Challenge Period Progress</span>
              <span>{Math.round(((10 - countdownSec) / 10) * 100)}%</span>
            </div>
            <div className="w-full bg-[rgba(43,43,43,0.1)] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#D4A017] h-full transition-all duration-1000 ease-linear rounded-full"
                style={{ width: `${((10 - countdownSec) / 10) * 100}%` }}
              />
            </div>
          </div>
        </div>
      ) : (
        /* Path 2: High Value Enhanced Verification */
        <div className="space-y-3 font-mono text-xs">
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-[#FFFDF5] p-2.5 space-y-0.5 rounded-lg border border-[rgba(43,43,43,0.08)] shadow-xs">
              <span className="text-[9px] text-[#5A5A5A] block">Proof Attestation</span>
              <span className="text-[#607A3A] font-bold flex items-center gap-1 text-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#607A3A]" /> Verified
              </span>
              <span className="text-[9px] text-[#5A5A5A]">Groth16 Valid</span>
            </div>

            <div className="bg-[#FFFDF5] p-2.5 space-y-0.5 rounded-lg border border-[rgba(43,43,43,0.08)] shadow-xs">
              <span className="text-[9px] text-[#5A5A5A] block">Proof Status</span>
              <span className="text-[#2B2B2B] font-bold flex items-center gap-1 text-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#D4A017]" /> CONFIRMED
              </span>
              <span className="text-[9px] text-[#5A5A5A]">Solana CPI Log</span>
            </div>

            <div className="bg-[#FFFDF5] p-2.5 space-y-0.5 rounded-lg border border-[rgba(43,43,43,0.08)] shadow-xs">
              <span className="text-[9px] text-[#5A5A5A] block">Quorum</span>
              <span className="text-[#2B2B2B] font-bold flex items-center gap-1 text-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#D4A017]" /> 4/5 Quorum
              </span>
              <span className="text-[9px] text-[#5A5A5A]">Multisig Valid</span>
            </div>
          </div>

          {/* User Confirmation Sign-off Gate */}
          {!isConfirmedByUser && status === 'verifying' && onConfirmSettlement && (
            <div className="glass-sub-box p-3 border-[#D4A017]/40 flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#F7E7B5]">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#D4A017] shrink-0" />
                <span className="text-xs text-[#2B2B2B] font-bold">
                  User Confirmation Required for Settlement
                </span>
              </div>

              <button
                type="button"
                onClick={onConfirmSettlement}
                className="px-4 py-1.5 rounded-lg bg-[#D4A017] text-[#2B2B2B] hover:bg-[#E0AB1E] font-mono text-xs font-bold shrink-0 transition-all shadow-xs cursor-pointer"
              >
                Confirm Settlement →
              </button>
            </div>
          )}

          {isConfirmedByUser && (
            <div className="bg-[#F7E7B5] p-2.5 rounded-lg border border-[#D4A017]/30 flex items-center gap-2 text-[#2B2B2B] font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#607A3A]" />
              <span>User Authorization Signed: Settlement Finalized.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
