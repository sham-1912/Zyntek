import type { UserIntent, SolverBid, SubScores } from './types';

// Helper for min-max normalization with fallback when min === max
function normalize(value: number, min: number, max: number): number {
  // If min === max, treat normalized score as 1.0 to avoid divide-by-zero
  if (min === max) return 1.0;

  const norm = (value - min) / (max - min);
  // Clamp between 0.0 and 1.0
  return Math.max(0.0, Math.min(1.0, norm));
}

function getMinMax(values: number[]) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  return { min, max };
}

export function calculateBidScores(intent: UserIntent, rawBids: Omit<SolverBid, 'subScores' | 'finalScore'>[]): SolverBid[] {
  const count = rawBids.length;
  if (count === 0) return [];

  // Extract raw series for normalization across all bids
  const outputs = rawBids.map((b) => b.proposedOutput);
  const feesInverted = rawBids.map((b) => (b.feeUsd === 0 ? 0 : 1 / b.feeUsd));
  const slippagesInverted = rawBids.map((b) => (b.estimatedSlippagePct === 0 ? 0 : 1 / b.estimatedSlippagePct));
  const execTimesInverted = rawBids.map((b) => (b.estimatedExecutionTimeSec === 0 ? 0 : 1 / b.estimatedExecutionTimeSec));
  const reputations = rawBids.map((b) => b.reputationScore);
  const collaterals = rawBids.map((b) => b.collateralOfferedUsd);

  const mmOutput = getMinMax(outputs);
  const mmFeeInv = getMinMax(feesInverted);
  const mmSlippageInv = getMinMax(slippagesInverted);
  const mmExecTimeInv = getMinMax(execTimesInverted);
  const mmReputation = getMinMax(reputations);
  const mmCollateral = getMinMax(collaterals);

  // Convert user sliders (0-100%) to weights summing to 1.0
  const sliderTotal = intent.sliders.cost + intent.sliders.speed + intent.sliders.safety;
  const userCostWeight = sliderTotal > 0 ? intent.sliders.cost / sliderTotal : 0.333;
  const userSpeedWeight = sliderTotal > 0 ? intent.sliders.speed / sliderTotal : 0.333;
  const userSafetyWeight = sliderTotal > 0 ? intent.sliders.safety / sliderTotal : 0.333;

  const scoredBids: SolverBid[] = rawBids.map((bid) => {
    const outputNorm = normalize(bid.proposedOutput, mmOutput.min, mmOutput.max);
    const feeNorm = normalize(bid.feeUsd === 0 ? 0 : 1 / bid.feeUsd, mmFeeInv.min, mmFeeInv.max);
    const slippageNorm = normalize(bid.estimatedSlippagePct === 0 ? 0 : 1 / bid.estimatedSlippagePct, mmSlippageInv.min, mmSlippageInv.max);
    
    const executionTimeNorm = normalize(
      bid.estimatedExecutionTimeSec === 0 ? 0 : 1 / bid.estimatedExecutionTimeSec,
      mmExecTimeInv.min,
      mmExecTimeInv.max
    );

    const reputationNorm = normalize(bid.reputationScore, mmReputation.min, mmReputation.max);
    const collateralNorm = normalize(bid.collateralOfferedUsd, mmCollateral.min, mmCollateral.max);

    // Sub-scores according to PRD formula:
    // CostScore = avg(outputNorm, feeNorm, slippageNorm)
    const costScore = (outputNorm + feeNorm + slippageNorm) / 3;

    // SpeedScore = executionTimeNorm
    const speedScore = executionTimeNorm;

    // SafetyScore = avg(reputationNorm, collateralNorm)
    const safetyScore = (reputationNorm + collateralNorm) / 2;

    // Weighted Final Score
    const finalScore = userCostWeight * costScore + userSpeedWeight * speedScore + userSafetyWeight * safetyScore;

    const subScores: SubScores = {
      costScore: Number(costScore.toFixed(3)),
      speedScore: Number(speedScore.toFixed(3)),
      safetyScore: Number(safetyScore.toFixed(3)),
      outputNorm: Number(outputNorm.toFixed(3)),
      feeNorm: Number(feeNorm.toFixed(3)),
      slippageNorm: Number(slippageNorm.toFixed(3)),
      executionTimeNorm: Number(executionTimeNorm.toFixed(3)),
      reputationNorm: Number(reputationNorm.toFixed(3)),
      collateralNorm: Number(collateralNorm.toFixed(3)),
    };

    return {
      ...bid,
      subScores,
      finalScore: Number(finalScore.toFixed(3)),
    };
  });

  // Sort descending by FinalScore
  return scoredBids.sort((a, b) => b.finalScore - a.finalScore);
}

/**
 * Checks whether top 2 bids are within the ambiguity threshold (default 5% or 0.05 score gap).
 */
export function checkAmbiguity(bids: SolverBid[], threshold = 0.05): { isAmbiguous: boolean; scoreGap: number } {
  if (bids.length < 2) return { isAmbiguous: false, scoreGap: 1.0 };
  const gap = Math.abs(bids[0].finalScore - bids[1].finalScore);
  return {
    isAmbiguous: gap <= threshold,
    scoreGap: Number(gap.toFixed(3)),
  };
}

/**
 * Checks whether intent is high-value ($1,000+ USD) requiring ZK/Oracle verification & user sign-off.
 */
export function isHighValueIntent(intent: UserIntent, threshold = 1000): boolean {
  return intent.sourceAmount >= threshold;
}
