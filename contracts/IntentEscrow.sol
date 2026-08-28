// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IntentEscrow
 * @notice EVM Escrow contract locking user assets against an intentId.
 * Releasable only by the SettlementEngine upon verified execution.
 */
contract IntentEscrow {
    enum EscrowStatus { None, Locked, Released, Refunded }

    struct EscrowRecord {
        bytes32 intentId;
        address user;
        address assetToken;
        uint256 amount;
        uint256 lockTimestamp;
        uint256 deadline;
        EscrowStatus status;
    }

    mapping(bytes32 => EscrowRecord) public escrows;
    address public settlementEngine;
    address public owner;

    event EscrowLocked(bytes32 indexed intentId, address indexed user, uint256 amount, uint256 deadline);
    event EscrowReleased(bytes32 indexed intentId, address indexed recipient, uint256 amount);
    event EscrowRefunded(bytes32 indexed intentId, address indexed user, uint256 amount);

    modifier onlySettlementEngine() {
        require(msg.sender == settlementEngine, "Only SettlementEngine can call");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function setSettlementEngine(address _engine) external {
        require(msg.sender == owner, "Only owner");
        settlementEngine = _engine;
    }

    function lockEscrow(
        bytes32 intentId,
        address assetToken,
        uint256 amount,
        uint256 deadlineMinutes
    ) external payable {
        require(escrows[intentId].status == EscrowStatus.None, "Escrow already exists");
        require(amount > 0, "Amount must be > 0");

        escrows[intentId] = EscrowRecord({
            intentId: intentId,
            user: msg.sender,
            assetToken: assetToken,
            amount: amount,
            lockTimestamp: block.timestamp,
            deadline: block.timestamp + (deadlineMinutes * 1 minutes),
            status: EscrowStatus.Locked
        });

        emit EscrowLocked(intentId, msg.sender, amount, block.timestamp + (deadlineMinutes * 1 minutes));
    }

    function releaseEscrow(bytes32 intentId, address recipient) external onlySettlementEngine {
        EscrowRecord storage record = escrows[intentId];
        require(record.status == EscrowStatus.Locked, "Escrow not locked");
        
        record.status = EscrowStatus.Released;
        emit EscrowReleased(intentId, recipient, record.amount);
    }

    function refundEscrow(bytes32 intentId) external onlySettlementEngine {
        EscrowRecord storage record = escrows[intentId];
        require(record.status == EscrowStatus.Locked, "Escrow not locked");

        record.status = EscrowStatus.Refunded;
        emit EscrowRefunded(intentId, record.user, record.amount);
    }
}
