import React, { useEffect, useState } from 'react';
import { ganacheLedger } from '../services/ganacheLedger';
import type { LedgerBlock } from '../services/ganacheLedger';
import { Cpu, CheckCircle2, Copy, Activity, BookOpen } from 'lucide-react';

interface GanacheChainWidgetProps {
  lastTxHash?: string;
  onOpenLedger?: () => void;
}

export const GanacheChainWidget: React.FC<GanacheChainWidgetProps> = ({ lastTxHash: propHash, onOpenLedger }) => {
  const [latestBlock, setLatestBlock] = useState<LedgerBlock>(ganacheLedger.getLatestBlock());
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = ganacheLedger.subscribe((_blocks, latest) => {
      setLatestBlock(latest);
    });
    return unsubscribe;
  }, []);

  const displayHash = propHash || latestBlock?.transactions[0]?.hash || latestBlock?.hash;

  const handleCopyHash = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!displayHash) return;
    navigator.clipboard.writeText(displayHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      onClick={onOpenLedger}
      className="flex items-center gap-2.5 bg-[#FFFDF5]/10 hover:bg-[#FFFDF5]/15 border border-white/10 hover:border-[#D4A017]/40 rounded-xl px-3 py-1.5 backdrop-blur-md shadow-md shrink-0 whitespace-nowrap text-[#FFFDF5] cursor-pointer transition-all group"
      title="Click to open full Ganache On-Chain Block Ledger & Explorer"
    >
      {/* Network Status Badge */}
      <div className="flex items-center gap-2 border-r border-white/15 pr-2.5 shrink-0">
        <div className="relative flex items-center justify-center">
          <span className="w-2 h-2 rounded-full bg-[#D4A017] animate-ping absolute" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4A017] relative" />
        </div>
        <div className="flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-[#D4A017]" />
          <span className="text-xs font-mono font-bold text-[#FFFDF5] whitespace-nowrap">
            Ganache
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#D4A017] text-[#2B2B2B] font-bold whitespace-nowrap">
            1337
          </span>
        </div>
      </div>

      {/* Real-Time Live Incrementing Block Counter */}
      <div className="flex items-center gap-1.5 border-r border-white/15 pr-2.5 font-mono text-xs shrink-0 whitespace-nowrap">
        <Activity className="w-3.5 h-3.5 text-[#F0C94C] animate-pulse" />
        <span className="text-[#FFFDF5]/70">Block:</span>
        <span className="font-bold text-[#2B2B2B] bg-[#F0C94C] px-1.5 py-0.5 rounded shadow-xs">
          #{latestBlock?.number || 14}
        </span>
      </div>

      {/* Ledger Button & Last Hash */}
      <div className="flex items-center gap-2 font-mono text-xs text-[#FFFDF5] shrink-0 whitespace-nowrap">
        <span className="text-[#FFFDF5]/70 text-[11px] hidden sm:inline">TX:</span>
        <span className="text-[#D4A017] bg-white/10 px-1.5 py-0.5 rounded border border-white/10 font-bold max-w-[90px] sm:max-w-[120px] truncate">
          {displayHash ? `${displayHash.slice(0, 6)}...${displayHash.slice(-4)}` : 'Mining...'}
        </span>
        <button
          onClick={handleCopyHash}
          className="p-0.5 rounded hover:bg-white/10 text-[#D4A017] hover:text-[#FFFDF5] transition-colors cursor-pointer"
          title="Copy TX Hash"
        >
          {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-[#607A3A]" /> : <Copy className="w-3.5 h-3.5" />}
        </button>

        <span className="px-2 py-0.5 rounded bg-[#D4A017] text-[#2B2B2B] text-[10px] font-bold flex items-center gap-1 group-hover:bg-[#E0AB1E] shadow-xs">
          <BookOpen className="w-3 h-3" />
          <span>Ledger</span>
        </span>
      </div>
    </div>
  );
};
