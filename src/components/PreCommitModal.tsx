import React, { useState } from 'react';
import type { UserIntent } from '../services/types';
import { getEip712TypedData, generateEip712Signature } from '../services/eip712Service';
import { Lock, ShieldCheck, ArrowRight, Wallet, X, Code2 } from 'lucide-react';

interface PreCommitModalProps {
  isOpen: boolean;
  intent: UserIntent;
  onConfirm: (signature: string) => void;
  onCancel: () => void;
}

export const PreCommitModal: React.FC<PreCommitModalProps> = ({ isOpen, intent, onConfirm, onCancel }) => {
  const [showEip712Details, setShowEip712Details] = useState<boolean>(false);

  if (!isOpen) return null;

  const typedData = getEip712TypedData(intent);
  const signature = generateEip712Signature(intent);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-panel-glow max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-indigo-900/50 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center">
              <Lock className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-mono">EIP-712 Intent Signature</h3>
              <p className="text-[11px] text-slate-400">Off-Chain ECDSA Typed Data Signing</p>
            </div>
          </div>
          <button onClick={onCancel} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Box */}
        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
          <div className="flex justify-between items-center text-slate-300">
            <span>You Are Locking:</span>
            <span className="text-emerald-400 font-bold text-sm">${intent.sourceAmount} USDC</span>
          </div>

          <div className="flex justify-between items-center text-slate-400">
            <span>Source Chain:</span>
            <span className="text-white">Ethereum (Sepolia Testnet)</span>
          </div>

          <div className="flex justify-between items-center text-slate-400">
            <span>Destination Output:</span>
            <span className="text-cyan-400 font-bold">~${intent.minAcceptableOutput} USDC (Solana)</span>
          </div>

          <div className="flex justify-between items-center text-slate-400">
            <span>Verifying Contract:</span>
            <span className="text-slate-300">{typedData.domain.verifyingContract.slice(0, 12)}...</span>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowEip712Details(!showEip712Details)}
              className="text-indigo-400 hover:text-indigo-300 text-[11px] flex items-center gap-1 font-mono font-bold"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>{showEip712Details ? 'Hide EIP-712 Struct' : 'Inspect EIP-712 Typed Data ↗'}</span>
            </button>

            <span className="text-[10px] text-slate-500 font-mono">ChainId: 11155111</span>
          </div>

          {/* Expanded EIP-712 Typed Struct Inspection */}
          {showEip712Details && (
            <div className="mt-2 p-3 rounded-lg bg-slate-950 border border-indigo-900/80 text-[10px] space-y-2 overflow-x-auto text-indigo-200">
              <div>
                <span className="font-bold text-white block mb-0.5">EIP-712 Domain:</span>
                <pre>{JSON.stringify(typedData.domain, null, 2)}</pre>
              </div>

              <div>
                <span className="font-bold text-white block mb-0.5">Generated ECDSA Signature (65-Byte):</span>
                <span className="text-emerald-400 break-all block font-mono">{signature}</span>
              </div>
            </div>
          )}

          <div className="pt-1 text-[11px] text-indigo-300 flex items-center gap-1.5 font-sans">
            <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>Off-chain signed intent is cryptographically releasable only upon solver proof settlement.</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 transition-all"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => onConfirm(signature)}
            className="flex-1 py-2.5 rounded-lg gradient-bg hover:opacity-90 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>Sign EIP-712 & Deposit $</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
