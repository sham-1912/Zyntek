// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title SolverBonding
 * @notice Solvers post a 100% full-value collateral bond before execution begins.
 * On failure or invalid verification proof, the bond is slashed.
 */
contract SolverBonding {
    enum BondStatus { None, Committed, Returned, Slashed }

    struct BondRecord {
        bytes32 intentId;
        address solver;
        uint256 bondAmount;
        uint256 commitTimestamp;
        BondStatus status;
    }

    mapping(bytes32 => BondRecord) public bonds;
    address public settlementEngine;
    address public owner;

    event BondCommitted(bytes32 indexed intentId, address indexed solver, uint256 bondAmount);
    event BondReturned(bytes32 indexed intentId, address indexed solver, uint256 bondAmount);
    event BondSlashed(bytes32 indexed intentId, address indexed solver, uint256 bondAmount, address beneficiary);

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

    function commitBond(bytes32 intentId, address solver, uint256 bondAmount) external payable {
        require(bonds[intentId].status == BondStatus.None, "Bond already exists");
        require(bondAmount > 0, "Bond must be > 0");

        bonds[intentId] = BondRecord({
            intentId: intentId,
            solver: solver,
            bondAmount: bondAmount,
            commitTimestamp: block.timestamp,
            status: BondStatus.Committed
        });

        emit BondCommitted(intentId, solver, bondAmount);
    }

    function returnBond(bytes32 intentId) external onlySettlementEngine {
        BondRecord storage record = bonds[intentId];
        require(record.status == BondStatus.Committed, "Bond not committed");

        record.status = BondStatus.Returned;
        emit BondReturned(intentId, record.solver, record.bondAmount);
    }

    function slashBond(bytes32 intentId, address beneficiary) external onlySettlementEngine {
        BondRecord storage record = bonds[intentId];
        require(record.status == BondStatus.Committed, "Bond not committed");

        record.status = BondStatus.Slashed;
        emit BondSlashed(intentId, record.solver, record.bondAmount, beneficiary);
    }
}
