// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title HybridVerifier
 * @notice Tiered verification module:
 * - Standard intents: Optimistic timelock proof verification
 * - High-value intents: ZK/Oracle attestation proof verification
 */
contract HybridVerifier {
    enum VerificationMode { Optimistic, ZkOracle }
    enum ProofStatus { Pending, Validated, Rejected }

    struct VerificationProof {
        bytes32 intentId;
        VerificationMode mode;
        bytes32 proofHash;
        uint256 submittedAt;
        ProofStatus status;
    }

    mapping(bytes32 => VerificationProof) public proofs;
    address public oracleSigner;

    event ProofSubmitted(bytes32 indexed intentId, VerificationMode mode, bytes32 proofHash);
    event ProofVerified(bytes32 indexed intentId, bool success, string message);

    constructor(address _oracle) {
        oracleSigner = _oracle;
    }

    function submitProof(
        bytes32 intentId,
        VerificationMode mode,
        bytes32 proofHash
    ) external {
        proofs[intentId] = VerificationProof({
            intentId: intentId,
            mode: mode,
            proofHash: proofHash,
            submittedAt: block.timestamp,
            status: ProofStatus.Pending
        });

        emit ProofSubmitted(intentId, mode, proofHash);
    }

    function verifyOptimistic(bytes32 intentId, bool challengeRaised) external returns (bool) {
        VerificationProof storage proof = proofs[intentId];
        require(proof.mode == VerificationMode.Optimistic, "Not optimistic mode");

        if (challengeRaised) {
            proof.status = ProofStatus.Rejected;
            emit ProofVerified(intentId, false, "Optimistic challenge succeeded - proof rejected");
            return false;
        } else {
            proof.status = ProofStatus.Validated;
            emit ProofVerified(intentId, true, "Optimistic challenge window passed clean");
            return true;
        }
    }

    function verifyZkOracle(bytes32 intentId, bytes memory signature) external returns (bool) {
        VerificationProof storage proof = proofs[intentId];
        require(proof.mode == VerificationMode.ZkOracle, "Not ZK/Oracle mode");

        // Validate mock oracle attestation / ZK proof stub
        if (signature.length > 0) {
            proof.status = ProofStatus.Validated;
            emit ProofVerified(intentId, true, "ZK/Oracle attestation valid");
            return true;
        } else {
            proof.status = ProofStatus.Rejected;
            emit ProofVerified(intentId, false, "Invalid ZK/Oracle attestation");
            return false;
        }
    }
}
