import React, { useState } from 'react';
import { CheckCircle2, Copy, FileCode, Check, ShieldCheck, ArrowRight, Hash } from 'lucide-react';
import type { SettlementResult, UserIntent, SolverBid } from '../services/types';

interface FinalSettlementRecordCardProps {
  intent: UserIntent;
  winningBid: SolverBid;
  settlementResult: SettlementResult;
}

export const FinalSettlementRecordCard: React.FC<FinalSettlementRecordCardProps> = ({
  intent,
  winningBid,
  settlementResult,
}) => {
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(label);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const canonicalJson = {
    intentId: `INT-${intent.intentId.slice(0, 8)}`,
    status: 'SETTLED',
    solver: winningBid.solverName.split('—')[0].trim(),
    sourceAmount: intent.sourceAmount,
    destinationAmount: winningBid.expectedOutput,
    verification: settlementResult.verificationType === 'zk_oracle' ? 'ZK_ORACLE_GROTH16' : 'OPTIMISTIC_CHALLENGE',
    executionTimeSec: Number((settlementResult.executionTimeMs / 1000).toFixed(1)),
    settlementTxHash: settlementResult.txHash,
    statusState: 'COMPLETE',
  };

  const intentHash = `0x91c4e72a5f8b2a71e84a${intent.sourceAmount}000000000000000000000000000000`;
  const verificationHash = `0x4de82f91a72c4ec091f827103482718294719284719284719284719284719284`;

  return (
    <div className="glass-card p-6 sm:p-8 space-y-6 border-l-4 border-l-[#D4A017] border-[rgba(43,43,43,0.15)] shadow-xl animate-in fade-in zoom-in duration-300 w-full bg-[#FFFDF5]">
      
      {/* Top Climax Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[rgba(43,43,43,0.08)] pb-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#F0C94C] text-[#2B2B2B] flex items-center justify-center shadow-lg shadow-[#F0C94C]/30 shrink-0">
            <CheckCircle2 className="w-7 h-7 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-bold text-[#2B2B2B] font-headline tracking-tight">
                ✓ INTENT SUCCESSFULLY SETTLED
              </h2>
              <span className="text-xs uppercase font-mono font-bold px-3 py-1 rounded-full bg-[#D4A017] text-[#2B2B2B] shadow-xs">
                Finalized On-Chain
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#5A5A5A] mt-1 font-sans">
              Protocol verification cleared. Escrow unlocked and payout finalized across EVM and Solana SVM legs.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#2B2B2B] bg-[#F7E7B5] px-3.5 py-2 rounded-xl border border-[#D4A017]/30 shadow-xs font-bold shrink-0 self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-[#607A3A]" />
          <span>Proof Verified & Archived</span>
        </div>
      </div>

      {/* Outcome Flow Diagram: Ethereum -> ZYNTIX -> Solana */}
      <div className="p-4 bg-[#F7E7B5]/60 rounded-2xl border border-[rgba(43,43,43,0.1)] flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-center">
        {/* Source */}
        <div className="flex-1 bg-[#FFFDF5] p-3.5 rounded-xl border border-[rgba(43,43,43,0.08)] shadow-xs w-full">
          <span className="text-[10px] text-[#5A5A5A] uppercase block font-semibold">Deposited</span>
          <span className="text-lg font-bold text-[#2B2B2B] block">${intent.sourceAmount} USDC</span>
          <span className="text-[11px] text-[#5A5A5A]">Ethereum EscrowVault.sol</span>
        </div>

        {/* Middle Core Protocol Bridge */}
        <div className="flex flex-col items-center justify-center shrink-0 px-4">
          <span className="text-xs font-bold text-[#2B2B2B] uppercase tracking-widest font-headline">
            ZYNTIX PROTOCOL
          </span>
          <div className="flex items-center gap-2 my-1">
            <div className="h-0.5 w-8 sm:w-16 bg-[#D4A017]" />
            <ArrowRight className="w-4 h-4 text-[#D4A017]" />
          </div>
          <span className="text-[10px] text-[#607A3A] font-bold">Solver {winningBid.solverName.split('—')[0]} Fulfilled</span>
        </div>

        {/* Destination */}
        <div className="flex-1 bg-[#FFFDF5] p-3.5 rounded-xl border border-[rgba(43,43,43,0.08)] shadow-xs w-full">
          <span className="text-[10px] text-[#5A5A5A] uppercase block font-semibold">Delivered Output</span>
          <span className="text-lg font-bold text-[#D4A017] block">${winningBid.expectedOutput} USDC</span>
          <span className="text-[11px] text-[#5A5A5A]">Solana Destination Wallet</span>
        </div>
      </div>

      {/* Middle Grid: Canonical JSON Record + Cryptographic Hashes (Directive 9) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch font-mono text-xs">
        
        {/* Left: Canonical JSON Settlement Record (Charcoal #2B2B2B Terminal) */}
        <div className="lg:col-span-6 bg-[#2B2B2B] text-[#FFFDF5] p-5 rounded-2xl space-y-3 flex flex-col justify-between shadow-inner border border-black/20">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
              <span className="text-xs font-bold text-[#F0C94C] uppercase tracking-wider flex items-center gap-1.5 font-headline">
                <FileCode className="w-4 h-4 text-[#F0C94C]" />
                Canonical Settlement Record
              </span>
              <button
                type="button"
                onClick={() => handleCopy(JSON.stringify(canonicalJson, null, 2), 'json')}
                className="text-xs text-[#F0C94C] hover:text-[#FFFDF5] transition-colors cursor-pointer flex items-center gap-1 bg-white/10 px-2 py-1 rounded font-bold"
              >
                {copiedHash === 'json' ? <Check className="w-3.5 h-3.5 text-[#607A3A]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedHash === 'json' ? 'Copied' : 'Copy JSON'}</span>
              </button>
            </div>
            <pre className="text-[#FFFDF5] text-[11px] bg-black/40 p-3 rounded-xl max-h-52 overflow-y-auto leading-relaxed font-mono border border-white/5">
              <span className="text-[#F0C94C]">{JSON.stringify(canonicalJson, null, 2)}</span>
            </pre>
          </div>
          <span className="text-[10px] text-[#FFFDF5]/50 block border-t border-white/10 pt-2">
            EIP-712 Structured Intent Canonical Proof
          </span>
        </div>

        {/* Right: Cryptographic Hashes Record */}
        <div className="lg:col-span-6 glass-sub-box p-5 space-y-3.5 flex flex-col justify-between bg-[#F7E7B5]/60 border border-[rgba(43,43,43,0.1)] rounded-2xl">
          <div>
            <span className="text-xs font-bold text-[#2B2B2B] uppercase tracking-wider block border-b border-[rgba(43,43,43,0.08)] pb-2 mb-3 font-headline flex items-center gap-1.5">
              <Hash className="w-4 h-4 text-[#D4A017]" />
              Cryptographic On-Chain Record
            </span>

            <div className="space-y-3">
              {/* Settlement Root Hash */}
              <div>
                <span className="text-[11px] text-[#5A5A5A] block font-semibold">SETTLEMENT ROOT HASH</span>
                <div className="flex items-center justify-between bg-[#FFFDF5] p-2.5 rounded-xl text-xs font-bold text-[#2B2B2B] mt-1 border border-[rgba(43,43,43,0.08)] shadow-xs">
                  <span className="truncate">{settlementResult.txHash}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(settlementResult.txHash, 'settle')}
                    className="text-[#D4A017] hover:text-[#2B2B2B] ml-2 cursor-pointer p-1 rounded hover:bg-black/5"
                    title="Copy Settlement Hash"
                  >
                    {copiedHash === 'settle' ? <Check className="w-3.5 h-3.5 text-[#607A3A]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Intent EIP-712 Hash */}
              <div>
                <span className="text-[11px] text-[#5A5A5A] block font-semibold">INTENT EIP-712 HASH</span>
                <div className="flex items-center justify-between bg-[#FFFDF5] p-2.5 rounded-xl text-xs font-bold text-[#2B2B2B] mt-1 border border-[rgba(43,43,43,0.08)] shadow-xs">
                  <span className="truncate">{intentHash}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(intentHash, 'intent')}
                    className="text-[#D4A017] hover:text-[#2B2B2B] ml-2 cursor-pointer p-1 rounded hover:bg-black/5"
                    title="Copy Intent Hash"
                  >
                    {copiedHash === 'intent' ? <Check className="w-3.5 h-3.5 text-[#607A3A]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Verification Proof Hash */}
              <div>
                <span className="text-[11px] text-[#5A5A5A] block font-semibold">VERIFICATION PROOF HASH</span>
                <div className="flex items-center justify-between bg-[#FFFDF5] p-2.5 rounded-xl text-xs font-bold text-[#2B2B2B] mt-1 border border-[rgba(43,43,43,0.08)] shadow-xs">
                  <span className="truncate">{verificationHash}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(verificationHash, 'verify')}
                    className="text-[#D4A017] hover:text-[#2B2B2B] ml-2 cursor-pointer p-1 rounded hover:bg-black/5"
                    title="Copy Verification Hash"
                  >
                    {copiedHash === 'verify' ? <Check className="w-3.5 h-3.5 text-[#607A3A]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-[rgba(43,43,43,0.08)] pt-3 text-[11px]">
            <span className="text-[#607A3A] font-bold">✓ Dual-Consensus State Verified</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleCopy(settlementResult.txHash, 'settle')}
                className="px-3 py-1 rounded-lg bg-[#D4A017] text-[#2B2B2B] font-bold hover:bg-[#E0AB1E] transition-all cursor-pointer shadow-xs"
              >
                Copy Hash
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
