import React, { useState } from 'react';
import type { BlockReceipt, EvmEventLog } from '../services/types';
import { ExternalLink, X, CheckCircle2, ShieldCheck, Cpu, Terminal, Copy, Check } from 'lucide-react';

interface BlockExplorerModalProps {
  isOpen: boolean;
  receipt?: BlockReceipt;
  onClose: () => void;
}

export const BlockExplorerModal: React.FC<BlockExplorerModalProps> = ({ isOpen, receipt, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'evm_logs' | 'solana_cpi'>('overview');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen || !receipt) return null;

  const handleCopyHash = () => {
    navigator.clipboard.writeText(receipt.txHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-700 max-w-2xl w-full rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in duration-200">
        
        {/* Etherscan-Style Explorer Top Header Bar */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center">
              <ExternalLink className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white font-mono">Sepolia Etherscan / Solana Explorer</h3>
                <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono font-bold">
                  On-Chain Verified
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">Tx Hash: {receipt.txHash}</p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Explorer Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 px-6 text-xs font-mono">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 border-b-2 font-bold transition-all ${
              activeTab === 'overview'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Transaction Overview
          </button>

          <button
            onClick={() => setActiveTab('evm_logs')}
            className={`py-3 px-4 border-b-2 font-bold transition-all ${
              activeTab === 'evm_logs'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Decoded EVM Event Logs ({receipt.evmLogs?.length || 1})
          </button>

          {receipt.solanaCpi && (
            <button
              onClick={() => setActiveTab('solana_cpi')}
              className={`py-3 px-4 border-b-2 font-bold transition-all ${
                activeTab === 'solana_cpi'
                  ? 'border-cyan-500 text-cyan-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Solana CPI Execution Logs
            </button>
          )}
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto space-y-4 font-mono text-xs text-slate-300">
          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-3">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5">
                <div className="flex justify-between items-center pb-2 border-b border-slate-900">
                  <span className="text-slate-400">Transaction Status:</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Success (Finalized)
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Step Name:</span>
                  <span className="text-white font-bold">{receipt.stepName}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400">EVM Block Number:</span>
                  <span className="text-indigo-400 font-bold">#{receipt.blockNumber}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Gas Used by Transaction:</span>
                  <span className="text-white font-bold">{receipt.gasUsed.toLocaleString()} units</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Proof Payload:</span>
                  <span className="text-cyan-400 text-[11px] font-bold">{receipt.proofData || 'EVM Standard Attestation'}</span>
                </div>
              </div>

              <div className="flex items-center justify-between bg-slate-950 p-3 rounded-lg border border-slate-800 text-[11px]">
                <span className="text-slate-400">Full Tx Hash: {receipt.txHash}</span>
                <button
                  onClick={handleCopyHash}
                  className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 flex items-center gap-1 font-sans"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy Hash'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Tab 2: Decoded EVM Logs */}
          {activeTab === 'evm_logs' && (
            <div className="space-y-3">
              {(receipt.evmLogs || []).map((log: EvmEventLog, idx: number) => (
                <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-indigo-900/60 space-y-2 font-mono">
                  <div className="flex items-center justify-between text-indigo-300 font-bold border-b border-slate-900 pb-2">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-indigo-400" />
                      <span>event {log.eventName}</span>
                    </span>
                    <span className="text-[10px] text-slate-500">Log Index #{idx}</span>
                  </div>

                  <div className="text-[11px] space-y-1">
                    <div><span className="text-slate-500">Contract:</span> <span className="text-slate-300">{log.contractAddress}</span></div>
                    <div><span className="text-slate-500">Signature:</span> <span className="text-cyan-400">{log.signature}</span></div>
                    <div><span className="text-slate-500">Data Payload:</span> <span className="text-emerald-400 break-all">{log.data}</span></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: Solana CPI Logs */}
          {activeTab === 'solana_cpi' && receipt.solanaCpi && (
            <div className="space-y-3 font-mono">
              <div className="bg-slate-950 p-4 rounded-xl border border-cyan-900/60 space-y-2">
                <div className="flex items-center justify-between text-cyan-300 font-bold border-b border-slate-900 pb-2">
                  <span className="flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-cyan-400" />
                    <span>Instruction: {receipt.solanaCpi.instructionName}</span>
                  </span>
                  <span className="text-[10px] text-slate-500">Slot #{receipt.solanaCpi.slotNumber}</span>
                </div>

                <div className="text-[11px]">
                  <span className="text-slate-500">Solana Program ID:</span> <span className="text-white">{receipt.solanaCpi.programId}</span>
                </div>

                <div className="pt-2 border-t border-slate-900 space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1 flex items-center gap-1">
                    <Terminal className="w-3 h-3 text-cyan-400" />
                    <span>Program Execution Log Output:</span>
                  </span>
                  <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800 text-[10px] text-emerald-400 space-y-1">
                    {receipt.solanaCpi.logs.map((l: string, i: number) => (
                      <div key={i}>{l}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-all font-mono"
          >
            Close Explorer
          </button>
        </div>
      </div>
    </div>
  );
};
