import { UserIntent, SolverBid, SettlementResult, VerificationType } from './types';

// Simulated state storage for active intents & contract balances
interface ContractState {
  escrowLockedUsd: number;
  solverBondLockedUsd: number;
  slashedTotalUsd: number;
  settledTotalUsd: number;
}

class ContractSimulatorService {
  private state: ContractState = {
    escrowLockedUsd: 0,
    solverBondLockedUsd: 0,
    slashedTotalUsd: 0,
    settledTotalUsd: 0,
  };

  public getContractState(): ContractState {
    return { ...this.state };
  }

  public async lockUserEscrow(intent: UserIntent): Promise<{ txHash: string; status: 'LOCKED' }> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    this.state.escrowLockedUsd += intent.sourceAmount;
    const txHash = `0x${Math.random().toString(16).substring(2, 10)}${Date.now().toString(16)}`;
    return { txHash, status: 'LOCKED' };
  }

  public async commitSolverBond(intent: UserIntent, solver: SolverBid): Promise<{ txHash: string; status: 'COMMITTED' }> {
    await new Promise((resolve) => setTimeout(resolve, 700));
    this.state.solverBondLockedUsd += solver.collateralOfferedUsd;
    const txHash = `0x${Math.random().toString(16).substring(2, 10)}${Date.now().toString(16)}`;
    return { txHash, status: 'COMMITTED' };
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

    // Simulate verification delay
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const txHash = `0x${Math.random().toString(16).substring(2, 10)}${Date.now().toString(16)}`;

    if (forceFailure) {
      // Slashing path
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
        verificationType,
        txHash,
        success: false,
        failureReason,
        executionTimeMs: Date.now() - startTime,
      };
    } else {
      // Success path
      const escrowReleased = intent.sourceAmount;
      this.state.escrowLockedUsd = Math.max(0, this.state.escrowLockedUsd - intent.sourceAmount);
      this.state.solverBondLockedUsd = Math.max(0, this.state.solverBondLockedUsd - solver.collateralOfferedUsd);
      this.state.settledTotalUsd += escrowReleased;

      return {
        intentId: intent.intentId,
        winningSolverId: solver.solverId,
        escrowReleasedUsd: escrowReleased,
        verificationType,
        txHash,
        success: true,
        executionTimeMs: Date.now() - startTime,
      };
    }
  }
}

export const contractSimulator = new ContractSimulatorService();
