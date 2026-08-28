// SPDX-License-Identifier: MIT
/**
 * Hardhat / Ethers.js Deployment Script for Zyntek Protocol
 * Usage: npx hardhat run contracts/scripts/deploy.js --network sepolia
 */
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying Zyntek Smart Contracts with account:", deployer.address);

  // 1. Deploy IntentEscrow
  const IntentEscrow = await ethers.getContractFactory("IntentEscrow");
  const escrow = await IntentEscrow.deploy();
  await escrow.waitForDeployment();
  const escrowAddress = await escrow.getAddress();
  console.log("IntentEscrow deployed to:", escrowAddress);

  // 2. Deploy SolverBonding
  const SolverBonding = await ethers.getContractFactory("SolverBonding");
  const bonding = await SolverBonding.deploy();
  await bonding.waitForDeployment();
  const bondingAddress = await bonding.getAddress();
  console.log("SolverBonding deployed to:", bondingAddress);

  // 3. Deploy HybridVerifier (with oracle signer)
  const oracleSignerAddress = deployer.address;
  const HybridVerifier = await ethers.getContractFactory("HybridVerifier");
  const verifier = await HybridVerifier.deploy(oracleSignerAddress);
  await verifier.waitForDeployment();
  const verifierAddress = await verifier.getAddress();
  console.log("HybridVerifier deployed to:", verifierAddress);

  // 4. Deploy SettlementEngine
  const SettlementEngine = await ethers.getContractFactory("SettlementEngine");
  const engine = await SettlementEngine.deploy(escrowAddress, bondingAddress, verifierAddress);
  await engine.waitForDeployment();
  const engineAddress = await engine.getAddress();
  console.log("SettlementEngine deployed to:", engineAddress);

  // Set settlement engine authorization
  await escrow.setSettlementEngine(engineAddress);
  await bonding.setSettlementEngine(engineAddress);
  console.log("SettlementEngine authorization granted on Escrow and Bonding contracts.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
