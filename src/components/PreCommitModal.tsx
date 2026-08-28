import React, { useState } from 'react';
import type { UserIntent } from '../services/types';
import { getEip712TypedData } from '../services/eip712Service';
import { web3Provider } from '../services/web3Provider';
import { sendDirectGanacheTransaction } from '../services/ganacheRpc';
import { Lock, ShieldCheck, ArrowRight, Wallet, X, Loader2, FileCode, CheckCircle2 } from 'lucide-react';

interface PreCommitModalProps {
  isOpen: boolean;
  intent: UserIntent;
  onConfirm: (signature: string) => void;
  onCancel: () => void;
}

export const PreCommitModal: React.FC<PreCommitModalProps> = ({ isOpen, intent, onConfirm, onCancel }) => {
  const [approvalDone, setApprovalDone] = useState<boolean>(false);
  const [isApproving, setIsApproving] = useState<boolean>(false);
  const [isSigning, setIsSigning] = useState<boolean>(false);

  if (!isOpen) return null;

  const typedData = getEip712TypedData(intent);
  const walletState = web3Provider.getWalletState();

  const handleApproveUsdc = async () => {
    setIsApproving(true);
    // Send direct JSON-RPC transaction to Ganache to mine Step 1 Approval block!
    await sendDirectGanacheTransaction(`approveUSDCAllowance($${intent.sourceAmount})`);
    setIsApproving(false);
    setApprovalDone(true);
  };

  const handleSignAndDeposit = async () => {
    setIsSigning(true);
    try {
      // Send direct JSON-RPC transaction to Ganache to mine Step 2 Escrow Deposit block!
      await sendDirectGanacheTransaction(`lockUserEscrow($${intent.sourceAmount})`);
      const signature = await web3Provider.signEip712TypedData(intent);
      onConfirm(signature);
    } catch (e) {
      console.error('Signature failed', e);
    } finally {
      setIsSigning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="glass-panel-glow max-w-xl w-full p-6 space-y-5 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-indigo-900/50 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center">
              <Lock className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-mono">Two-Step ERC-20 Token Deposit</h3>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 font-mono">
                  Standard ERC-20 Flow
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Step 1: Approve Allowance &rarr; Step 2: EIP-712 Escrow Lock</p>
            </div>
          </div>
          <button onClick={onCancel} className="text-slate-400 hover:text-white" disabled={isSigning || isApproving}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stepper Progress Bar */}
        <div className="grid grid-cols-2 gap-3 font-mono text-xs">
          <div
            className={`p-3 rounded-xl border flex items-center gap-2 ${
              approvalDone
                ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                : isApproving
                ? 'bg-indigo-950/80 border-indigo-500 text-indigo-200 animate-pulse'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            {approvalDone ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : isApproving ? (
              <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
            ) : (
              <span className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold">1</span>
            )}
            <span className="font-bold">1. Approve USDC Spending</span>
          </div>

          <div
            className={`p-3 rounded-xl border flex items-center gap-2 ${
              isSigning
                ? 'bg-indigo-950/80 border-indigo-500 text-indigo-200 animate-pulse'
                : approvalDone
                ? 'bg-slate-900 border-indigo-500/80 text-white'
                : 'bg-slate-900/50 border-slate-800 text-slate-600'
            }`}
          >
            {isSigning ? (
              <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
            ) : (
              <span className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold">2</span>
            )}
            <span className="font-bold">2. EIP-712 Deposit Lock</span>
          </div>
        </div>

        {/* Upfront EIP-712 Schema Code Box */}
        <div className="space-y-2 font-mono text-xs">
          <div className="flex justify-between items-center text-slate-300">
            <span className="flex items-center gap-1.5 font-bold text-indigo-300">
              <FileCode className="w-4 h-4 text-indigo-400" />
              <span>EIP-712 Typed Data Message Schema (Upfront Preview):</span>
            </span>
            <span className="text-[10px] text-slate-500 font-mono">ChainId: {typedData.domain.chainId} (Ganache)</span>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-indigo-900/80 text-[11px] space-y-2 text-indigo-200 max-h-44 overflow-y-auto">
            <div>
              <span className="font-bold text-white block text-[10px] uppercase tracking-wider mb-1 text-slate-400">1. EIP-712 Domain Separator</span>
              <pre className="bg-slate-900 p-2 rounded text-[10px] border border-slate-800 text-indigo-300">
                {JSON.stringify(typedData.domain, null, 2)}
              </pre>
            </div>

            <div>
              <span className="font-bold text-white block text-[10px] uppercase tracking-wider mb-1 text-slate-400">2. Intent Struct Message Payload</span>
              <pre className="bg-slate-900 p-2 rounded text-[10px] border border-slate-800 text-emerald-400">
                {JSON.stringify(typedData.value, null, 2)}
              </pre>
            </div>
          </div>
        </div>

        {/* Wallet Signer Details Summary */}
        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1.5 font-mono text-xs">
          <div className="flex justify-between items-center text-slate-400 text-[11px]">
            <span>Authenticated Wallet Address:</span>
            <span className="text-indigo-400 font-bold">{walletState.address}</span>
          </div>
          <div className="flex justify-between items-center text-slate-400 text-[11px]">
            <span>Escrow Deposit Amount:</span>
            <span className="text-emerald-400 font-bold">${intent.sourceAmount} USDC</span>
          </div>
        </div>

        {/* Security Note */}
        <div className="text-[11px] text-slate-400 font-sans flex items-center gap-1.5 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
          <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>Off-chain signed EIP-712 intent is released from escrow only upon verified solver settlement.</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-1 font-mono">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSigning || isApproving}
            className="px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 transition-all disabled:opacity-50"
          >
            Cancel
          </button>

          {!approvalDone ? (
            <button
              type="button"
              onClick={handleApproveUsdc}
              disabled={isApproving}
              className="flex-1 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-60"
            >
              {isApproving ? (
                <>
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                  <span>Approving USDC in Ganache...</span>
                </>
              ) : (
                <>
                  <Wallet className="w-3.5 h-3.5" />
                  <span>Step 1: Approve USDC Allowance ($500)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSignAndDeposit}
              disabled={isSigning}
              className="flex-1 py-2.5 rounded-lg gradient-bg hover:opacity-95 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-60"
            >
              {isSigning ? (
                <>
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                  <span>Signing EIP-712 & Depositing...</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Step 2: Sign EIP-712 & Deposit Escrow</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
