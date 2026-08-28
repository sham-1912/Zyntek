import React from 'react';
import type { ProofPayload } from '../services/types';
import { ShieldCheck, X, FileJson, CheckCircle2, Lock } from 'lucide-react';

interface ProofModalProps {
  isOpen: boolean;
  proofPayload?: ProofPayload;
  onClose: () => void;
}

export const ProofModal: React.FC<ProofModalProps> = ({ isOpen, proofPayload, onClose }) => {
  if (!isOpen || !proofPayload) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="glass-panel-glow max-w-2xl w-full p-6 space-y-6 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-indigo-900/50 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white font-mono">Cryptographic Proof & Signature Inspector</h3>
                <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono font-bold">
                  {proofPayload.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Verification Method: {proofPayload.verificationType === 'zk_oracle' ? 'ZK-SNARK + Oracle Attestation' : 'Optimistic Challenge Window'}
              </p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* EIP-712 Signature Banner */}
        {proofPayload.eip712Signature && (
          <div className="bg-indigo-950/70 border border-indigo-800 p-3.5 rounded-xl space-y-1 font-mono text-xs text-indigo-200">
            <span className="font-bold text-white uppercase text-[10px] tracking-wider block flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-indigo-400" />
              <span>Verified EIP-712 ECDSA Off-Chain Intent Signature:</span>
            </span>
            <span className="text-emerald-400 break-all block text-[11px] bg-slate-950 p-2 rounded border border-slate-900">
              {proofPayload.eip712Signature}
            </span>
          </div>
        )}

        {/* JSON Proof Payload Viewer */}
        <div className="space-y-2 font-mono text-xs">
          <div className="flex justify-between items-center text-slate-400">
            <span className="flex items-center gap-1 font-bold text-white">
              <FileJson className="w-4 h-4 text-indigo-400" />
              <span>Cryptographic Proof JSON Payload:</span>
            </span>
            <span className="text-[10px] text-slate-500">Timestamp: {new Date(proofPayload.timestamp).toLocaleTimeString()}</span>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-[11px] text-emerald-400 overflow-x-auto max-h-60 font-mono">
            <pre>{JSON.stringify(proofPayload, null, 2)}</pre>
          </div>
        </div>

        {/* Verification Checks */}
        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2 font-mono text-xs">
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Solana Block Slot #{proofPayload.solanaBlockNumber} Finality Confirmed</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Destination Output Delivered Matching User Intent Min Bound</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Attestation Signer ({proofPayload.attestationSigner}) Validated On-Chain</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-all font-mono"
          >
            Close Proof Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
