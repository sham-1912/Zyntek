import React, { useEffect, useState } from 'react';
import { testGanacheConnection } from '../services/ganacheRpc';
import { Cpu, CheckCircle2, Copy, Activity } from 'lucide-react';

interface GanacheChainWidgetProps {
  lastTxHash?: string;
  lastBlockNumber?: number;
}

export const GanacheChainWidget: React.FC<GanacheChainWidgetProps> = ({ lastTxHash, lastBlockNumber }) => {
  const [currentBlock, setCurrentBlock] = useState<number>(lastBlockNumber || 12);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (lastBlockNumber) {
      setCurrentBlock(lastBlockNumber);
    }
  }, [lastBlockNumber]);

  useEffect(() => {
    const interval = setInterval(async () => {
      await testGanacheConnection();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyHash = () => {
    if (!lastTxHash) return;
    navigator.clipboard.writeText(lastTxHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2.5 bg-[#FFFDF5]/10 border border-white/10 rounded-xl px-3 py-1.5 backdrop-blur-md shadow-md shrink-0 whitespace-nowrap text-[#FFFDF5]">
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

      {/* Block Counter */}
      <div className="flex items-center gap-1.5 border-r border-white/15 pr-2.5 font-mono text-xs shrink-0 whitespace-nowrap">
        <Activity className="w-3.5 h-3.5 text-[#F0C94C]" />
        <span className="text-[#FFFDF5]/70">Block:</span>
        <span className="font-bold text-[#F0C94C] bg-white/10 px-1.5 py-0.5 rounded border border-white/10">
          #{currentBlock}
        </span>
      </div>

      {/* Last Transaction Hash or Mining Status */}
      {lastTxHash ? (
        <div className="flex items-center gap-1.5 font-mono text-xs text-[#FFFDF5] shrink-0 whitespace-nowrap">
          <span className="text-[#FFFDF5]/70 text-[11px]">TX:</span>
          <span className="text-[#D4A017] bg-white/10 px-1.5 py-0.5 rounded border border-white/10 font-bold">
            {lastTxHash.slice(0, 6)}...{lastTxHash.slice(-4)}
          </span>
          <button
            onClick={handleCopyHash}
            className="p-0.5 rounded hover:bg-white/10 text-[#D4A017] hover:text-[#FFFDF5] transition-colors cursor-pointer"
            title="Copy TX Hash"
          >
            {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-[#607A3A]" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      ) : (
        <span className="text-[11px] font-mono text-[#FFFDF5]/70 whitespace-nowrap">Auto-Mining</span>
      )}
    </div>
  );
};
