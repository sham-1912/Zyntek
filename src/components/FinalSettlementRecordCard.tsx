import React, { useState } from 'react';
import { CheckCircle2, Copy, FileCode, Check, ShieldCheck, ArrowRight } from 'lucide-react';
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
    intentId: intent.intentId,
    source: `${intent.sourceAmount} ${intent.sourceAsset} (Ethereum)`,
    destination: `${winningBid.expectedOutput} ${intent.destinationAsset} (Solana)`,
    solver: winningBid.solverName,
    collateralSecured: `$${winningBid.collateralOfferedUsd} USDC`,
    verification: settlementResult.verificationType === 'zk_oracle' ? 'ZK_SNARK_GROTH16' : 'OPTIMISTIC_CHALLENGE',
    latencyMs: settlementResult.executionTimeMs,
    settlementTx: settlementResult.txHash,
    status: 'FULFILLED',
  };

  return (
    <div className="glass-card p-6 space-y-5 border-l-4 border-l-[#D4A017] border-[rgba(43,43,43,0.12)] shadow-lg animate-in fade-in zoom-in duration-300 w-full bg-[#FFFDF5]">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[rgba(43,43,43,0.08)] pb-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#F0C94C] text-[#2B2B2B] flex items-center justify-center shadow-md shadow-[#F0C94C]/40 shrink-0">
            <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-bold text-[#2B2B2B] font-headline flex items-center gap-2">
                <span>✓ INTENT SUCCESSFULLY SETTLED</span>
              </h3>
              <span className="text-[10px] uppercase font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#F7E7B5] text-[#2B2B2B] border border-[#D4A017]/40 shadow-xs">
                Finalized On-Chain
              </span>
            </div>
            <p className="text-xs text-[#5A5A5A] mt-0.5 font-sans">
              Protocol verification cleared. Escrow unlocked and funds settled across EVM and SVM legs.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#2B2B2B] bg-[#F7E7B5] px-3 py-1.5 rounded-lg border border-[#D4A017]/30 shadow-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-[#607A3A]" />
          <span>Proof Verified & Archived</span>
        </div>
      </div>

      {/* Middle: 3 Equal / Proportionally Balanced Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch font-mono text-xs">
        {/* Column 1: Settlement Summary */}
        <div className="glass-sub-box p-4 space-y-2.5 flex flex-col justify-between bg-[#F7E7B5]/60 border border-[rgba(43,43,43,0.1)]">
          <div>
            <span className="text-[10px] font-bold text-[#2B2B2B] uppercase tracking-wider block border-b border-[rgba(43,43,43,0.08)] pb-1 mb-2">
              1. Settlement Summary
            </span>
            <div className="space-y-2 text-[#5A5A5A]">
              <div className="flex justify-between">
                <span>Deposited:</span>
                <span className="text-[#2B2B2B] font-bold">${intent.sourceAmount} USDC</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Delivered:</span>
                <span className="text-[#D4A017] font-bold text-sm bg-[#FFFDF5] px-2 py-0.5 rounded border border-[rgba(43,43,43,0.08)]">
                  ${winningBid.expectedOutput} USDC
                </span>
              </div>
              <div className="flex justify-between">
                <span>Solver:</span>
                <span className="text-[#2B2B2B] font-bold">{winningBid.solverName.split('—')[0]}</span>
              </div>
              <div className="flex justify-between">
                <span>Bond Returned:</span>
                <span className="text-[#607A3A] font-bold">${winningBid.collateralOfferedUsd} USDC</span>
              </div>
              <div className="flex justify-between">
                <span>Execution Latency:</span>
                <span className="text-[#2B2B2B] font-bold">{(settlementResult.executionTimeMs / 1000).toFixed(1)}s</span>
              </div>
            </div>
          </div>
          <span className="text-[9px] text-[#5A5A5A] block border-t border-[rgba(43,43,43,0.08)] pt-1.5">
            EVM EscrowVault.sol → Solana CPI
          </span>
        </div>

        {/* Column 2: Canonical JSON Record (Charcoal #2B2B2B terminal background) */}
        <div className="bg-[#2B2B2B] text-[#FFFDF5] p-4 rounded-xl space-y-2 flex flex-col justify-between shadow-inner border border-black/20">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-1 mb-1">
              <span className="text-[10px] font-bold text-[#F0C94C] uppercase tracking-wider flex items-center gap-1">
                <FileCode className="w-3.5 h-3.5 text-[#F0C94C]" />
                2. Canonical JSON Record
              </span>
              <button
                type="button"
                onClick={() => handleCopy(JSON.stringify(canonicalJson, null, 2), 'json')}
                className="text-[10px] text-[#F0C94C] hover:text-[#FFFDF5] transition-colors cursor-pointer flex items-center gap-0.5 bg-white/10 px-1.5 py-0.5 rounded"
              >
                {copiedHash === 'json' ? <Check className="w-3 h-3 text-[#607A3A]" /> : <Copy className="w-3 h-3" />}
                <span>{copiedHash === 'json' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="text-[#FFFDF5] text-[10px] bg-black/30 p-2 rounded-lg max-h-36 overflow-y-auto leading-tight font-mono">
              <span className="text-[#F0C94C]">{JSON.stringify(canonicalJson, null, 2)}</span>
            </pre>
          </div>
          <span className="text-[9px] text-[#FFFDF5]/50 block">EIP-712 Structured Envelope</span>
        </div>

        {/* Column 3: Cryptographic Proof */}
        <div className="glass-sub-box p-4 space-y-2.5 flex flex-col justify-between bg-[#F7E7B5]/60 border border-[rgba(43,43,43,0.1)]">
          <div>
            <span className="text-[10px] font-bold text-[#2B2B2B] uppercase tracking-wider block border-b border-[rgba(43,43,43,0.08)] pb-1 mb-2">
              3. Cryptographic Proof
            </span>
            <div className="space-y-2">
              <div>
                <span className="text-[10px] text-[#5A5A5A] block">Settlement Root Hash</span>
                <div className="flex items-center justify-between bg-[#FFFDF5] p-2 rounded-lg text-[11px] font-bold text-[#2B2B2B] mt-1 border border-[rgba(43,43,43,0.08)]">
                  <span className="truncate">{settlementResult.txHash}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(settlementResult.txHash, 'tx')}
                    className="text-[#D4A017] hover:text-[#2B2B2B] ml-1.5 cursor-pointer"
                    title="Copy Tx Hash"
                  >
                    {copiedHash === 'tx' ? <Check className="w-3.5 h-3.5 text-[#607A3A]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-[#5A5A5A] block">Solana Slot Signature</span>
                <div className="flex items-center justify-between bg-[#FFFDF5] p-2 rounded-lg text-[11px] font-bold text-[#2B2B2B] mt-1 border border-[rgba(43,43,43,0.08)]">
                  <span className="truncate">5Kn87s...9aK201</span>
                  <button
                    type="button"
                    onClick={() => handleCopy('5Kn87sF2vP79aK201SolanaTxSignatureFinalized', 'sol')}
                    className="text-[#D4A017] hover:text-[#2B2B2B] ml-1.5 cursor-pointer"
                    title="Copy Sol Signature"
                  >
                    {copiedHash === 'sol' ? <Check className="w-3.5 h-3.5 text-[#607A3A]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <span className="text-[9px] text-[#607A3A] font-bold block border-t border-[rgba(43,43,43,0.08)] pt-1.5">
            ✓ Verified on-chain via Groth16 / Dual-Consensus
          </span>
        </div>
      </div>

      {/* Bottom: Cross-Chain References Chain Strip */}
      <div className="bg-[#F7E7B5]/40 p-3 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[#5A5A5A] border border-[rgba(43,43,43,0.08)]">
        <div className="flex items-center gap-2">
          <span className="text-[#2B2B2B] font-bold">Execution Reference Trail:</span>
          <span className="text-[#D4A017] font-semibold">Ethereum TX (Deposit Locked)</span>
          <ArrowRight className="w-3.5 h-3.5 text-black/30" />
          <span className="text-[#D4A017] font-semibold">ZYNTEX Solver Execution</span>
          <ArrowRight className="w-3.5 h-3.5 text-black/30" />
          <span className="text-[#607A3A] font-bold">Solana Confirmation (Settled)</span>
        </div>

        <span className="text-[10px] text-[#5A5A5A]">Zyntek Intent Settlement Engine</span>
      </div>
    </div>
  );
};
