import React, { useState } from 'react';
import { CheckCircle2, ChevronDown, ChevronUp, Copy, FileCode, Check, ShieldCheck } from 'lucide-react';
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
  const [isJsonExpanded, setIsJsonExpanded] = useState<boolean>(true);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(label);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const jsonRecord = {
    protocol: 'Zyntek Cross-Chain Intent Settlement v1.0',
    intentId: intent.intentId,
    timestamp: new Date(intent.timestamp).toISOString(),
    sourceLeg: {
      network: 'Ethereum (EVM)',
      asset: intent.sourceAsset,
      amountDeposited: intent.sourceAmount,
      escrowContract: '0x345cA3e014Aaf5caA4570b2CD70FB3FE',
      status: 'RELEASED_TO_SOLVER',
    },
    destinationLeg: {
      network: 'Solana (SVM)',
      asset: intent.destinationAsset,
      amountDelivered: winningBid.expectedOutput,
      recipientAddress: '7vA1...B8k9SolanaVault',
      slotNumber: 2847192,
      txSignature: '5Kn8...F2vP7SolTxSignatureFinalized',
    },
    solverFulfillment: {
      solverId: winningBid.solverId,
      solverName: winningBid.solverName,
      collateralBondSecuredUsd: winningBid.collateralOfferedUsd,
      netPayoutUsd: winningBid.expectedOutput,
      executionLatencySec: (settlementResult.executionTimeMs / 1000).toFixed(1),
    },
    verificationProof: {
      mode: settlementResult.verificationType === 'zk_oracle' ? 'Enhanced ZK-SNARK Attestation' : 'Optimistic Dispute Window',
      zkRootHash: '0x8f2a18b6e8a002bc0f1c9d4b31a89c9277e9',
      disputeState: 'NO_CHALLENGES_RAISED',
      status: 'FINALIZED',
    },
  };

  return (
    <div className="glass-card p-6 space-y-6 border-[#CEF26D]/30 shadow-2xl animate-in fade-in zoom-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#CEF26D]/20 border border-[#CEF26D] flex items-center justify-center text-[#CEF26D] shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-white font-mono">
                ✓ INTENT FULFILLED & SETTLED ON-CHAIN
              </h3>
              <span className="text-[10px] uppercase font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#CEF26D]/20 text-[#CEF26D] border border-[#CEF26D]/30">
                Finalized
              </span>
            </div>
            <p className="text-xs text-[#CBD5E1] mt-0.5">
              Protocol verification complete. Escrow funds released to solver and target assets delivered to recipient.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-[#CEF26D] bg-[rgba(14,30,56,0.65)] px-3 py-1.5 rounded-xl border border-[#CEF26D]/30 shrink-0 self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4" />
          <span>Settlement Proof Validated</span>
        </div>
      </div>

      {/* 4 Summary Metric Columns */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
        <div className="glass-sub-box p-3 space-y-1">
          <span className="text-[10px] text-[#8DC2FF]/70 block">Deposited (EVM)</span>
          <span className="text-sm font-bold text-white">${intent.sourceAmount} USDC</span>
          <span className="text-[10px] text-[#CBD5E1] block">Escrow released</span>
        </div>

        <div className="glass-sub-box p-3 space-y-1">
          <span className="text-[10px] text-[#8DC2FF]/70 block">Delivered (SVM)</span>
          <span className="text-sm font-bold text-[#CEF26D]">${winningBid.expectedOutput} USDC</span>
          <span className="text-[10px] text-[#CBD5E1] block">Destination confirmed</span>
        </div>

        <div className="glass-sub-box p-3 space-y-1">
          <span className="text-[10px] text-[#8DC2FF]/70 block">Fulfilling Solver</span>
          <span className="text-sm font-bold text-white">{winningBid.solverName.split('—')[0]}</span>
          <span className="text-[10px] text-[#8DC2FF] block">${winningBid.collateralOfferedUsd} Bond returned</span>
        </div>

        <div className="glass-sub-box p-3 space-y-1">
          <span className="text-[10px] text-[#8DC2FF]/70 block">Total Latency</span>
          <span className="text-sm font-bold text-[#E9B872]">
            {(settlementResult.executionTimeMs / 1000).toFixed(1)}s
          </span>
          <span className="text-[10px] text-[#CBD5E1] block">Verification cleared</span>
        </div>
      </div>

      {/* Cryptographic Hash & Receipts Strip */}
      <div className="glass-sub-box p-3.5 space-y-2 font-mono text-xs">
        <span className="text-[10px] uppercase font-bold text-[#8DC2FF]/80 tracking-wider block">
          Verifiable Cryptographic Proofs & Transaction Hashes:
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
          {/* Solana Settlement Tx */}
          <div className="flex items-center justify-between p-2 rounded-lg bg-[rgba(22,42,70,0.55)] border border-white/5">
            <div className="flex items-center gap-2 truncate">
              <span className="text-[#8DC2FF] shrink-0">Solana SVM Delivery:</span>
              <span className="text-white truncate font-bold">5Kn8...F2vP7</span>
            </div>
            <button
              type="button"
              onClick={() => handleCopy('5Kn87sF2vP79aK201SolanaTxSignatureFinalized', 'sol')}
              className="p-1 rounded hover:bg-white/10 text-[#8DC2FF] hover:text-white transition-colors shrink-0 cursor-pointer ml-2"
              title="Copy Hash"
            >
              {copiedHash === 'sol' ? <Check className="w-3.5 h-3.5 text-[#CEF26D]" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* EVM Escrow Release Tx */}
          <div className="flex items-center justify-between p-2 rounded-lg bg-[rgba(22,42,70,0.55)] border border-white/5">
            <div className="flex items-center gap-2 truncate">
              <span className="text-[#8DC2FF] shrink-0">EVM Escrow Release:</span>
              <span className="text-white truncate font-bold">{settlementResult.txHash}</span>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(settlementResult.txHash, 'evm')}
              className="p-1 rounded hover:bg-white/10 text-[#8DC2FF] hover:text-white transition-colors shrink-0 cursor-pointer ml-2"
              title="Copy Hash"
            >
              {copiedHash === 'evm' ? <Check className="w-3.5 h-3.5 text-[#CEF26D]" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Expandable JSON Record Box */}
      <div className="space-y-2 font-mono text-xs">
        <div
          className="flex items-center justify-between text-[#8DC2FF] cursor-pointer hover:text-white transition-colors"
          onClick={() => setIsJsonExpanded(!isJsonExpanded)}
        >
          <div className="flex items-center gap-1.5 font-bold">
            <FileCode className="w-4 h-4 text-[#8DC2FF]" />
            <span>On-Chain Settlement JSON Record (Verifiable Payload):</span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-[#8DC2FF]/80">
            <span>{isJsonExpanded ? 'Collapse Record' : 'Expand Record'}</span>
            {isJsonExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </div>
        </div>

        {isJsonExpanded && (
          <div className="glass-sub-box p-4 text-[11px] overflow-x-auto max-h-60 overflow-y-auto animate-in fade-in duration-200">
            <pre className="text-[#CEF26D] font-mono leading-relaxed">
              {JSON.stringify(jsonRecord, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
