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
    <div className="bg-[#151526] border border-white/10 rounded-2xl p-6 space-y-5 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#20203A] border border-[#1053D4]/40 flex items-center justify-center text-[#1053D4]">
            {isOptimistic ? <ShieldCheck className="w-5 h-5" /> : <Cpu className="w-5 h-5 text-[#7171DE]" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-mono tracking-widest text-[#A9A7FF] font-bold">
                Settlement Verification Panel
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                isOptimistic
                  ? 'bg-[#1053D4]/20 text-[#A9A7FF] border border-[#1053D4]/30'
                  : 'bg-[#7171DE]/20 text-[#7171DE] border border-[#7171DE]/30'
              }`}>
                {isOptimistic ? 'Standard: Optimistic Window' : 'High-Value: Enhanced ZK/Oracle'}
              </span>
            </div>
            <h3 className="text-base font-bold text-white font-mono mt-0.5">
              {isOptimistic ? '🛡 Optimistic Challenge Window' : '◈ Enhanced Oracle / Proof Attestation'}
            </h3>
          </div>
        </div>

        <div className="font-mono text-xs text-right">
          <span className="text-[#A5A5B8] block text-[10px]">Verification Mode</span>
          <span className="text-[#D1FE5D] font-bold">{isOptimistic ? 'Challenge Guard' : 'Cryptographic Proof'}</span>
        </div>
      </div>

      {/* Path 1: Standard Optimistic Verification */}
      {isOptimistic ? (
        <div className="space-y-4 font-mono text-xs">
          <div className="bg-[#0B0B14] p-4 rounded-xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] text-[#A5A5B8] block">Solver Delivery Proof Status</span>
              <div className="flex items-center gap-2 text-white font-bold">
                <CheckCircle2 className="w-4 h-4 text-[#D1FE5D]" />
                <span>Solana Transaction Signature Attested (Slot #2847192)</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-[#D1FE5D]">
                <span className="w-2 h-2 rounded-full bg-[#D1FE5D] animate-pulse" />
                <span>Status: No challenges detected on-chain</span>
              </div>
            </div>

            {/* Countdown Box */}
            <div className="bg-[#20203A] p-3 rounded-xl border border-white/10 text-center shrink-0">
              <span className="text-[10px] text-[#A5A5B8] block">Challenge Window</span>
              <span className="text-xl font-bold text-[#D1FE5D]">
                00:{countdownSec.toString().padStart(2, '0')}
              </span>
              <span className="text-[10px] text-[#A5A5B8] block">Auto-settles on zero</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-[#A5A5B8]">
              <span>Dispute Period Monitoring</span>
              <span>{Math.round(((15 - countdownSec) / 15) * 100)}%</span>
            </div>
            <div className="w-full bg-[#20203A] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#D1FE5D] h-full transition-all duration-1000 ease-linear rounded-full"
                style={{ width: `${((15 - countdownSec) / 15) * 100}%` }}
              />
            </div>
          </div>
        </div>
      ) : (
        /* Path 2: High Value Enhanced Verification */
        <div className="space-y-4 font-mono text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-[#0B0B14] p-3.5 rounded-xl border border-white/5 space-y-1">
              <span className="text-[10px] text-[#A5A5B8] block">Oracle / Proof Attestation</span>
              <span className="text-[#D1FE5D] font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#D1FE5D]" /> Verified
              </span>
              <span className="text-[10px] text-[#A5A5B8]">zk-SNARK Groth16 valid</span>
            </div>

            <div className="bg-[#0B0B14] p-3.5 rounded-xl border border-white/5 space-y-1">
              <span className="text-[10px] text-[#A5A5B8] block">Proof Status</span>
              <span className="text-white font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#1053D4]" /> CONFIRMED
              </span>
              <span className="text-[10px] text-[#A5A5B8]">Solana CPI receipt logged</span>
            </div>

            <div className="bg-[#0B0B14] p-3.5 rounded-xl border border-white/5 space-y-1">
              <span className="text-[10px] text-[#A5A5B8] block">Network Attestation</span>
              <span className="text-[#7171DE] font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#7171DE]" /> VALID
              </span>
              <span className="text-[10px] text-[#A5A5B8]">Multisig quorum 4/5</span>
            </div>
          </div>

          {/* User Confirmation Sign-off Gate */}
          {!isConfirmedByUser && status === 'verifying' && onConfirmSettlement && (
            <div className="bg-[#20203A] p-4 rounded-xl border border-[#D1FE5D]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-5 h-5 text-[#D1FE5D] shrink-0" />
                <div>
                  <span className="font-bold text-white block">User Confirmation Required Before Final Settlement</span>
                  <span className="text-[#A5A5B8] text-[11px] font-sans">
                    High-value proof confirmed. Click below to sign release authorization.
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onConfirmSettlement}
                className="px-5 py-2.5 rounded-xl bg-[#D1FE5D] text-[#0B0B14] hover:bg-lime-300 font-mono text-xs font-bold shrink-0 transition-all shadow-md cursor-pointer"
              >
                Confirm Settlement
              </button>
            </div>
          )}

          {isConfirmedByUser && (
            <div className="bg-[#0B0B14] p-3 rounded-xl border border-[#D1FE5D]/30 flex items-center gap-2 text-[#D1FE5D]">
              <CheckCircle2 className="w-4 h-4" />
              <span>User Confirmation Signed: Settlement Approved.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
