export interface PrioritySliders {
  cost: number; // 0-100%
  speed: number; // 0-100%
  safety: number; // 0-100%
}

export type ChainId = 'ethereum' | 'arbitrum' | 'optimism' | 'solana' | 'polygon';

export interface UserIntent {
  intentId: string;
  sourceChain: ChainId;
  sourceAsset: string;
  sourceAmount: number;
  destinationChain: ChainId;
  destinationAsset: string;
  minAcceptableOutput: number;
  deadlineMinutes: number;
  sliders: PrioritySliders;
  timestamp: number;
}

export interface SubScores {
  costScore: number; // 0.0 - 1.0
  speedScore: number; // 0.0 - 1.0
  safetyScore: number; // 0.0 - 1.0
  outputNorm: number;
  feeNorm: number;
  slippageNorm: number;
  executionTimeNorm: number;
  reputationNorm: number;
  collateralNorm: number;
}

export interface SolverBid {
  solverId: string;
  solverName: string;
  solverProfile: 'alpha' | 'flash' | 'shield';
  proposedOutput: number;
  feeUsd: number;
  estimatedSlippagePct: number;
  estimatedExecutionTimeSec: number;
  collateralOfferedUsd: number;
  reputationScore: number; // 0 - 100
  subScores: SubScores;
  finalScore: number; // 0.0 - 1.0
  routeDescription: string;
}

export type PipelineStage = 
  | 'idle'
  | 'intent_submitted'
  | 'bidding'
  | 'sensitive_gate'
  | 'escrow_locked'
  | 'solver_committed'
  | 'executing_cross_chain'
  | 'verifying'
  | 'settled'
  | 'slashed_refunded';

export type VerificationType = 'optimistic' | 'zk_oracle';

export interface SettlementResult {
  intentId: string;
  winningSolverId: string;
  escrowReleasedUsd: number;
  solverBondSlashedUsd?: number;
  userRefundedUsd?: number;
  verificationType: VerificationType;
  txHash: string;
  success: boolean;
  failureReason?: string;
  executionTimeMs: number;
}
