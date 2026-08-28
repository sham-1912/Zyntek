import React, { useState } from 'react';
import type { UserIntent } from '../services/types';
import { web3Provider } from '../services/web3Provider';
import { Lock, Key, AlertCircle } from 'lucide-react';

interface PreCommitModalProps {
  isOpen: boolean;
  intent: UserIntent;
  onConfirm: (signature: string) => void;
  onCancel: () => void;
}

export const PreCommitModal: React.FC<PreCommitModalProps> = ({
  isOpen,
  intent,
  onConfirm,
  onCancel,
}) => {
  const [isSigning, setIsSigning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSignIntent = async () => {
    setIsSigning(true);
    setError(null);
    try {
      const signature = await web3Provider.signEip712TypedData(intent);
      onConfirm(signature);
    } catch (err: any) {
      setError(err.message || 'Signature request rejected');
      setIsSigning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2B2B2B]/60 backdrop-blur-sm">
      <div className="bg-[#FFFDF5] border border-[rgba(43,43,43,0.15)] rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in duration-200 text-[#2B2B2B]">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[rgba(43,43,43,0.08)] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#F7E7B5] border border-[#D4A017]/40 flex items-center justify-center text-[#D4A017]">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#2B2B2B] font-headline">
                Authorize Intent Authorization
              </h3>
              <p className="text-xs text-[#5A5A5A]">EIP-712 Standard Cryptographic Signature</p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#F7E7B5] text-[#2B2B2B] border border-[#D4A017]/40">
            Escrow Guard
          </span>
        </div>

        {/* Intent Summary Box */}
        <div className="bg-[#F7E7B5]/60 p-4 rounded-xl space-y-2.5 font-mono text-xs border border-[rgba(43,43,43,0.08)]">
          <div className="flex justify-between items-center text-[#5A5A5A]">
            <span>Deposit Amount:</span>
            <span className="text-[#2B2B2B] font-bold text-sm">${intent.sourceAmount} {intent.sourceAsset} (Ethereum)</span>
          </div>

          <div className="flex justify-between items-center text-[#5A5A5A]">
            <span>Minimum Target Output:</span>
            <span className="text-[#D4A017] font-bold text-sm">≥ ${intent.minAcceptableOutput} {intent.destinationAsset} (Solana)</span>
          </div>

          <div className="flex justify-between items-center text-[#5A5A5A]">
            <span>Strategy Weights:</span>
            <span className="text-[#2B2B2B] font-bold">Cost {intent.sliders.cost}% · Speed {intent.sliders.speed}% · Safety {intent.sliders.safety}%</span>
          </div>

          <div className="border-t border-[rgba(43,43,43,0.08)] pt-2 flex justify-between text-[11px] text-[#5A5A5A]">
            <span>Timeout Deadline:</span>
            <span className="text-[#2B2B2B] font-bold">10:00 mins (Auto-refund on failure)</span>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-[#B84A39]/15 border border-[#B84A39] rounded-xl flex items-center gap-2 text-xs text-[#B84A39]">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSigning}
            className="px-4 py-2 rounded-xl text-xs font-mono text-[#5A5A5A] hover:text-[#2B2B2B] transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSignIntent}
            disabled={isSigning}
            className="px-5 py-2.5 rounded-xl bg-[#D4A017] hover:bg-[#E0AB1E] font-mono text-xs font-bold text-[#2B2B2B] flex items-center gap-2 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
          >
            <Key className="w-3.5 h-3.5" />
            <span>{isSigning ? 'Requesting Wallet...' : 'Sign & Broadcast Intent →'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
