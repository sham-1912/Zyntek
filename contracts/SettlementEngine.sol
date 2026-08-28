// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./IntentEscrow.sol";
import "./SolverBonding.sol";
import "./HybridVerifier.sol";

/**
 * @title SettlementEngine
 * @notice Orchestrates escrow release upon verified execution,
 * or slashes solver bond & refunds user upon verification failure / timeout.
 */
contract SettlementEngine {
    IntentEscrow public escrowContract;
    SolverBonding public bondingContract;
    HybridVerifier public verifierContract;

    event IntentSettled(bytes32 indexed intentId, address indexed winningSolver, uint256 amount);
    event IntentFailedAndSlashed(bytes32 indexed intentId, address indexed slashedSolver, string reason);

    constructor(
        address _escrow,
        address _bonding,
        address _verifier
    ) {
        escrowContract = IntentEscrow(_escrow);
        bondingContract = SolverBonding(_bonding);
        verifierContract = HybridVerifier(_verifier);
    }

    function executeSettlement(
        bytes32 intentId,
        address winningSolver,
        bool isVerificationSuccess,
        string memory failureReason
    ) external returns (bool) {
        if (isVerificationSuccess) {
            // Release escrow to winning solver
            escrowContract.releaseEscrow(intentId, winningSolver);
            // Return solver collateral bond
            bondingContract.returnBond(intentId);
            
            emit IntentSettled(intentId, winningSolver, 0);
            return true;
        } else {
            // Refund user from escrow
            escrowContract.refundEscrow(intentId);
            // Slash solver collateral bond to user (or penalty vault)
            bondingContract.slashBond(intentId, msg.sender);

            emit IntentFailedAndSlashed(intentId, winningSolver, failureReason);
            return false;
        }
    }
}
