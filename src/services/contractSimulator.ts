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
} from './types';

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

  public async lockUserEscrow(intent: UserIntent): Promise<{ receipt: BlockReceipt; status: 'LOCKED' }> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    this.state.escrowLockedUsd += intent.sourceAmount;

    const receipt: BlockReceipt = {
      stepName: 'Intent Escrow Deposit',
      txHash: `0x8f2a${Math.random().toString(16).substring(2, 8)}c91d`,
      blockNumber: 19845210 + Math.floor(Math.random() * 50),
      gasUsed: 65420,
      timestamp: Date.now(),
      explorerUrl: `#receipt-escrow-${intent.intentId}`,
      proofData: `LockToken(USDC, $${intent.sourceAmount}, intentId=${intent.intentId})`,
    };

    return { receipt, status: 'LOCKED' };
  }

  public async commitSolverBond(_intent: UserIntent, solver: SolverBid): Promise<{ receipt: BlockReceipt; status: 'COMMITTED' }> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    this.state.solverBondLockedUsd += solver.collateralOfferedUsd;

    const receipt: BlockReceipt = {
      stepName: 'Solver Bond Collateral Commitment',
      txHash: `0x3c7b${Math.random().toString(16).substring(2, 8)}e4f1`,
      blockNumber: 19845211 + Math.floor(Math.random() * 50),
      gasUsed: 84210,
      timestamp: Date.now(),
      explorerUrl: `#receipt-bond-${solver.solverId}`,
      proofData: `CommitCollateral(${solver.solverName}, $${solver.collateralOfferedUsd} USDC)`,
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

    await new Promise((resolve) => setTimeout(resolve, 1200));

    const mainTxHash = `0x9e1f${Math.random().toString(16).substring(2, 8)}7a2b`;
    const solanaSig = `5K9a${Math.random().toString(36).substring(2, 10)}v7Wx`;
    const solanaBlock = 2847190 + Math.floor(Math.random() * 100);

    const proofPayload: ProofPayload = {
      intentId: intent.intentId,
      verificationType,
      zkProofHash: `0xzk77f${Math.random().toString(16).substring(2, 12)}a2b9`,
      solanaBlockNumber: solanaBlock,
      solanaTxSignature: solanaSig,
      attestationSigner: '0xOracleSigner...77A1',
      timestamp: Date.now(),
      status: forceFailure ? 'REJECTED' : 'VALIDATED',
    };

    const receipts: BlockReceipt[] = [
      {
        stepName: 'EVM Escrow Lock',
        txHash: `0x8f2a${Math.random().toString(16).substring(2, 8)}c91d`,
        blockNumber: 19845210,
        gasUsed: 65420,
        timestamp: startTime - 4000,
        explorerUrl: `#receipt-escrow-${intent.intentId}`,
        proofData: `LockToken(USDC, $${intent.sourceAmount})`,
      },
      {
        stepName: 'Solver Collateral Commitment',
        txHash: `0x3c7b${Math.random().toString(16).substring(2, 8)}e4f1`,
        blockNumber: 19845211,
        gasUsed: 84210,
        timestamp: startTime - 2000,
        explorerUrl: `#receipt-bond-${solver.solverId}`,
        proofData: `CommitCollateral(${solver.solverName}, $${solver.collateralOfferedUsd})`,
      },
      {
        stepName: `Hybrid Verifier (${verificationType.toUpperCase()})`,
        txHash: mainTxHash,
        blockNumber: 19845214,
        gasUsed: 112040,
        timestamp: Date.now(),
        explorerUrl: `#receipt-verifier-${intent.intentId}`,
        proofData: verificationType === 'zk_oracle' ? 'ZK-SNARK Attestation Proof #0x77f9a2' : 'Optimistic Challenge Window Timelock Passed',
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
        txHash: mainTxHash,
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

      const balanceComparison: BalanceComparison = {
        beforeSourceAmount: intent.sourceAmount,
        beforeSourceAsset: intent.sourceAsset,
        beforeSourceChain: 'Ethereum (Sepolia)',
        afterDestinationAmount: solver.proposedOutput,
        afterDestinationAsset: intent.destinationAsset,
        afterDestinationChain: 'Solana Network',
        solverPayoutUsd: Number((solver.proposedOutput + solver.feeUsd).toFixed(2)),
        solverFeeUsd: solver.feeUsd,
      };

      return {
        intentId: intent.intentId,
        winningSolverId: solver.solverId,
        escrowReleasedUsd: escrowReleased,
        verificationType,
        txHash: mainTxHash,
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
