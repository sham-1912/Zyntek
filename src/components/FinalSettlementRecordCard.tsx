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
    <div className="glass-card p-6 space-y-5 border-[#CEF26D]/40 shadow-2xl animate-in fade-in zoom-in duration-300 w-full">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#CEF26D]/20 border border-[#CEF26D] flex items-center justify-center text-[#CEF26D]">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
              <span>✓ INTENT SUCCESSFULLY SETTLED</span>
              <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full bg-[#CEF26D]/20 text-[#CEF26D] border border-[#CEF26D]/30">
                Finalized On-Chain
              </span>
            </h3>
            <p className="text-xs text-[#CBD5E1] mt-0.5">
              Protocol verification cleared. Escrow unlocked and funds settled across EVM and SVM legs.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#CEF26D] bg-[rgba(14,30,56,0.65)] px-3 py-1.5 rounded-lg border border-[#CEF26D]/30">
          <ShieldCheck className="w-4 h-4" />
          <span>Proof Verified & Archived</span>
        </div>
      </div>

      {/* Middle: 3 Equal / Proportionally Balanced Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch font-mono text-xs">
        {/* Column 1: Settlement Summary */}
        <div className="glass-sub-box p-4 space-y-2.5 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#8DC2FF] uppercase tracking-wider block border-b border-white/5 pb-1 mb-2">
              1. Settlement Summary
            </span>
            <div className="space-y-1.5 text-[#CBD5E1]">
              <div className="flex justify-between">
                <span>Deposited:</span>
                <span className="text-white font-bold">${intent.sourceAmount} USDC</span>
              </div>
              <div className="flex justify-between">
                <span>Delivered:</span>
                <span className="text-[#CEF26D] font-bold">${winningBid.expectedOutput} USDC</span>
              </div>
              <div className="flex justify-between">
                <span>Solver:</span>
                <span className="text-white font-bold">{winningBid.solverName.split('—')[0]}</span>
              </div>
              <div className="flex justify-between">
                <span>Bond Returned:</span>
                <span className="text-[#8DC2FF] font-bold">${winningBid.collateralOfferedUsd} USDC</span>
              </div>
              <div className="flex justify-between">
                <span>Execution Latency:</span>
                <span className="text-[#E9B872] font-bold">{(settlementResult.executionTimeMs / 1000).toFixed(1)}s</span>
              </div>
            </div>
          </div>
          <span className="text-[9px] text-[#CBD5E1]/60 block border-t border-white/5 pt-1.5">
            EVM EscrowVault.sol → Solana CPI
          </span>
        </div>

        {/* Column 2: Canonical JSON Record */}
        <div className="glass-sub-box p-4 space-y-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-white/5 pb-1 mb-1">
              <span className="text-[10px] font-bold text-[#8DC2FF] uppercase tracking-wider flex items-center gap-1">
                <FileCode className="w-3 h-3 text-[#8DC2FF]" />
                2. Canonical JSON Record
              </span>
              <button
                type="button"
                onClick={() => handleCopy(JSON.stringify(canonicalJson, null, 2), 'json')}
                className="text-[10px] text-[#8DC2FF] hover:text-white transition-colors cursor-pointer flex items-center gap-0.5"
              >
                {copiedHash === 'json' ? <Check className="w-3 h-3 text-[#CEF26D]" /> : <Copy className="w-3 h-3" />}
                <span>{copiedHash === 'json' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="text-[#CEF26D] text-[10px] bg-[rgba(10,20,38,0.8)] p-2 rounded-lg max-h-36 overflow-y-auto leading-tight">
              {JSON.stringify(canonicalJson, null, 2)}
            </pre>
          </div>
          <span className="text-[9px] text-[#CBD5E1]/60 block">EIP-712 Structured Envelope</span>
        </div>

        {/* Column 3: Cryptographic Proof */}
        <div className="glass-sub-box p-4 space-y-2.5 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#8DC2FF] uppercase tracking-wider block border-b border-white/5 pb-1 mb-2">
              3. Cryptographic Proof
            </span>
            <div className="space-y-2">
              <div>
                <span className="text-[10px] text-[#CBD5E1] block">Settlement Root Hash</span>
                <div className="flex items-center justify-between bg-[rgba(10,20,38,0.8)] p-2 rounded-lg text-[11px] font-bold text-white mt-1">
                  <span className="truncate">{settlementResult.txHash}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(settlementResult.txHash, 'tx')}
                    className="text-[#8DC2FF] hover:text-white ml-1.5 cursor-pointer"
                    title="Copy Tx Hash"
                  >
                    {copiedHash === 'tx' ? <Check className="w-3.5 h-3.5 text-[#CEF26D]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-[#CBD5E1] block">Solana Slot Signature</span>
                <div className="flex items-center justify-between bg-[rgba(10,20,38,0.8)] p-2 rounded-lg text-[11px] font-bold text-white mt-1">
                  <span className="truncate">5Kn87s...9aK201</span>
                  <button
                    type="button"
                    onClick={() => handleCopy('5Kn87sF2vP79aK201SolanaTxSignatureFinalized', 'sol')}
                    className="text-[#8DC2FF] hover:text-white ml-1.5 cursor-pointer"
                    title="Copy Sol Signature"
                  >
                    {copiedHash === 'sol' ? <Check className="w-3.5 h-3.5 text-[#CEF26D]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <span className="text-[9px] text-[#CEF26D] block border-t border-white/5 pt-1.5">
            ✓ Verified on-chain via Groth16 / Dual-Consensus
          </span>
        </div>
      </div>

      {/* Bottom: Cross-Chain References Chain Strip */}
      <div className="glass-sub-box p-3 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[#CBD5E1] border-t border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-white font-bold">Execution Reference Trail:</span>
          <span className="text-[#8DC2FF]">Ethereum TX (Deposit Locked)</span>
          <ArrowRight className="w-3.5 h-3.5 text-white/40" />
          <span className="text-[#8DC2FF]">Solver Execution (Relayed)</span>
          <ArrowRight className="w-3.5 h-3.5 text-white/40" />
          <span className="text-[#CEF26D] font-bold">Solana Confirmation (Settled)</span>
        </div>

        <span className="text-[10px] text-[#CBD5E1]/70">Zyntek Intent Settlement Engine</span>
      </div>
    </div>
  );
};
