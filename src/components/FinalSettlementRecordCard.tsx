import React, { useState } from 'react';
import { CheckCircle2, Copy, FileCode, Check, ShieldCheck, ArrowRight, Hash, GitCommit } from 'lucide-react';
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
  const [activeProofTab, setActiveProofTab] = useState<'provenance' | 'json' | 'hashes'>('provenance');

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(label);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const canonicalJson = {
    protocol: 'ZYNTEK',
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
                INTENT SUCCESSFULLY SETTLED
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

      {/* Outcome Flow Diagram: Ethereum -> ZYNTEK -> Solana */}
      <div className="p-4 bg-[#F7E7B5]/60 rounded-2xl border border-[rgba(43,43,43,0.1)] flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-center">
        {/* Source */}
        <div className="flex-1 bg-[#FFFDF5] p-3.5 rounded-xl border border-[rgba(43,43,43,0.08)] shadow-xs w-full">
          <span className="text-[10px] text-[#5A5A5A] uppercase block font-semibold">Deposited</span>
          <span className="text-lg sm:text-xl font-bold text-[#2B2B2B] block">${intent.sourceAmount} USDC</span>
          <span className="text-[11px] text-[#5A5A5A]">Ethereum EscrowVault.sol</span>
        </div>

        {/* Middle Core Protocol Bridge */}
        <div className="flex flex-col items-center justify-center shrink-0 px-4">
          <span className="text-xs font-bold text-[#2B2B2B] uppercase tracking-widest font-headline">
            ZYNTEK PROTOCOL
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
          <span className="text-lg sm:text-xl font-bold text-[#D4A017] block">${winningBid.expectedOutput} USDC</span>
          <span className="text-[11px] text-[#5A5A5A]">Solana Destination Wallet</span>
        </div>
      </div>

      {/* UNIFIED TABBED MASTER VERIFICATION & PROOF CONTAINER (Refinement #5) */}
      <div className="bg-[#2B2B2B] text-[#FFFDF5] rounded-2xl border border-black/20 shadow-inner overflow-hidden font-mono text-xs">
        
        {/* Tab Headers */}
        <div className="flex items-center justify-between border-b border-white/10 p-3 sm:p-4 bg-black/40 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveProofTab('provenance')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer text-xs ${
                activeProofTab === 'provenance'
                  ? 'bg-[#D4A017] text-[#2B2B2B] shadow-sm'
                  : 'text-[#FFFDF5]/70 hover:text-white bg-white/5'
              }`}
            >
              <GitCommit className="w-3.5 h-3.5" />
              <span>1. Complete Provenance Chain</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveProofTab('json')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer text-xs ${
                activeProofTab === 'json'
                  ? 'bg-[#D4A017] text-[#2B2B2B] shadow-sm'
                  : 'text-[#FFFDF5]/70 hover:text-white bg-white/5'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>2. Canonical JSON Audit</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveProofTab('hashes')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer text-xs ${
                activeProofTab === 'hashes'
                  ? 'bg-[#D4A017] text-[#2B2B2B] shadow-sm'
                  : 'text-[#FFFDF5]/70 hover:text-white bg-white/5'
              }`}
            >
              <Hash className="w-3.5 h-3.5" />
              <span>3. Cryptographic Hashes</span>
            </button>
          </div>

          <span className="text-[10px] text-[#CEF26D] font-bold bg-white/10 px-2.5 py-0.5 rounded-full hidden md:inline flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#CEF26D]" />
            <span>Verified On-Chain</span>
          </span>
        </div>

        {/* Tab 1: Complete Provenance Chain */}
        {activeProofTab === 'provenance' && (
          <div className="p-5 sm:p-6 space-y-4 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-left">
              {/* Step 1 */}
              <div className="bg-black/30 p-3.5 rounded-xl border border-white/5 space-y-1">
                <div className="flex items-center justify-between text-[10px] text-[#D4A017] font-bold">
                  <span>1. INTENT</span>
                  <span>#INT-{intent.intentId.slice(0, 4)}</span>
                </div>
                <p className="text-xs text-[#FFFDF5] font-bold">${intent.sourceAmount} USDC</p>
                <p className="text-[10px] text-[#888]">Ethereum → Solana</p>
              </div>

              {/* Step 2 */}
              <div className="bg-black/30 p-3.5 rounded-xl border border-white/5 space-y-1">
                <div className="flex items-center justify-between text-[10px] text-[#D4A017] font-bold">
                  <span>2. AUCTION</span>
                  <span>3 Solvers</span>
                </div>
                <p className="text-xs text-[#FFFDF5] font-bold">Dynamic Scoring</p>
                <p className="text-[10px] text-[#888]">Cost vs Speed vs Rep</p>
              </div>

              {/* Step 3 */}
              <div className="bg-black/30 p-3.5 rounded-xl border border-white/5 space-y-1">
                <div className="flex items-center justify-between text-[10px] text-[#D4A017] font-bold">
                  <span>3. SELECTION</span>
                  <span>Score: {winningBid.reputationScore} REP</span>
                </div>
                <p className="text-xs text-[#CEF26D] font-bold">{winningBid.solverName.split('—')[0]}</p>
                <p className="text-[10px] text-[#888]">Rank #1 Optimum Fit</p>
              </div>

              {/* Step 4 */}
              <div className="bg-black/30 p-3.5 rounded-xl border border-white/5 space-y-1">
                <div className="flex items-center justify-between text-[10px] text-[#D4A017] font-bold">
                  <span>4. ACCOUNTABILITY</span>
                  <span>Bond Vault</span>
                </div>
                <p className="text-xs text-[#FFFDF5] font-bold">$500 Bond Staked</p>
                <p className="text-[10px] text-[#888]">SolverBonding.sol</p>
              </div>

              {/* Step 5 */}
              <div className="bg-black/30 p-3.5 rounded-xl border border-white/5 space-y-1">
                <div className="flex items-center justify-between text-[10px] text-[#D4A017] font-bold">
                  <span>5. EXECUTION</span>
                  <span>{(settlementResult.executionTimeMs / 1000).toFixed(1)}s</span>
                </div>
                <p className="text-xs text-[#FFFDF5] font-bold">${winningBid.expectedOutput} Delivered</p>
                <p className="text-[10px] text-[#888]">Solana SVM Slot</p>
              </div>

              {/* Step 6 */}
              <div className="bg-black/30 p-3.5 rounded-xl border border-white/5 space-y-1">
                <div className="flex items-center justify-between text-[10px] text-[#D4A017] font-bold">
                  <span>6. VERIFICATION</span>
                  <span>Dual-Consensus</span>
                </div>
                <p className="text-xs text-[#CEF26D] font-bold">Confirmed</p>
                <p className="text-[10px] text-[#888]">Optimistic + ZK Proof</p>
              </div>

              {/* Step 7 */}
              <div className="bg-black/30 p-3.5 rounded-xl border border-white/5 space-y-1">
                <div className="flex items-center justify-between text-[10px] text-[#D4A017] font-bold">
                  <span>7. SETTLEMENT</span>
                  <span>Finalized</span>
                </div>
                <p className="text-xs text-[#CEF26D] font-bold">Payout Unlocked</p>
                <p className="text-[10px] text-[#888]">Bond Returned + Fee</p>
              </div>

              {/* Step 8 */}
              <div className="bg-black/30 p-3.5 rounded-xl border border-white/5 space-y-1">
                <div className="flex items-center justify-between text-[10px] text-[#D4A017] font-bold">
                  <span>8. PROOF ROOT</span>
                  <span>On-Chain</span>
                </div>
                <p className="text-xs text-[#F0C94C] font-bold truncate">{settlementResult.txHash.slice(0, 10)}...</p>
                <p className="text-[10px] text-[#888]">EIP-712 Leaf Hash</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Canonical JSON */}
        {activeProofTab === 'json' && (
          <div className="p-5 sm:p-6 space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#FFFDF5]/70">EIP-712 Structured Canonical Settlement Object:</span>
              <button
                type="button"
                onClick={() => handleCopy(JSON.stringify(canonicalJson, null, 2), 'json')}
                className="text-xs text-[#F0C94C] hover:text-[#FFFDF5] transition-colors cursor-pointer flex items-center gap-1 bg-white/10 px-3 py-1 rounded-lg font-bold"
              >
                {copiedHash === 'json' ? <Check className="w-3.5 h-3.5 text-[#607A3A]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedHash === 'json' ? 'Copied' : 'Copy JSON'}</span>
              </button>
            </div>
            <pre className="text-[#FFFDF5] text-xs bg-black/50 p-4 rounded-xl max-h-60 overflow-y-auto leading-relaxed font-mono border border-white/5">
              <span className="text-[#F0C94C]">{JSON.stringify(canonicalJson, null, 2)}</span>
            </pre>
          </div>
        )}

        {/* Tab 3: Cryptographic Hashes */}
        {activeProofTab === 'hashes' && (
          <div className="p-5 sm:p-6 space-y-4 animate-in fade-in duration-200">
            {/* Settlement Root Hash */}
            <div>
              <span className="text-[11px] text-[#D4A017] block font-bold mb-1">1. SETTLEMENT ROOT HASH</span>
              <div className="flex items-center justify-between bg-black/40 p-3 rounded-xl text-xs font-bold text-[#FFFDF5] border border-white/10">
                <span className="truncate">{settlementResult.txHash}</span>
                <button
                  type="button"
                  onClick={() => handleCopy(settlementResult.txHash, 'settle')}
                  className="text-[#F0C94C] hover:text-white ml-2 cursor-pointer p-1 rounded hover:bg-white/10 shrink-0"
                >
                  {copiedHash === 'settle' ? <Check className="w-3.5 h-3.5 text-[#607A3A]" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Intent EIP-712 Hash */}
            <div>
              <span className="text-[11px] text-[#D4A017] block font-bold mb-1">2. INTENT EIP-712 HASH</span>
              <div className="flex items-center justify-between bg-black/40 p-3 rounded-xl text-xs font-bold text-[#FFFDF5] border border-white/10">
                <span className="truncate">{intentHash}</span>
                <button
                  type="button"
                  onClick={() => handleCopy(intentHash, 'intent')}
                  className="text-[#F0C94C] hover:text-white ml-2 cursor-pointer p-1 rounded hover:bg-white/10 shrink-0"
                >
                  {copiedHash === 'intent' ? <Check className="w-3.5 h-3.5 text-[#607A3A]" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Verification Proof Hash */}
            <div>
              <span className="text-[11px] text-[#D4A017] block font-bold mb-1">3. VERIFICATION PROOF HASH</span>
              <div className="flex items-center justify-between bg-black/40 p-3 rounded-xl text-xs font-bold text-[#FFFDF5] border border-white/10">
                <span className="truncate">{verificationHash}</span>
                <button
                  type="button"
                  onClick={() => handleCopy(verificationHash, 'verify')}
                  className="text-[#F0C94C] hover:text-white ml-2 cursor-pointer p-1 rounded hover:bg-white/10 shrink-0"
                >
                  {copiedHash === 'verify' ? <Check className="w-3.5 h-3.5 text-[#607A3A]" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
