import { JsonRpcProvider } from 'ethers';

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

const GANACHE_RPC_URL = 'http://127.0.0.1:7545';
const DEFAULT_MINER = '0x90F79bf6EB2c4f870365E785982E1f101E93b906';
const ESCROW_CONTRACT = '0x345cA3e014Aaf5caA4570b2CD70FB3FE';
const BONDING_CONTRACT = '0x71C8a92F1d4e08B991A54b4a1A59828453982845';

class GanacheLedgerService {
  private blocks: LedgerBlock[] = [];
  private currentBlockNumber = 16;
  private autoMiningInterval = 3500; // 3.5 seconds
  private timer: NodeJS.Timeout | null = null;
  private isAutoMining = true;
  private listeners: ((blocks: LedgerBlock[], latestBlock: LedgerBlock) => void)[] = [];
  private rpcProvider: JsonRpcProvider | null = null;

  constructor() {
    this.initRpc();
    this.seedInitialBlocks();
    this.startAutoMining();
    this.syncWithRealGanacheRpc();
  }

  private initRpc() {
    try {
      this.rpcProvider = new JsonRpcProvider(GANACHE_RPC_URL, undefined, { staticNetwork: true });
    } catch {
      this.rpcProvider = null;
    }
  }

  private randomHash(prefix = '0x'): string {
    return prefix + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  }

  private async syncWithRealGanacheRpc() {
    if (!this.rpcProvider) return;
    try {
      const hexBlock = (await this.rpcProvider.send('eth_blockNumber', [])) as string;
      const realNum = parseInt(hexBlock, 16);
      if (!isNaN(realNum) && realNum > 0) {
        this.currentBlockNumber = Math.max(this.currentBlockNumber, realNum);
        this.notifyListeners();
      }
    } catch (e) {
      console.warn('[GanacheLedger] RPC sync fallback:', e);
    }
  }

  private seedInitialBlocks() {
    const now = Date.now();
    let prevHash = '0x0000000000000000000000000000000000000000000000000000000000000000';

    for (let i = 1; i <= this.currentBlockNumber; i++) {
      const blockHash = this.randomHash();
      const timeOffset = (this.currentBlockNumber - i) * 3500;
      const txs = this.generateSimulatedTransactions(i, now - timeOffset);
      const totalGas = txs.reduce((acc, t) => acc + t.gasUsed, 21000);

      this.blocks.unshift({
        number: i,
        hash: blockHash,
        parentHash: prevHash,
        timestamp: now - timeOffset,
        miner: DEFAULT_MINER,
        gasUsed: totalGas,
        gasLimit: 30000000,
        transactions: txs,
      });

      prevHash = blockHash;
    }
  }

  private generateSimulatedTransactions(blockNum: number, ts: number): LedgerTransaction[] {
    const methods = [
      { method: 'lockEscrow', to: ESCROW_CONTRACT, gas: 48200, summary: 'Locked 500 USDC Deposit in EscrowVault.sol' },
      { method: 'commitBond', to: BONDING_CONTRACT, gas: 36400, summary: 'Solver Node 01 locked $500 collateral bond' },
      { method: 'settleIntent', to: ESCROW_CONTRACT, gas: 62100, summary: 'Released 497.82 USDC payout to solver' },
      { method: 'verifyProof', to: ESCROW_CONTRACT, gas: 51200, summary: 'Validated ZK-SNARK Attestation proof' },
      { method: 'rebalanceMesh', to: '0x8dc2...ff01', gas: 21000, summary: 'Cross-chain relayer liquidity rebalance' },
    ];

    const pick = methods[blockNum % methods.length];
    return [
      {
        hash: this.randomHash(),
        from: DEFAULT_MINER,
        to: pick.to,
        valueEth: '0.00',
        method: pick.method,
        gasUsed: pick.gas,
        status: 'SUCCESS',
        timestamp: ts,
        payloadSummary: pick.summary,
      },
    ];
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

  public mineNewBlock(customTx?: LedgerTransaction): LedgerBlock {
    this.currentBlockNumber = Math.max(1, this.currentBlockNumber + 1);
    const latest = this.blocks[0];
    const newHash = this.randomHash();
    const ts = Date.now();

    // Trigger Ganache evm_mine in background if available
    if (this.rpcProvider) {
      this.rpcProvider.send('evm_mine', []).catch(() => {});
    }

    const txs: LedgerTransaction[] = customTx
      ? [customTx]
      : this.generateSimulatedTransactions(this.currentBlockNumber, ts);

    const newBlock: LedgerBlock = {
      number: this.currentBlockNumber,
      hash: newHash,
      parentHash: latest ? latest.hash : '0x0',
      timestamp: ts,
      miner: DEFAULT_MINER,
      gasUsed: txs.reduce((acc, t) => acc + t.gasUsed, 21000),
      gasLimit: 30000000,
      transactions: txs,
    };

    this.blocks.unshift(newBlock);
    if (this.blocks.length > 100) {
      this.blocks.pop();
    }

    this.notifyListeners();
    return newBlock;
  }

  public pushIntentTransaction(
    method: 'lockEscrow' | 'commitBond' | 'settleIntent' | 'slashBond',
    intentId: string,
    amountUsd: number,
    txHash?: string
  ): LedgerBlock {
    const customTx: LedgerTransaction = {
      hash: txHash || this.randomHash(),
      from: DEFAULT_MINER,
      to: method === 'commitBond' || method === 'slashBond' ? BONDING_CONTRACT : ESCROW_CONTRACT,
      valueEth: '0.00',
      method,
      gasUsed: method === 'settleIntent' ? 68500 : 44200,
      status: method === 'slashBond' ? 'REVERTED' : 'SUCCESS',
      timestamp: Date.now(),
      payloadSummary:
        method === 'lockEscrow'
          ? `Intent #${intentId}: Locked $${amountUsd} USDC in EscrowVault.sol`
          : method === 'commitBond'
          ? `Intent #${intentId}: Bonded $${amountUsd} USDC collateral in SolverBonding.sol`
          : method === 'settleIntent'
          ? `Intent #${intentId}: Settled & released $${amountUsd} USDC on Solana leg`
          : `Intent #${intentId}: Slashed $${amountUsd} USDC solver collateral bond`,
    };

    return this.mineNewBlock(customTx);
  }

  public getBlocks(): LedgerBlock[] {
    return [...this.blocks];
  }

  public getLatestBlock(): LedgerBlock {
    return this.blocks[0] || {
      number: 16,
      hash: this.randomHash(),
      parentHash: '0x0',
      timestamp: Date.now(),
      miner: DEFAULT_MINER,
      gasUsed: 42000,
      gasLimit: 30000000,
      transactions: this.generateSimulatedTransactions(16, Date.now()),
    };
  }

  public getBlockNumber(): number {
    return Math.max(1, this.currentBlockNumber);
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
