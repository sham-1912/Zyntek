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
    <div className="flex items-center gap-3 bg-[#0E1E38] border border-[#8DC2FF]/20 rounded-xl px-3 py-1.5 backdrop-blur-md shadow-lg">
      {/* Network Status Badge */}
      <div className="flex items-center gap-2 border-r border-white/10 pr-3">
        <div className="relative flex items-center justify-center">
          <span className="w-2.5 h-2.5 rounded-full bg-[#CEF26D] animate-ping absolute" />
          <span className="w-2 h-2 rounded-full bg-[#CEF26D] relative" />
        </div>
        <div className="flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-[#CEF26D]" />
          <span className="text-xs font-mono font-bold text-white">
            Ganache Localnet
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#142848] text-[#CEF26D] border border-[#CEF26D]/30">
            1337
          </span>
        </div>
      </div>

      {/* Block Counter */}
      <div className="flex items-center gap-1.5 border-r border-white/10 pr-3 font-mono text-xs">
        <Activity className="w-3.5 h-3.5 text-[#8DC2FF]" />
        <span className="text-[#CBD5E1]">Block:</span>
        <span className="font-bold text-[#8DC2FF] bg-[#142848] px-2 py-0.5 rounded border border-[#8DC2FF]/30">
          #{currentBlock}
        </span>
      </div>

      {/* Last Transaction Hash */}
      {lastTxHash ? (
        <div className="flex items-center gap-2 font-mono text-xs text-[#8DC2FF]">
          <span className="text-[#CBD5E1] text-[11px]">Last TX:</span>
          <span className="text-[#CEF26D] bg-[#142848] px-2 py-0.5 rounded border border-[#CEF26D]/30">
            {lastTxHash.slice(0, 8)}...{lastTxHash.slice(-6)}
          </span>
          <button
            onClick={handleCopyHash}
            className="p-1 rounded hover:bg-[#142848] text-[#8DC2FF] hover:text-white transition-colors cursor-pointer"
            title="Copy TX Hash"
          >
            {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-[#CEF26D]" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      ) : (
        <span className="text-[11px] font-mono text-[#CBD5E1]">Auto-Mining Active</span>
      )}
    </div>
  );
};
