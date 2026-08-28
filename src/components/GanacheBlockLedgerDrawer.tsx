import React, { useState, useEffect } from 'react';
import { ganacheLedger } from '../services/ganacheLedger';
import type { LedgerBlock } from '../services/ganacheLedger';
import {
  X,
  Layers,
  Cpu,
  Play,
  Pause,
  PlusCircle,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Zap,
} from 'lucide-react';

interface GanacheBlockLedgerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GanacheBlockLedgerDrawer: React.FC<GanacheBlockLedgerDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const [blocks, setBlocks] = useState<LedgerBlock[]>(ganacheLedger.getBlocks());
  const [latestBlock, setLatestBlock] = useState<LedgerBlock>(ganacheLedger.getLatestBlock());
  const [isAutoMining, setIsAutoMining] = useState<boolean>(ganacheLedger.getIsAutoMining());
  const [miningSpeed, setMiningSpeed] = useState<number>(4000);
  const [expandedBlockNum, setExpandedBlockNum] = useState<number | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = ganacheLedger.subscribe((allBlocks, latest) => {
      setBlocks(allBlocks);
      setLatestBlock(latest);
      setIsAutoMining(ganacheLedger.getIsAutoMining());
    });
    return unsubscribe;
  }, []);

  if (!isOpen) return null;

  const handleToggleAutoMine = () => {
    if (isAutoMining) {
      ganacheLedger.stopAutoMining();
      setIsAutoMining(false);
    } else {
      ganacheLedger.startAutoMining();
      setIsAutoMining(true);
    }
  };

  const handleManualMine = () => {
    ganacheLedger.mineNewBlock();
  };

  const handleSpeedChange = (speedMs: number) => {
    setMiningSpeed(speedMs);
    ganacheLedger.setMiningSpeed(speedMs);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(id);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const getTimeAgo = (timestamp: number) => {
    const diff = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
    if (diff < 60) return `${diff}s ago`;
    return `${Math.floor(diff / 60)}m ago`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#2B2B2B]/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-2xl bg-[#FFFDF5] border-l border-[rgba(43,43,43,0.15)] flex flex-col justify-between shadow-2xl text-[#2B2B2B]">
          
          {/* Header */}
          <div className="p-6 border-b border-[rgba(43,43,43,0.08)] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F7E7B5] border border-[#D4A017]/40 flex items-center justify-center text-[#D4A017] shadow-xs">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-[#2B2B2B] font-headline">
                      Ganache On-Chain Block Ledger
                    </h2>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#D4A017] text-[#2B2B2B] font-bold">
                      Chain ID #1337
                    </span>
                  </div>
                  <p className="text-xs text-[#5A5A5A] font-sans">
                    Live localnet EVM blockchain explorer & block producer
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-[#F7E7B5] text-[#5A5A5A] hover:text-[#2B2B2B] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mining Controls & Metrics Bar */}
            <div className="bg-[#F7E7B5]/60 p-3.5 rounded-xl border border-[rgba(43,43,43,0.1)] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleAutoMine}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold transition-all shadow-xs cursor-pointer ${
                    isAutoMining
                      ? 'bg-[#607A3A] text-[#FFFDF5]'
                      : 'bg-[#B84A39] text-[#FFFDF5]'
                  }`}
                >
                  {isAutoMining ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isAutoMining ? 'Auto-Mining ON' : 'Mining Paused'}</span>
                </button>

                <button
                  onClick={handleManualMine}
                  className="px-3 py-1.5 rounded-lg bg-[#D4A017] hover:bg-[#E0AB1E] text-[#2B2B2B] font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Mine Block Now</span>
                </button>
              </div>

              {/* Speed Buttons */}
              <div className="flex items-center gap-1.5 text-[11px]">
                <span className="text-[#5A5A5A]">Speed:</span>
                {[2000, 4000, 8000].map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSpeedChange(s)}
                    className={`px-2 py-1 rounded border transition-colors cursor-pointer ${
                      miningSpeed === s
                        ? 'bg-[#2B2B2B] text-[#FFFDF5] border-[#2B2B2B] font-bold'
                        : 'bg-[#FFFDF5] text-[#5A5A5A] border-[rgba(43,43,43,0.1)] hover:bg-[#F7E7B5]'
                    }`}
                  >
                    {s / 1000}s
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Stat Summary */}
            <div className="grid grid-cols-3 gap-2.5 font-mono text-xs text-center">
              <div className="bg-[#FFFDF5] p-2.5 rounded-lg border border-[rgba(43,43,43,0.08)] shadow-xs">
                <span className="text-[10px] text-[#5A5A5A] block">Block Height</span>
                <span className="text-base font-bold text-[#D4A017]">#{latestBlock?.number || 14}</span>
              </div>
              <div className="bg-[#FFFDF5] p-2.5 rounded-lg border border-[rgba(43,43,43,0.08)] shadow-xs">
                <span className="text-[10px] text-[#5A5A5A] block">Ledger Depth</span>
                <span className="text-base font-bold text-[#2B2B2B]">{blocks.length} Blocks</span>
              </div>
              <div className="bg-[#FFFDF5] p-2.5 rounded-lg border border-[rgba(43,43,43,0.08)] shadow-xs">
                <span className="text-[10px] text-[#5A5A5A] block">Network State</span>
                <span className="text-base font-bold text-[#607A3A]">100% Synced</span>
              </div>
            </div>
          </div>

          {/* Block Stream List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-[#5A5A5A] border-b border-[rgba(43,43,43,0.08)] pb-2">
              <span>REAL-TIME BLOCK FEED</span>
              <span>Showing {blocks.length} most recent blocks</span>
            </div>

            {blocks.map((b, idx) => {
              const isLatest = idx === 0;
              const isExpanded = expandedBlockNum === b.number;

              return (
                <div
                  key={b.number}
                  className={`rounded-xl border transition-all overflow-hidden ${
                    isLatest
                      ? 'bg-[#F7E7B5] border-[#D4A017] shadow-sm ring-2 ring-[#D4A017]/30'
                      : 'bg-[#FFFDF5] hover:bg-[#F7E7B5]/30 border-[rgba(43,43,43,0.1)] shadow-xs'
                  }`}
                >
                  {/* Block Header Row */}
                  <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                          isLatest
                            ? 'bg-[#D4A017] text-[#2B2B2B]'
                            : 'bg-[#F7E7B5] text-[#2B2B2B] border border-[rgba(43,43,43,0.08)]'
                        }`}
                      >
                        #{b.number}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-[#2B2B2B] text-sm">
                            Block #{b.number}
                          </span>
                          {isLatest && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#D4A017] text-[#2B2B2B] animate-pulse">
                              LATEST
                            </span>
                          )}
                          <span className="text-[10px] text-[#5A5A5A]">
                            {getTimeAgo(b.timestamp)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-[11px] text-[#5A5A5A] mt-0.5">
                          <span>Hash:</span>
                          <span className="text-[#2B2B2B] font-bold truncate max-w-[140px] sm:max-w-[200px]">
                            {b.hash}
                          </span>
                          <button
                            onClick={() => handleCopy(b.hash, `block_${b.number}`)}
                            className="p-0.5 rounded hover:bg-black/5 text-[#5A5A5A] hover:text-[#2B2B2B] cursor-pointer"
                            title="Copy Block Hash"
                          >
                            {copiedHash === `block_${b.number}` ? (
                              <Check className="w-3 h-3 text-[#607A3A]" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                      <div className="text-right">
                        <span className="text-[10px] text-[#5A5A5A] block font-semibold">
                          {b.transactions.length} Tx · Gas: {b.gasUsed.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-[#D4A017] font-bold block">
                          Miner: {b.miner.slice(0, 6)}...{b.miner.slice(-4)}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setExpandedBlockNum(isExpanded ? null : b.number)}
                        className="px-2.5 py-1.5 rounded-lg bg-[#FFFDF5] hover:bg-[#F7E7B5] border border-[rgba(43,43,43,0.1)] text-xs font-mono text-[#2B2B2B] flex items-center gap-1 transition-all cursor-pointer shadow-xs font-semibold"
                      >
                        <span>{isExpanded ? 'Hide' : 'Inspect'}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Transaction Details (Charcoal #2B2B2B Terminal Look) */}
                  {isExpanded && (
                    <div className="bg-[#2B2B2B] text-[#FFFDF5] border-t border-black/20 p-4 space-y-3 font-mono text-xs animate-in fade-in duration-200">
                      <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <span className="text-[#F0C94C] font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                          <Cpu className="w-3.5 h-3.5 text-[#D4A017]" />
                          Transactions in Block #{b.number} ({b.transactions.length})
                        </span>
                        <span className="text-[10px] text-[#FFFDF5]/60">
                          Gas Limit: {b.gasLimit.toLocaleString()}
                        </span>
                      </div>

                      <div className="space-y-2">
                        {b.transactions.map((tx, txIdx) => (
                          <div
                            key={txIdx}
                            className="bg-black/30 p-3 rounded-lg border border-white/5 space-y-1.5 text-[11px]"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[#F0C94C] font-bold flex items-center gap-1">
                                <Zap className="w-3 h-3 text-[#D4A017]" />
                                Method: {tx.method}()
                              </span>
                              <span className="text-[#607A3A] font-bold bg-[#607A3A]/20 px-1.5 py-0.2 rounded text-[10px]">
                                {tx.status}
                              </span>
                            </div>

                            <div className="text-[#FFFDF5]/80 text-[10px] space-y-0.5">
                              <div className="flex justify-between">
                                <span>Tx Hash:</span>
                                <span className="text-[#D4A017] font-bold">{tx.hash.slice(0, 16)}...{tx.hash.slice(-8)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Target Contract:</span>
                                <span>{tx.to}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Gas Consumption:</span>
                                <span>{tx.gasUsed.toLocaleString()} units</span>
                              </div>
                            </div>

                            <div className="bg-black/40 p-1.5 rounded text-[10px] text-[#F7E7B5] border border-white/5 mt-1">
                              <span>Action: {tx.payloadSummary}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="text-[10px] text-[#FFFDF5]/50 border-t border-white/10 pt-2 flex justify-between">
                        <span>Parent Hash: {b.parentHash.slice(0, 14)}...</span>
                        <span>State Root Verified</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Drawer Footer */}
          <div className="p-4 border-t border-[rgba(43,43,43,0.08)] flex items-center justify-between text-xs font-mono text-[#5A5A5A] bg-[#F7E7B5]/30">
            <span>Ganache Core Engine Active</span>
            <span className="text-[#2B2B2B] font-bold">Auto-Mining Rate: {miningSpeed / 1000}s/block</span>
          </div>
        </div>
      </div>
    </div>
  );
};
