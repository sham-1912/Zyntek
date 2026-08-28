import React, { useState } from 'react';
import type { UserIntent } from '../services/types';
import { getEip712TypedData } from '../services/eip712Service';
import { web3Provider } from '../services/web3Provider';
import { Lock, ShieldCheck, ArrowRight, X, Loader2, FileCode, CheckCircle2 } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1915]/60 backdrop-blur-sm">
      <div className="ix-card max-w-xl w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200 shadow-xl border-[#E5D19E]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E8E4DA] pb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#FAF5E8] border border-[#E5D19E] flex items-center justify-center text-[#8C6407]">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#1A1915] font-sans">Two-Step ERC-20 Token Deposit</h3>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#FAF5E8] text-[#8C6407] border border-[#E5D19E] font-mono">
                  ERC-20 Security Flow
                </span>
              </div>
              <p className="text-xs text-[#6B6659]">Step 1: Approve Allowance &rarr; Step 2: EIP-712 Escrow Lock</p>
            </div>
          </div>
          <button onClick={onCancel} className="text-[#7A7568] hover:text-[#1A1915]" disabled={isSigning || isApproving}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stepper Progress Bar */}
        <div className="grid grid-cols-2 gap-3 font-mono text-xs">
          <div
            className={`p-3 rounded-xl border flex items-center gap-2 ${
              approvalDone
                ? 'bg-[#EAF6ED] border-[#A8E0B7] text-[#1B5E20]'
                : isApproving
                ? 'bg-[#FAF5E8] border-[#C69214] text-[#8C6407] animate-pulse'
                : 'bg-[#FAF8F5] border-[#E8E4DA] text-[#7A7568]'
            }`}
          >
            {approvalDone ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : isApproving ? (
              <Loader2 className="w-4 h-4 text-[#C69214] animate-spin" />
            ) : (
              <span className="w-4 h-4 rounded-full bg-[#E8E4DA] flex items-center justify-center text-[10px] font-bold text-[#1A1915]">1</span>
            )}
            <span className="font-bold">1. Approve USDC Allowance</span>
          </div>

          <div
            className={`p-3 rounded-xl border flex items-center gap-2 ${
              isSigning
                ? 'bg-[#FAF5E8] border-[#C69214] text-[#8C6407] animate-pulse'
                : approvalDone
                ? 'bg-white border-[#C69214] text-[#1A1915]'
                : 'bg-[#FAF8F5] border-[#E8E4DA] text-[#7A7568]'
            }`}
          >
            {isSigning ? (
              <Loader2 className="w-4 h-4 text-[#C69214] animate-spin" />
            ) : (
              <span className="w-4 h-4 rounded-full bg-[#E8E4DA] flex items-center justify-center text-[10px] font-bold text-[#1A1915]">2</span>
            )}
            <span className="font-bold">2. Sign EIP-712 & Deposit</span>
          </div>
        </div>

        {/* Intent Summary Box */}
        <div className="ix-card-subtle p-4 space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between text-[#6B6659]">
            <span>Intent ID:</span>
            <span className="font-bold text-[#1A1915]">{intent.intentId}</span>
          </div>

          <div className="flex items-center justify-between text-[#6B6659]">
            <span>Source Deposit:</span>
            <span className="font-bold text-[#1A1915]">${intent.sourceAmount.toLocaleString()} USDC</span>
          </div>

          <div className="flex items-center justify-between text-[#6B6659]">
            <span>Min Target Output:</span>
            <span className="font-bold text-[#C69214]">${intent.minAcceptableOutput.toLocaleString()} USDC</span>
          </div>

          <div className="flex items-center justify-between text-[#6B6659]">
            <span>Origin Account:</span>
            <span className="font-bold text-[#38352F]">{walletState.address.slice(0, 8)}...{walletState.address.slice(-6)}</span>
          </div>
        </div>

        {/* EIP-712 Cryptographic Payload Inspector */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-[#7A7568] uppercase">
            <span className="flex items-center gap-1">
              <FileCode className="w-3.5 h-3.5 text-[#C69214]" />
              <span>EIP-712 Structured Data Payload</span>
            </span>
            <span>Verifying Contract: 0x71C8...845</span>
          </div>

          <div className="bg-[#FAF8F5] p-3 rounded-lg border border-[#E8E4DA] max-h-36 overflow-y-auto text-[11px] font-mono text-[#38352F]">
            <pre className="whitespace-pre-wrap">{JSON.stringify(typedData.value, null, 2)}</pre>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isApproving || isSigning}
            className="ix-btn-outline px-4 py-2 text-xs"
          >
            Cancel
          </button>

          {!approvalDone ? (
            <button
              type="button"
              onClick={handleApproveUsdc}
              disabled={isApproving}
              className="ix-btn-gold px-5 py-2 text-xs flex items-center gap-2"
            >
              {isApproving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Approving USDC Allowance...</span>
                </>
              ) : (
                <>
                  <span>Step 1: Approve USDC Allowance (${intent.sourceAmount})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSignAndDeposit}
              disabled={isSigning}
              className="ix-btn-gold px-5 py-2 text-xs flex items-center gap-2"
            >
              {isSigning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing & Depositing to Ganache...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Step 2: Sign EIP-712 & Deposit Escrow</span>
                </>
              )}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
