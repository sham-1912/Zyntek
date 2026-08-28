import React from 'react';
import { ShieldCheck, CheckCircle2, ShieldAlert, Cpu, Check } from 'lucide-react';

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
    <div className="glass-card p-6 space-y-4 shadow-md flex flex-col justify-between h-full border border-[rgba(43,43,43,0.12)] bg-[#FFFDF5]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[rgba(43,43,43,0.08)] pb-3.5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2B2B2B] text-[#FFFDF5] flex items-center justify-center shadow-xs">
            {isOptimistic ? <ShieldCheck className="w-5 h-5 text-[#D4A017]" /> : <Cpu className="w-5 h-5 text-[#D4A017]" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-mono tracking-widest text-[#D4A017] font-bold">
                Settlement Verification Panel
              </span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#F7E7B5] text-[#2B2B2B] border border-[#D4A017]/30 font-mono font-bold">
                {isOptimistic ? '● Optimistic Challenge Guard' : '◆ Cryptographic Oracle Attestation'}
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-[#2B2B2B] font-headline mt-0.5">
              {isOptimistic ? 'Independent On-Chain Verification Window' : 'Enhanced Multi-Sig & ZK Verification Window'}
            </h3>
          </div>
        </div>

        <div className="font-mono text-xs text-right">
          <span className="text-[#5A5A5A] block text-[10px] uppercase font-semibold">Tiered Protocol Tier</span>
          <span className="text-[#607A3A] font-bold">{isOptimistic ? 'Standard Tier (<$1K)' : 'High-Value Tier (≥$1K)'}</span>
        </div>
      </div>

      {/* Path 1: Standard Optimistic Verification (Directive 8) */}
      {isOptimistic ? (
        <div className="space-y-4 font-mono text-xs">
          <div className="glass-sub-box p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#F7E7B5]/60 border border-[rgba(43,43,43,0.1)]">
            <div className="space-y-1.5">
              <span className="text-[10px] text-[#5A5A5A] uppercase font-bold block">Delivery Proof Attestation</span>
              <div className="flex items-center gap-2 text-[#2B2B2B] font-bold text-sm">
                <CheckCircle2 className="w-4 h-4 text-[#607A3A] shrink-0" />
                <span>Solana Delivery Attested (Slot #2847192)</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#607A3A] font-bold">
                <span className="w-2 h-2 rounded-full bg-[#607A3A] animate-pulse" />
                <span>✓ No challenges detected on-chain</span>
              </div>
            </div>

            {/* Countdown Box */}
            <div className="bg-[#FFFDF5] p-3 rounded-xl border border-[rgba(43,43,43,0.12)] text-center shrink-0 shadow-xs min-w-[130px]">
              <span className="text-[10px] text-[#5A5A5A] uppercase font-semibold block">Challenge Window</span>
              <span className="text-xl font-bold text-[#D4A017] font-mono leading-none my-1 block">
                00:{countdownSec.toString().padStart(2, '0')}
              </span>
              <span className="text-[10px] text-[#5A5A5A] block">Auto-settles on 00:00</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-[#5A5A5A]">
              <span className="font-semibold">Dispute Period Progress</span>
              <span className="font-bold text-[#2B2B2B]">{Math.round(((10 - countdownSec) / 10) * 100)}%</span>
            </div>
            <div className="w-full bg-[rgba(43,43,43,0.1)] h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-[#D4A017] h-full transition-all duration-1000 ease-linear rounded-full"
                style={{ width: `${((10 - countdownSec) / 10) * 100}%` }}
              />
            </div>
          </div>
        </div>
      ) : (
        /* Path 2: Enhanced High Value ZK-Oracle Verification */
        <div className="space-y-4 font-mono text-xs">
          <div className="grid grid-cols-3 gap-2.5">
            <div className="bg-[#FFFDF5] p-3 space-y-1 rounded-xl border border-[rgba(43,43,43,0.08)] shadow-xs">
              <span className="text-[10px] text-[#5A5A5A] block uppercase font-semibold">Proof Attestation</span>
              <span className="text-[#607A3A] font-bold flex items-center gap-1 text-xs">
                <Check className="w-3.5 h-3.5 stroke-[3]" /> Valid
              </span>
              <span className="text-[10px] text-[#5A5A5A]">Groth16 Proof</span>
            </div>

            <div className="bg-[#FFFDF5] p-3 space-y-1 rounded-xl border border-[rgba(43,43,43,0.08)] shadow-xs">
              <span className="text-[10px] text-[#5A5A5A] block uppercase font-semibold">Destination State</span>
              <span className="text-[#2B2B2B] font-bold flex items-center gap-1 text-xs">
                <Check className="w-3.5 h-3.5 text-[#D4A017] stroke-[3]" /> Confirmed
              </span>
              <span className="text-[10px] text-[#5A5A5A]">Solana SVM Slot</span>
            </div>

            <div className="bg-[#FFFDF5] p-3 space-y-1 rounded-xl border border-[rgba(43,43,43,0.08)] shadow-xs">
              <span className="text-[10px] text-[#5A5A5A] block uppercase font-semibold">Oracle Quorum</span>
              <span className="text-[#2B2B2B] font-bold flex items-center gap-1 text-xs">
                <Check className="w-3.5 h-3.5 text-[#D4A017] stroke-[3]" /> 4/5 Signatures
              </span>
              <span className="text-[10px] text-[#5A5A5A]">Multi-Sig Valid</span>
            </div>
          </div>

          {/* User Confirmation Sign-off Gate */}
          {!isConfirmedByUser && status === 'verifying' && onConfirmSettlement && (
            <div className="glass-sub-box p-3.5 border-[#D4A017]/40 flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#F7E7B5] rounded-xl shadow-xs">
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-5 h-5 text-[#D4A017] shrink-0" />
                <span className="text-xs text-[#2B2B2B] font-bold">
                  High-Value Transfer: User Confirmation Required to Release Escrow
                </span>
              </div>

              <button
                type="button"
                onClick={onConfirmSettlement}
                className="px-4 py-2 rounded-xl bg-[#D4A017] text-[#2B2B2B] hover:bg-[#E0AB1E] font-mono text-xs font-bold shrink-0 transition-all shadow-xs cursor-pointer uppercase tracking-wider"
              >
                Confirm Settlement →
              </button>
            </div>
          )}

          {isConfirmedByUser && (
            <div className="bg-[#F7E7B5] p-3 rounded-xl border border-[#D4A017]/30 flex items-center gap-2 text-xs text-[#2B2B2B] font-bold shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-[#607A3A]" />
              <span>User Authorization Signed: Settlement Confirmed & Escrow Released.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
