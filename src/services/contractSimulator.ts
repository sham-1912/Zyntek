import type {
  UserIntent,
  SolverBid,
  SettlementResult,
  VerificationType,
  BlockReceipt,
  IntentHistoryItem,
  PipelineStage,
  ProofPayload,
  BalanceComparison,
  EvmEventLog,
  SolanaCpiLog,
} from './types';
import { generateEip712Signature } from './eip712Service';
import { BrowserProvider } from 'ethers';
import type { Eip1193Provider } from 'ethers';

interface ContractState {
  escrowLockedUsd: number;
  solverBondLockedUsd: number;
  slashedTotalUsd: number;
  settledTotalUsd: number;
}

const HISTORY_STORAGE_KEY = 'zyntek_intent_history_v1';

class ContractSimulatorService {
  private state: ContractState = {
    escrowLockedUsd: 0,
    solverBondLockedUsd: 0,
    slashedTotalUsd: 0,
    settledTotalUsd: 0,
  };

  private history: IntentHistoryItem[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (stored) {
        this.history = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to load history from localStorage', e);
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(this.history));
    } catch (e) {
      console.warn('Failed to save history to localStorage', e);
    }
  }

  public getContractState(): ContractState {
    return { ...this.state };
  }

  public getHistory(): IntentHistoryItem[] {
    return [...this.history];
  }

  public addOrUpdateHistory(intent: UserIntent, stage: PipelineStage, winningBid?: SolverBid, result?: SettlementResult) {
    const existingIndex = this.history.findIndex((h) => h.intent.intentId === intent.intentId);
    const item: IntentHistoryItem = {
      intent,
      status: stage,
      winningBid,
      result,
      createdAt: Date.now(),
    };

    if (existingIndex >= 0) {
      this.history[existingIndex] = item;
    } else {
      this.history.unshift(item);
    }

    this.saveToStorage();
  }

  private async sendRealGanacheTx(description: string): Promise<{ txHash: string; blockNumber: number }> {
    if (typeof window !== 'undefined' && (window as unknown as { ethereum?: Eip1193Provider }).ethereum) {
      try {
        const ethereum = (window as unknown as { ethereum: Eip1193Provider }).ethereum;
        const provider = new BrowserProvider(ethereum);
        const signer = await provider.getSigner();

        const tx = await signer.sendTransaction({
          to: '0x71C8a92F1d4e08B991A54b4a1A59828453982845',
          value: 0,
          data: '0x' + Buffer.from(description).toString('hex').slice(0, 64),
        });

        const receipt = await tx.wait();
        return {
          txHash: tx.hash,
          blockNumber: receipt?.blockNumber || 1,
        };
      } catch (e) {
        console.warn('Ganache live tx fallback:', e);
      }
    }

    const randomHash = `0x8f2a${Math.random().toString(16).substring(2, 8)}c91d`;
    return {
      txHash: randomHash,
      blockNumber: Math.floor(Math.random() * 5) + 1,
    };
  }

  public async lockUserEscrow(intent: UserIntent): Promise<{ receipt: BlockReceipt; status: 'LOCKED' }> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    this.state.escrowLockedUsd += intent.sourceAmount;

    const realTx = await this.sendRealGanacheTx(`lockEscrow(${intent.intentId}, ${intent.sourceAmount})`);

    const evmLogs: EvmEventLog[] = [
      {
        eventName: 'EscrowLocked',
        contractAddress: '0x71C8a92F1d4e08B991A54b4a1A59828453982845',
        signature: 'EscrowLocked(bytes32,address,uint256,uint256)',
        topics: [realTx.txHash, '0x71C8...4A92'],
        data: `0x000000000000000000000000000000000000000000000000000${(intent.sourceAmount * 1e6).toString(16)}`,
        blockNumber: realTx.blockNumber,
        transactionHash: realTx.txHash,
      },
    ];

    const receipt: BlockReceipt = {
      stepName: 'Intent Escrow Deposit',
      txHash: realTx.txHash,
      blockNumber: realTx.blockNumber,
      gasUsed: 65420,
      timestamp: Date.now(),
      explorerUrl: `ganache:${realTx.txHash}`,
      proofData: `LockToken(USDC, $${intent.sourceAmount}, intentId=${intent.intentId})`,
      evmLogs,
    };

    return { receipt, status: 'LOCKED' };
  }

  public async commitSolverBond(_intent: UserIntent, solver: SolverBid): Promise<{ receipt: BlockReceipt; status: 'COMMITTED' }> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    this.state.solverBondLockedUsd += solver.collateralOfferedUsd;

    const realTx = await this.sendRealGanacheTx(`commitBond(${solver.solverName}, ${solver.collateralOfferedUsd})`);

    const evmLogs: EvmEventLog[] = [
      {
        eventName: 'BondCommitted',
        contractAddress: '0x3C7b1A92F1d4e08B991A54b4a1A59828453982845',
        signature: 'BondCommitted(bytes32,address,uint256)',
        topics: [realTx.txHash, '0xSolverBondAddress...'],
        data: `0x000000000000000000000000000000000000000000000000000${(solver.collateralOfferedUsd * 1e6).toString(16)}`,
        blockNumber: realTx.blockNumber,
        transactionHash: realTx.txHash,
      },
    ];

    const receipt: BlockReceipt = {
      stepName: 'Solver Bond Collateral Commitment',
      txHash: realTx.txHash,
      blockNumber: realTx.blockNumber,
      gasUsed: 84210,
      timestamp: Date.now(),
      explorerUrl: `ganache:${realTx.txHash}`,
      proofData: `CommitCollateral(${solver.solverName}, $${solver.collateralOfferedUsd} USDC)`,
      evmLogs,
    };

    return { receipt, status: 'COMMITTED' };
  }

  public async executeVerificationAndSettlement(
    intent: UserIntent,
    solver: SolverBid,
    forceFailure = false,
    failureReason = 'Solver failed to deliver destination asset on Solana within deadline'
  ): Promise<SettlementResult> {
    const startTime = Date.now();
    const isHighValue = intent.sourceAmount >= 1000;
    const verificationType: VerificationType = isHighValue ? 'zk_oracle' : 'optimistic';

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const realTx = await this.sendRealGanacheTx(`settleIntent(${intent.intentId}, ${solver.solverName})`);
    const solanaSig = `5K9a${Math.random().toString(36).substring(2, 10)}v7Wx`;
    const solanaBlock = 2847190 + Math.floor(Math.random() * 100);

    const eip712Sig = intent.eip712Signature || generateEip712Signature(intent);

    const proofPayload: ProofPayload = {
      intentId: intent.intentId,
      verificationType,
      zkProofHash: `0xzk77f${Math.random().toString(16).substring(2, 12)}a2b9`,
      solanaBlockNumber: solanaBlock,
      solanaTxSignature: solanaSig,
      attestationSigner: '0xOracleSigner...77A1',
      eip712Signature: eip712Sig,
      timestamp: Date.now(),
      status: forceFailure ? 'REJECTED' : 'VALIDATED',
    };

    const solanaCpi: SolanaCpiLog = {
      programId: 'ZynT111111111111111111111111111111111111111',
      instructionName: 'FulfillIntentCrossChain',
      slotNumber: solanaBlock,
      signature: solanaSig,
      logs: [
        'Program ZynT111111111111111111111111111111111111111 invoke [1]',
        `Program log: Fulfilling Intent ID: ${intent.intentId}`,
        `Program log: Transferring ${solver.proposedOutput} USDC to recipient`,
        'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success',
        'Program ZynT111111111111111111111111111111111111111 success',
      ],
    };

    const evmLogs: EvmEventLog[] = [
      {
        eventName: forceFailure ? 'IntentFailedAndSlashed' : 'IntentSettled',
        contractAddress: '0x9E1f1A92F1d4e08B991A54b4a1A59828453982845',
        signature: forceFailure ? 'IntentFailedAndSlashed(bytes32,address,string)' : 'IntentSettled(bytes32,address,uint256)',
        topics: [realTx.txHash, '0xWinningSolver...'],
        data: `0x000000000000000000000000000000000000000000000000000${(intent.sourceAmount * 1e6).toString(16)}`,
        blockNumber: realTx.blockNumber,
        transactionHash: realTx.txHash,
      },
    ];

    const receipts: BlockReceipt[] = [
      {
        stepName: 'EVM Escrow Lock',
        txHash: `0x8f2a${Math.random().toString(16).substring(2, 8)}c91d`,
        blockNumber: realTx.blockNumber - 1,
        gasUsed: 65420,
        timestamp: startTime - 4000,
        explorerUrl: `ganache:${realTx.txHash}`,
        proofData: `LockToken(USDC, $${intent.sourceAmount})`,
        evmLogs,
      },
      {
        stepName: 'Solver Collateral Commitment',
        txHash: `0x3c7b${Math.random().toString(16).substring(2, 8)}e4f1`,
        blockNumber: realTx.blockNumber - 1,
        gasUsed: 84210,
        timestamp: startTime - 2000,
        explorerUrl: `ganache:${realTx.txHash}`,
        proofData: `CommitCollateral(${solver.solverName}, $${solver.collateralOfferedUsd})`,
      },
      {
        stepName: `Hybrid Verifier (${verificationType.toUpperCase()})`,
        txHash: realTx.txHash,
        blockNumber: realTx.blockNumber,
        gasUsed: 112040,
        timestamp: Date.now(),
        explorerUrl: `ganache:${realTx.txHash}`,
        proofData: verificationType === 'zk_oracle' ? 'ZK-SNARK Attestation Proof #0x77f9a2' : 'Optimistic Challenge Window Timelock Passed',
        evmLogs,
        solanaCpi,
      },
    ];

    if (forceFailure) {
      const bondSlashed = solver.collateralOfferedUsd;
      const userRefund = intent.sourceAmount;

      this.state.escrowLockedUsd = Math.max(0, this.state.escrowLockedUsd - intent.sourceAmount);
      this.state.solverBondLockedUsd = Math.max(0, this.state.solverBondLockedUsd - solver.collateralOfferedUsd);
      this.state.slashedTotalUsd += bondSlashed;

      return {
        intentId: intent.intentId,
        winningSolverId: solver.solverId,
        escrowReleasedUsd: 0,
        solverBondSlashedUsd: bondSlashed,
        userRefundedUsd: userRefund,
        protocolReserveUsd: Math.round(bondSlashed - userRefund > 0 ? bondSlashed - userRefund : 25),
        verificationType,
        txHash: realTx.txHash,
        success: false,
        failureReason,
        executionTimeMs: Date.now() - startTime,
        receipts,
        proofPayload,
      };
    } else {
      const escrowReleased = intent.sourceAmount;
      this.state.escrowLockedUsd = Math.max(0, this.state.escrowLockedUsd - intent.sourceAmount);
      this.state.solverBondLockedUsd = Math.max(0, this.state.solverBondLockedUsd - solver.collateralOfferedUsd);
      this.state.settledTotalUsd += escrowReleased;

      const protocolFee = Number((intent.sourceAmount - solver.proposedOutput - solver.feeUsd).toFixed(2));
      const validProtocolFee = protocolFee > 0 ? protocolFee : 2.30;

      const balanceComparison: BalanceComparison = {
        beforeSourceAmount: intent.sourceAmount,
        beforeSourceAsset: intent.sourceAsset,
        beforeSourceChain: 'Ethereum (Ganache Localnet)',
        afterDestinationAmount: solver.proposedOutput,
        afterDestinationAsset: intent.destinationAsset,
        afterDestinationChain: 'Solana Network',
        solverPayoutUsd: Number((solver.proposedOutput + solver.feeUsd).toFixed(2)),
        solverFeeUsd: solver.feeUsd,
        protocolFeeUsd: validProtocolFee,
      };

      return {
        intentId: intent.intentId,
        winningSolverId: solver.solverId,
        escrowReleasedUsd: escrowReleased,
        verificationType,
        txHash: realTx.txHash,
        success: true,
        executionTimeMs: Date.now() - startTime,
        receipts,
        proofPayload,
        balanceComparison,
      };
    }
  }
}

export const contractSimulator = new ContractSimulatorService();
