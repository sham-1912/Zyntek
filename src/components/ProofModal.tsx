import React from 'react';
import type { ProofPayload, VerificationType, SettlementResult } from '../services/types';
import { ShieldCheck, X, FileCode, Lock } from 'lucide-react';

interface ProofModalProps {
  isOpen: boolean;
  proofPayload?: ProofPayload;
  verificationType?: VerificationType;
  intentId?: string;
  settlementResult?: SettlementResult;
  onClose: () => void;
}

export const ProofModal: React.FC<ProofModalProps> = ({
  isOpen,
  proofPayload,
  verificationType = 'optimistic',
  intentId = 'INT-8492',
  settlementResult,
  onClose,
}) => {
  if (!isOpen) return null;

  const mockPayload: ProofPayload = proofPayload || {
    intentId,
    verificationType,
    zkProofHash: `0xzk77f${Math.random().toString(16).substring(2, 12)}a2b9`,
    solanaBlockNumber: 2847192,
    solanaTxSignature: '5K9a8vWx77b1e49085c2e4f1',
    attestationSigner: '0xOracleSigner...77A1',
    eip712Signature: '0x3a4b91c78...65f90',
    timestamp: Date.now(),
    status: settlementResult?.success === false ? 'REJECTED' : 'VALIDATED',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1915]/60 backdrop-blur-sm">
      <div className="ix-card max-w-2xl w-full p-6 space-y-6 animate-in fade-in zoom-in-95 duration-200 border-[#E5D19E] shadow-xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E8E4DA] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF5E8] border border-[#E5D19E] flex items-center justify-center text-[#8C6407]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-[#1A1915] font-sans">Cryptographic Proof & Payload Inspector</h3>
                <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-[#EAF6ED] text-[#1B5E20] border border-[#A8E0B7] font-mono font-bold">
                  {mockPayload.status}
                </span>
              </div>
              <p className="text-xs text-[#6B6659] font-mono">
                Method: {mockPayload.verificationType === 'zk_oracle' ? 'ZK-SNARK + Oracle Attestation' : 'Optimistic Challenge Window'}
              </p>
            </div>
          </div>

          <button onClick={onClose} className="text-[#7A7568] hover:text-[#1A1915]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* EIP-712 Signature Banner */}
        {mockPayload.eip712Signature && (
          <div className="ix-card-subtle p-3.5 space-y-1 font-mono text-xs border-[#E8E4DA]">
            <span className="font-bold text-[#1A1915] uppercase text-[10px] tracking-wider block flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#C69214]" />
              <span>Verified EIP-712 ECDSA Off-Chain Intent Signature:</span>
            </span>
            <span className="text-[#8C6407] break-all block text-[11px] bg-white p-2 rounded border border-[#DFD9CD]">
              {mockPayload.eip712Signature}
            </span>
          </div>
        )}

        {/* JSON Proof Payload Viewer */}
        <div className="space-y-2 font-mono text-xs">
          <div className="flex justify-between items-center text-[#7A7568]">
            <span className="flex items-center gap-1 font-bold text-[#1A1915]">
              <FileCode className="w-4 h-4 text-[#C69214]" />
              <span>Cryptographic Proof JSON Payload:</span>
            </span>
            <span className="text-[11px]">Attestation: 0xOracle...77A1</span>
          </div>

          <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#E8E4DA] max-h-52 overflow-y-auto text-[11px] font-mono text-[#38352F]">
            <pre className="whitespace-pre-wrap">{JSON.stringify(mockPayload, null, 2)}</pre>
          </div>
        </div>

        {/* Footer Close Button */}
        <div className="pt-2 flex justify-end">
          <button type="button" onClick={onClose} className="ix-btn-gold px-5 py-2 text-xs">
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  );
};
