import { JsonRpcProvider } from 'ethers';
import { sendZyntekTransaction } from './ganacheRpc';
import type { GanacheTxParams } from './ganacheRpc';

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
  private currentBlockNumber = 7;
  private autoMiningInterval = 4000; // 4 seconds
  private timer: NodeJS.Timeout | null = null;
  private isAutoMining = true;
  private isMiningInProgress = false;
  private listeners: ((blocks: LedgerBlock[], latestBlock: LedgerBlock) => void)[] = [];
  private rpcProvider: JsonRpcProvider | null = null;

  constructor() {
    this.initRpc();
    this.syncInitialGanacheState();
    this.startAutoMining();
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

  private async syncInitialGanacheState() {
    if (!this.rpcProvider) {
      this.seedInitialBlocks();
      return;
    }

    try {
      const hexBlock = (await this.rpcProvider.send('eth_blockNumber', [])) as string;
      const realNum = parseInt(hexBlock, 16);

      if (!isNaN(realNum) && realNum > 0) {
        this.currentBlockNumber = realNum;
        const fetchedBlocks: LedgerBlock[] = [];

        // Fetch last 15 blocks directly from Ganache
        const start = Math.max(1, realNum - 14);
        for (let i = realNum; i >= start; i--) {
          try {
            const hexI = '0x' + i.toString(16);
            const rawBlock = (await this.rpcProvider.send('eth_getBlockByNumber', [hexI, true])) as any;
            if (rawBlock) {
              const txs: LedgerTransaction[] = (rawBlock.transactions || []).map((t: any) => ({
                hash: t.hash,
                from: t.from,
                to: t.to || ESCROW_CONTRACT,
                valueEth: '0.00',
                method: t.input && t.input.length >= 10 ? this.decodeMethod(t.input.slice(0, 10)) : 'transferUSDC',
                gasUsed: parseInt(t.gas || '0x5208', 16),
                status: 'SUCCESS',
                timestamp: parseInt(rawBlock.timestamp || '0x0', 16) * 1000,
                payloadSummary: 'EVM Contract Interaction: Zyntek Intent Network',
              }));

              // If block in Ganache had 0 transactions, generate synthetic cross-chain intent tx
              if (txs.length === 0) {
                const synTxs = this.generateSimulatedTransactions(i, parseInt(rawBlock.timestamp, 16) * 1000 || Date.now());
                txs.push(...synTxs);
              }

              fetchedBlocks.push({
                number: i,
                hash: rawBlock.hash || this.randomHash(),
                parentHash: rawBlock.parentHash || '0x0',
                timestamp: parseInt(rawBlock.timestamp || '0x0', 16) * 1000 || Date.now(),
                miner: rawBlock.miner || DEFAULT_MINER,
                gasUsed: txs.reduce((acc, t) => acc + t.gasUsed, 21000),
                gasLimit: parseInt(rawBlock.gasLimit || '0x1c9c380', 16) || 30000000,
                transactions: txs,
              });
            }
          } catch {}
        }

        if (fetchedBlocks.length > 0) {
          this.blocks = fetchedBlocks;
          this.notifyListeners();
          return;
        }
      }
    } catch (e) {
      console.warn('[GanacheLedger] Failed initial sync, using simulated ledger', e);
    }

    this.seedInitialBlocks();
  }

  private decodeMethod(selector: string): string {
    if (selector.startsWith('0x345')) return 'lockEscrow';
    if (selector.startsWith('0x71c')) return 'commitBond';
    if (selector.startsWith('0x88c')) return 'settleIntent';
    if (selector.startsWith('0xb84')) return 'slashBond';
    return 'executeIntentRoute';
  }

  private seedInitialBlocks() {
    const now = Date.now();
    let prevHash = '0x0000000000000000000000000000000000000000000000000000000000000000';

    for (let i = 1; i <= this.currentBlockNumber; i++) {
      const blockHash = this.randomHash();
      const timeOffset = (this.currentBlockNumber - i) * 4000;
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
      { method: 'commitBond', to: BONDING_CONTRACT, gas: 36400, summary: 'Solver 01 posted $500 collateral bond' },
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

  public async mineNewBlock(customTx?: LedgerTransaction): Promise<LedgerBlock> {
    if (this.isMiningInProgress) return this.blocks[0];
    this.isMiningInProgress = true;

    try {
      let realTxHash: string | undefined = customTx?.hash;
      let realBlockNumber: number | undefined;

      // If Ganache RPC is reachable, send a real transaction to force Ganache to mine a real block with transactions!
      if (this.rpcProvider) {
        try {
          const accounts = (await this.rpcProvider.send('eth_accounts', [])) as string[];
          if (accounts && accounts.length > 0) {
            const res = await sendZyntekTransaction({
              stage: (customTx?.method as GanacheTxParams['stage']) || 'lockEscrow',
              intentId: `int_${Date.now()}`,
              userAddress: accounts[0],
              amountUsdc: 500,
            });
            if (res.txHash) {
              realTxHash = res.txHash;
              realBlockNumber = res.blockNumber;
            }
          }
        } catch {
          // Fallback to local block generation
        }
      }

      const nextNum = realBlockNumber || (this.currentBlockNumber + 1);
      this.currentBlockNumber = Math.max(1, nextNum);

      const latest = this.blocks[0];
      const newHash = this.randomHash();
      const ts = Date.now();

      const txs: LedgerTransaction[] = customTx
        ? [{ ...customTx, hash: realTxHash || customTx.hash }]
        : this.generateSimulatedTransactions(this.currentBlockNumber, ts).map((t) => ({
            ...t,
            hash: realTxHash || t.hash,
          }));

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
    } finally {
      this.isMiningInProgress = false;
    }
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

    // Immediate synchronous block creation + trigger async Ganache broadcast
    this.currentBlockNumber = Math.max(1, this.currentBlockNumber + 1);
    const latest = this.blocks[0];
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
    if (this.blocks.length > 100) this.blocks.pop();
    this.notifyListeners();

    // Broadcast real TX to Ganache
    sendZyntekTransaction({
      stage: method,
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
        number: 7,
        hash: this.randomHash(),
        parentHash: '0x0',
        timestamp: Date.now(),
        miner: DEFAULT_MINER,
        gasUsed: 48200,
        gasLimit: 30000000,
        transactions: this.generateSimulatedTransactions(7, Date.now()),
      }
    );
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
