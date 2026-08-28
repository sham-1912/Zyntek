import { sendZyntekTransaction } from './ganacheRpc';

export interface LedgerTransaction {
  hash: string;
  from: string;
  to: string;
  valueEth: string;
  method: string;
  gasUsed: number;
  status: 'SUCCESS' | 'REVERTED';
  timestamp: number;
  payloadSummary: string;
}

export interface LedgerBlock {
  number: number;
  hash: string;
  parentHash: string;
  timestamp: number;
  miner: string;
  gasUsed: number;
  gasLimit: number;
  transactions: LedgerTransaction[];
}

const DEFAULT_MINER = '0x90F79bf6EB2c4f870365E785982E1f101E93b906';
const ESCROW_CONTRACT = '0x345cA3e014Aaf5caA4570b2CD70FB3FE';
const BONDING_CONTRACT = '0x71C8a92F1d4e08B991A54b4a1A59828453982845';

class GanacheLedgerService {
  private blocks: LedgerBlock[] = [];
  private currentBlockNumber = 0;
  private autoMiningInterval = 4000;
  private timer: NodeJS.Timeout | null = null;
  private isAutoMining = false;
  private isMiningInProgress = false;
  private listeners: ((blocks: LedgerBlock[], latestBlock: LedgerBlock) => void)[] = [];

  constructor() {
    this.resetLedger(0);
  }

  private randomHash(prefix = '0x'): string {
    return prefix + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  }

  public resetLedger(startBlock = 0) {
    this.stopAutoMining();
    this.currentBlockNumber = startBlock;
    const now = Date.now();
    const genesisHash = '0x0000000000000000000000000000000000000000000000000000000000000000';
    const genesisBlockHash = this.randomHash();

    const genesisBlock: LedgerBlock = {
      number: startBlock,
      hash: genesisBlockHash,
      parentHash: genesisHash,
      timestamp: now,
      miner: DEFAULT_MINER,
      gasUsed: 21000,
      gasLimit: 30000000,
      transactions: [
        {
          hash: this.randomHash(),
          from: DEFAULT_MINER,
          to: ESCROW_CONTRACT,
          valueEth: '0.00',
          method: 'genesisInit',
          gasUsed: 21000,
          status: 'SUCCESS',
          timestamp: now,
          payloadSummary: 'ZYNTEK Protocol Genesis State Initialized (Clean Demo Baseline)',
        },
      ],
    };

    this.blocks = [genesisBlock];
    this.notifyListeners();
  }

  public startAutoMining() {
    if (this.timer) clearInterval(this.timer);
    this.isAutoMining = true;
    this.timer = setInterval(() => {
      this.mineNewBlock();
    }, this.autoMiningInterval);
  }

  public stopAutoMining() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    this.isAutoMining = false;
  }

  public setMiningSpeed(intervalMs: number) {
    this.autoMiningInterval = intervalMs;
    if (this.isAutoMining) {
      this.startAutoMining();
    }
  }

  public async mineNewBlock(customTx?: LedgerTransaction): Promise<LedgerBlock> {
    if (this.isMiningInProgress) return this.blocks[0];
    this.isMiningInProgress = true;

    try {
      this.currentBlockNumber += 1;
      const latest = this.blocks[0];
      const now = Date.now();

      const txs: LedgerTransaction[] = customTx
        ? [customTx]
        : [
            {
              hash: this.randomHash(),
              from: DEFAULT_MINER,
              to: ESCROW_CONTRACT,
              valueEth: '0.00',
              method: 'heartbeatAudit',
              gasUsed: 21000,
              status: 'SUCCESS',
              timestamp: now,
              payloadSummary: 'Manual On-Chain Block Mined',
            },
          ];

      const newBlock: LedgerBlock = {
        number: this.currentBlockNumber,
        hash: this.randomHash(),
        parentHash: latest ? latest.hash : '0x0',
        timestamp: now,
        miner: DEFAULT_MINER,
        gasUsed: txs.reduce((acc, t) => acc + t.gasUsed, 21000),
        gasLimit: 30000000,
        transactions: txs,
      };

      this.blocks.unshift(newBlock);
      if (this.blocks.length > 60) this.blocks.pop();
      this.notifyListeners();

      return newBlock;
    } finally {
      this.isMiningInProgress = false;
    }
  }

  public pushIntentTransaction(method: string, intentId: string, amountUsd: number): LedgerBlock {
    this.currentBlockNumber += 1;
    const latest = this.blocks[0];

    const summaries: Record<string, string> = {
      lockEscrow: `Locked $${amountUsd} USDC in EscrowVault.sol (${intentId.slice(0, 8)})`,
      commitBond: `Solver posted $${amountUsd} bond in SolverBonding.sol (${intentId.slice(0, 8)})`,
      settleIntent: `Released $${amountUsd} USDC payout & returned solver bond (${intentId.slice(0, 8)})`,
      slashBond: `Slashed $${amountUsd} bond from failed solver to reserve (${intentId.slice(0, 8)})`,
    };

    const customTx: LedgerTransaction = {
      hash: this.randomHash(),
      from: DEFAULT_MINER,
      to: method.includes('Bond') ? BONDING_CONTRACT : ESCROW_CONTRACT,
      valueEth: '0.00',
      method,
      gasUsed: method === 'settleIntent' ? 62400 : method === 'lockEscrow' ? 48200 : 36800,
      status: 'SUCCESS',
      timestamp: Date.now(),
      payloadSummary: summaries[method] || `EVM Execution: ${method} (${intentId})`,
    };

    const newBlock: LedgerBlock = {
      number: this.currentBlockNumber,
      hash: this.randomHash(),
      parentHash: latest ? latest.hash : '0x0',
      timestamp: Date.now(),
      miner: DEFAULT_MINER,
      gasUsed: customTx.gasUsed + 21000,
      gasLimit: 30000000,
      transactions: [customTx],
    };

    this.blocks.unshift(newBlock);
    if (this.blocks.length > 60) this.blocks.pop();
    this.notifyListeners();

    // Broadcast real TX to Ganache if active
    sendZyntekTransaction({
      stage: method as any,
      intentId,
      amountUsdc: amountUsd,
    }).catch(() => {});

    return newBlock;
  }

  public getBlocks(): LedgerBlock[] {
    return [...this.blocks];
  }

  public getLatestBlock(): LedgerBlock {
    return (
      this.blocks[0] || {
        number: 0,
        hash: this.randomHash(),
        parentHash: '0x0',
        timestamp: Date.now(),
        miner: DEFAULT_MINER,
        gasUsed: 21000,
        gasLimit: 30000000,
        transactions: [],
      }
    );
  }

  public getBlockNumber(): number {
    return this.currentBlockNumber;
  }

  public getIsAutoMining(): boolean {
    return this.isAutoMining;
  }

  public subscribe(cb: (blocks: LedgerBlock[], latestBlock: LedgerBlock) => void) {
    this.listeners.push(cb);
    cb(this.getBlocks(), this.getLatestBlock());
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  }

  private notifyListeners() {
    const latest = this.getLatestBlock();
    const all = this.getBlocks();
    this.listeners.forEach((cb) => cb(all, latest));
  }
}

export const ganacheLedger = new GanacheLedgerService();
