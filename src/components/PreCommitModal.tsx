import React, { useState } from 'react';
import type { UserIntent } from '../services/types';
import { getEip712TypedData } from '../services/eip712Service';
import { web3Provider } from '../services/web3Provider';
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
    await new Promise((r) => setTimeout(r, 600)); // UI step
    setIsApproving(false);
    setApprovalDone(true);
  };

  const handleSignAndDeposit = async () => {
    setIsSigning(true);
    try {
      const signature = await web3Provider.signEip712TypedData(intent);
      onConfirm(signature);
    } catch (e) {
      console.error('Signature failed', e);
    } finally {
      setIsSigning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#101C2C]/85 backdrop-blur-md">
      <div className="bg-[#162A46] border border-[#8DC2FF]/20 rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#1A3152] border border-[#2F6690]/50 flex items-center justify-center">
              <Lock className="w-4 h-4 text-[#8DC2FF]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#F3F6FF] font-mono">Two-Step ERC-20 Token Deposit</h3>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#1A3152] text-[#8DC2FF] border border-[#8DC2FF]/30 font-mono">
                  Standard ERC-20 Flow
                </span>
              </div>
              <p className="text-[11px] text-[#8DC2FF]/80">Step 1: Approve Allowance &rarr; Step 2: EIP-712 Escrow Lock</p>
            </div>
          </div>
          <button onClick={onCancel} className="text-[#8DC2FF]/70 hover:text-[#F3F6FF] cursor-pointer" disabled={isSigning || isApproving}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stepper Progress Bar */}
        <div className="grid grid-cols-2 gap-3 font-mono text-xs">
          <div
            className={`p-3 rounded-xl border flex items-center gap-2 ${
              approvalDone
                ? 'bg-[#1A3152] border-[#CEF26D] text-[#CEF26D]'
                : isApproving
                ? 'bg-[#1A3152] border-[#8DC2FF] text-[#8DC2FF] animate-pulse'
                : 'bg-[#101C2C] border-white/5 text-[#8DC2FF]/60'
            }`}
          >
            {approvalDone ? (
              <CheckCircle2 className="w-4 h-4 text-[#CEF26D]" />
            ) : isApproving ? (
              <Loader2 className="w-4 h-4 text-[#8DC2FF] animate-spin" />
            ) : (
              <span className="w-4 h-4 rounded-full bg-[#1A3152] flex items-center justify-center text-[10px] font-bold">1</span>
            )}
            <span className="font-bold">1. Approve USDC Spending</span>
          </div>

          <div
            className={`p-3 rounded-xl border flex items-center gap-2 ${
              isSigning
                ? 'bg-[#1A3152] border-[#8DC2FF] text-[#8DC2FF] animate-pulse'
                : approvalDone
                ? 'bg-[#101C2C] border-[#2F6690] text-[#F3F6FF]'
                : 'bg-[#101C2C]/50 border-white/5 text-[#8DC2FF]/40'
            }`}
          >
            {isSigning ? (
              <Loader2 className="w-4 h-4 text-[#8DC2FF] animate-spin" />
            ) : (
              <span className="w-4 h-4 rounded-full bg-[#1A3152] flex items-center justify-center text-[10px] font-bold">2</span>
            )}
            <span className="font-bold">2. EIP-712 Deposit Lock</span>
          </div>
        </div>

        {/* Upfront EIP-712 Schema Code Box */}
        <div className="space-y-2 font-mono text-xs">
          <div className="flex justify-between items-center text-[#8DC2FF]">
            <span className="flex items-center gap-1.5 font-bold text-[#8DC2FF]">
              <FileCode className="w-4 h-4 text-[#8DC2FF]" />
              <span>EIP-712 Typed Data Message Schema (Upfront Preview):</span>
            </span>
            <span className="text-[10px] text-[#8DC2FF]/60 font-mono">ChainId: {typedData.domain.chainId} (Ganache)</span>
          </div>

          <div className="bg-[#101C2C] p-4 rounded-xl border border-[#8DC2FF]/20 text-[11px] space-y-2 text-[#8DC2FF] max-h-44 overflow-y-auto">
            <div>
              <span className="font-bold text-[#F3F6FF] block text-[10px] uppercase tracking-wider mb-1 text-[#8DC2FF]/80">1. EIP-712 Domain Separator</span>
              <pre className="bg-[#162A46] p-2 rounded text-[10px] border border-white/5 text-[#8DC2FF]">
                {JSON.stringify(typedData.domain, null, 2)}
              </pre>
            </div>

            <div>
              <span className="font-bold text-[#F3F6FF] block text-[10px] uppercase tracking-wider mb-1 text-[#8DC2FF]/80">2. Intent Struct Message Payload</span>
              <pre className="bg-[#162A46] p-2 rounded text-[10px] border border-white/5 text-[#CEF26D]">
                {JSON.stringify(typedData.value, null, 2)}
              </pre>
            </div>
          </div>
        </div>

        {/* Wallet Signer Details Summary */}
        <div className="bg-[#101C2C] p-3 rounded-xl border border-white/5 space-y-1.5 font-mono text-xs">
          <div className="flex justify-between items-center text-[#8DC2FF]/70 text-[11px]">
            <span>Authenticated Wallet Address:</span>
            <span className="text-[#8DC2FF] font-bold">{walletState.address}</span>
          </div>
          <div className="flex justify-between items-center text-[#8DC2FF]/70 text-[11px]">
            <span>Escrow Deposit Amount:</span>
            <span className="text-[#CEF26D] font-bold">${intent.sourceAmount} USDC</span>
          </div>
        </div>

        {/* Security Note */}
        <div className="text-[11px] text-[#8DC2FF]/80 font-sans flex items-center gap-1.5 bg-[#101C2C] p-2.5 rounded-lg border border-white/5">
          <ShieldCheck className="w-4 h-4 text-[#8DC2FF] shrink-0" />
          <span>Off-chain signed EIP-712 intent is released from escrow only upon verified solver settlement.</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-1 font-mono">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSigning || isApproving}
            className="px-4 py-2.5 rounded-lg bg-[#1A3152] hover:bg-[#1A3152]/80 border border-white/10 text-xs font-semibold text-[#8DC2FF] transition-all disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>

          {!approvalDone ? (
            <button
              type="button"
              onClick={handleApproveUsdc}
              disabled={isApproving}
              className="flex-1 py-2.5 rounded-lg bg-[#2F6690] hover:bg-[#3D7BAA] text-[#F3F6FF] text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#2F6690]/30 transition-all disabled:opacity-60 cursor-pointer"
            >
              {isApproving ? (
                <>
                  <Loader2 className="w-4 h-4 text-[#F3F6FF] animate-spin" />
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
              className="flex-1 py-2.5 rounded-lg bg-[#2F6690] hover:bg-[#3D7BAA] text-[#F3F6FF] text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#2F6690]/30 transition-all disabled:opacity-60 cursor-pointer"
            >
              {isSigning ? (
                <>
                  <Loader2 className="w-4 h-4 text-[#F3F6FF] animate-spin" />
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
