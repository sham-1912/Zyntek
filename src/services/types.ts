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
  eip712Signature?: string;
}

export interface Eip712Domain {
  name: string;
  version: string;
  chainId: number;
  verifyingContract: string;
}

export interface SubScores {
  costScore: number; // 0-100
  speedScore: number; // 0-100
  safetyScore: number; // 0-100
  outputNorm?: number;
  feeNorm?: number;
  slippageNorm?: number;
  executionTimeNorm?: number;
  reputationNorm?: number;
  collateralNorm?: number;
}

export interface SolverBid {
  solverId: string;
  solverName: string;
  expectedOutput: number;
  proposedOutput: number; // Backwards compatible alias
  feeUsd: number;
  etaSec: number;
  estimatedExecutionTimeSec: number; // Backwards compatible alias
  liquidityUsd: number;
  safetyRating: number; // 0 - 100
  reputationScore?: number;
  solverProfile?: 'alpha' | 'flash' | 'shield';
  solverAddress?: string;
  subScores: SubScores;
  finalScore: number; // 0 - 100
  routeDescription?: string;
  collateralOfferedUsd: number;
  synthesisRationale?: string;
  summaryPill?: string;
}

export type PipelineStage = 
  | 'idle'
  | 'intent'
  | 'escrow'
  | 'auction'
  | 'winner'
  | 'commitment'
  | 'execution'
  | 'verification'
  | 'settlement'
  | 'settled'
  | 'slashed_refunded'
  | 'broadcasting_solvers'
  | 'bidding_window'
  | 'scoring_bids'
  | 'escrow_mining'
  | 'escrow_locked'
  | 'solver_committed'
  | 'executing_cross_chain'
  | 'verifying';

export type VerificationType = 'optimistic' | 'zk_oracle';

export interface EvmEventLog {
  eventName: string;
  contractAddress: string;
  signature: string;
  topics: string[];
  data: string;
  blockNumber: number;
  transactionHash: string;
}

export interface SolanaCpiLog {
  programId: string;
  instructionName: string;
  slotNumber: number;
  signature: string;
  logs: string[];
}

export interface BlockReceipt {
  stepName: string;
  txHash: string;
  blockNumber: number;
  gasUsed: number;
  timestamp: number;
  explorerUrl: string;
  proofData?: string;
  evmLogs?: EvmEventLog[];
  solanaCpi?: SolanaCpiLog;
}

export interface ProofPayload {
  intentId: string;
  verificationType: VerificationType;
  zkProofHash: string;
  solanaBlockNumber: number;
  solanaTxSignature: string;
  attestationSigner: string;
  eip712Signature?: string;
  timestamp: number;
  status: 'VALIDATED' | 'CHALLENGED' | 'REJECTED';
}

export interface BalanceComparison {
  beforeSourceAmount: number;
  beforeSourceAsset: string;
  beforeSourceChain: string;
  afterDestinationAmount: number;
  afterDestinationAsset: string;
  afterDestinationChain: string;
  solverPayoutUsd: number;
  solverFeeUsd: number;
  protocolFeeUsd: number;
}

export interface SettlementResult {
  intentId: string;
  winningSolverId: string;
  escrowReleasedUsd: number;
  solverBondSlashedUsd?: number;
  userRefundedUsd?: number;
  protocolReserveUsd?: number;
  verificationType: VerificationType;
  txHash: string;
  success: boolean;
  failureReason?: string;
  executionTimeMs: number;
  receipts: BlockReceipt[];
  proofPayload?: ProofPayload;
  balanceComparison?: BalanceComparison;
}

export interface IntentHistoryItem {
  intent: UserIntent;
  status: PipelineStage;
  winningBid?: SolverBid;
  result?: SettlementResult;
  createdAt: number;
}
