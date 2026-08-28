# Zyntek — Decentralized Intent Solver Network for Cross-Chain Swaps

> **CSI ORIGIN 2026 — Problem Statement #10**  
> *“You state the outcome. Solvers compete to deliver it. The protocol proves they did before they get paid.”*

---

## 🌟 Overview & Core Novelty

**Zyntek** is a competitive, trust-minimized cross-chain intent settlement network. Instead of forcing users to manually select bridges, liquidity pools, relayers, or routes, users specify **what outcome they want** (Source Asset/Chain $\rightarrow$ Destination Asset/Chain) along with dynamic per-intent **Priority Sliders** (Cost, Speed, Safety).

Independent economic solver agents compete to fulfill the intent, and the EVM protocol verifies execution before releasing escrowed funds or slashing solver collateral.

### 🚀 Key Differentiators vs. Standard Aggregators
1. **Per-Intent Dynamic Scoring**: Per-intent Cost/Speed/Safety sliders drive real-time bid ranking instead of a hardcoded global formula.
2. **Tiered Hybrid Verification**: Fast, low-cost Optimistic verification for standard transfers; ZK/Oracle-backed proof verification for high-value intents ($\ge \$1,000$).
3. **Sensitive-Decision Gating**: The user is automated out of the loop *except* when a decision genuinely matters (ambiguous top bids within 5% score gap or high-value releases).
4. **Strict Solver Accountability**: 100% full-value collateral bond required from solvers prior to execution, automatically slashed on failure with live user refund.

---

## 🌿 Git Branch Structure & Team Workstreams

The repository was built across four dedicated feature branches and merged into `main`:

```
main (Final Integrated Codebase)
├── ritish        -> Smart Contracts (EVM Escrow, Solver Bonding, Hybrid Verifier, Settlement Engine)
├── sham          -> Scoring Engine & Solver Agent Bidding Simulator (3 Profiles: Alpha, Flash, Shield)
├── pratheen      -> Core Frontend UI (Intent Form, 100% Lock Sliders, Live Sub-Score Breakdown Table)
└── n_v_rithish   -> Sensitive-Decision Gate, Status Pipeline Stepper, Failure Slashing Simulation
```

---

## 📐 Dynamic Multi-Dimensional Scoring Engine Formula

Every bid submitted by solver agents is evaluated dynamically against normalized criteria:

$$\text{normalized}(x) = \frac{x - \min(x)}{\max(x) - \min(x)}$$

### Sub-Score Equations:
1. **Cost Sub-score**:
   $$\text{CostScore} = \frac{\text{norm}(\text{Output}) + \text{norm}(1/\text{Fee}) + \text{norm}(1/\text{Slippage})}{3}$$
2. **Speed Sub-score**:
   $$\text{SpeedScore} = \text{norm}(1/\text{ExecutionTime})$$
3. **Safety Sub-score**:
   $$\text{SafetyScore} = \frac{\text{norm}(\text{Reputation}) + \text{norm}(\text{Collateral})}{2}$$

### Final Weighted Score:
$$\text{FinalScore} = (w_{\text{cost}} \cdot \text{CostScore}) + (w_{\text{speed}} \cdot \text{SpeedScore}) + (w_{\text{safety}} \cdot \text{SafetyScore})$$

*Where $w_{\text{cost}}, w_{\text{speed}}, w_{\text{safety}}$ are dynamically derived from the user's priority sliders (strictly summing to 100%).*

---

## 🏛️ Smart Contracts Architecture (`/contracts`)

- **`IntentEscrow.sol`**: Locks user funds on EVM source chain upon intent creation.
- **`SolverBonding.sol`**: Enforces a 100% full-value collateral bond from the winning solver before cross-chain execution begins.
- **`HybridVerifier.sol`**: Implements tiered verification modes (Optimistic challenge window vs. ZK/Oracle attestation).
- **`SettlementEngine.sol`**: Releases escrow to solver upon valid proof, or slashes solver bond and refunds user on failure.

---

## 💻 Tech Stack & Extensions

- **Frontend**: React 19, TypeScript, Vite, TailwindCSS
- **Design & Icons**: Lucide React, Glassmorphism Cyber Theme, Canvas Confetti
- **Contracts / Web3 Integration**: Solidity ^0.8.20, Ethers.js, Contract Simulator Service

---

## 🛠️ Local Development & Build

### Prerequisites
- Node.js `v18+` or `v24+`
- npm `v9+` or `v11+`

### Installation & Launch

```bash
# Clone the repository
git clone https://github.com/sham-1912/Zyntek.git
cd Zyntek

# Install dependencies
npm install

# Start local development server
npm run dev

# Production build & TypeScript check
npm run build
```

---

## ⏱️ 90-Second Walkthrough Script (For Judges)

1. **Step 1: Intent & Priority Sliders (0:00 - 0:25)**
   - Select $500 USDC deposit. Adjust sliders (e.g. 70% Cost, 20% Speed, 10% Safety). Observe live 100% rebalancing lock. Click **Broadcast Intent**.
2. **Step 2: Live Bid Ranking & Sub-Score Breakdown (0:25 - 0:45)**
   - Highlight the **Sub-score Breakdown** (Cost, Speed, Safety progress bars). Show how Solver A (Alpha) wins on Cost weighting.
   - Adjust sliders to 80% Speed and re-broadcast $\rightarrow$ Solver B (Flash) dynamically jumps to Rank #1.
3. **Step 3: Sensitive Decision Checkpoint (0:45 - 1:05)**
   - Click the **$1,500 High-Value Preset**. Click Broadcast $\rightarrow$ The protocol pauses auto-execution and triggers the **Sensitive Decision Modal**, forcing ZK/Oracle verification & manual sign-off.
4. **Step 4: Status Pipeline & Full-Bond Slashing (1:05 - 1:30)**
   - Authorize execution $\rightarrow$ Watch live 5-stage status stepper: `Escrow Locked` $\rightarrow$ `Solver Committed` $\rightarrow$ `Solana Executed` $\rightarrow$ `Hybrid Verify` $\rightarrow$ `Settled`.
   - Click **Simulate Solver Failure & Force Slashing** $\rightarrow$ Observe solver collateral bond slashed live and user escrow instantly refunded!
