# Zyntek — Decentralized Intent Solver Network for Cross-Chain Swaps

> **CSI ORIGIN 2026 — Problem Statement #10**  
> *“You state the outcome. Solvers compete to deliver it. The protocol proves they did before they get paid.”*

---

## 🌟 Overview & 10-Stage Protocol Lifecycle

**Zyntek** is a competitive, trust-minimized cross-chain intent settlement network. Instead of forcing users to manually select bridges, liquidity pools, relayers, or routes, users specify **what outcome they want** (Source Asset/Chain $\rightarrow$ Destination Asset/Chain) along with dynamic per-intent **Priority Sliders** (Cost, Speed, Safety).

Independent economic solver agents compete to fulfill the intent, backed by EVM escrow, hybrid verifiers, and full-bond slashing accountability.

### 🔄 The 10 Protocol Lifecycle Stages
1. **Stage 0 — Landing & Network Health**: Live status bar (3 active solvers, response latency, Escrow TVL) + 4-step primer (`Intent` $\rightarrow$ `Bid` $\rightarrow$ `Verify` $\rightarrow$ `Settle`).
2. **Stage 1 — Intent Creation**: Smart defaults (EVM USDC $\rightarrow$ Solana USDC), auto-rebalancing sliders (strictly $100\%$), live strategy preview, inline high-value gate tooltip, and pre-commit wallet signature approval modal.
3. **Stage 2 — Escrow Lock**: On-chain deposit confirmation with block explorer receipt (`0x8f2a...c91d`).
4. **Stage 3 — Broadcasting to Solvers**: Network propagation visual with ticking solver counter (`1/3` $\rightarrow$ `3/3`).
5. **Stage 4 — Solver Bidding**: Live 5-second auction countdown, staggered bid arrivals ($1.2\text{s}, 2.5\text{s}, 3.8\text{s}$), plain-language summary pills (`"Cheaper but slower"`, `"Fast but pricier"`), auto vs manual decision banners, and *"Why this ranked #1"* synthesis.
6. **Stage 5 — Solver Commitment**: Staking collateral bond status with `"100% Collateralized"` skin-in-the-game badge.
7. **Stage 6 — Cross-Chain Execution**: Paced 6-second multi-substep Solana execution tracker (`Broadcasting` $\rightarrow$ `Finalizing` $\rightarrow$ `Attesting`).
8. **Stage 7 — Hybrid Verification**: Live 15-second challenge window countdown, contextual path notes (`Optimistic` vs `ZK/Oracle`), and inspectable cryptographic proof payload modal.
9. **Stage 8 — Settlement**: Before/After balance comparison card (`$500.00 USDC (Ethereum) → $496.00 USDC (Solana)`) and two-sided solver payout breakdown.
10. **Stage 9 — Organic Failure & Slashing**: Distinct warning visual framing, automatic escrow refund receipt, and transparent solver bond slashing breakdown.
11. **Stage 10 — History & Persistence**: Complete `localStorage` state persistence so browser refreshes never lose active/past intents.

---

## 🌿 Git Branch Structure & Team Workstreams

The repository was built across four dedicated feature branches and merged into `main`:

```
main (Final Integrated Codebase)
├── ritish        -> Smart Contracts (EVM Escrow, Solver Bonding, Hybrid Verifier, Settlement Engine)
├── sham          -> Scoring Engine & Solver Agent Pool (3 Profiles: Alpha, Flash, Shield)
├── pratheen      -> Core Frontend UI (Intent Form, 100% Lock Sliders, Live Sub-Score Breakdown Table)
└── n_v_rithish   -> Sensitive-Decision Gate, Status Pipeline Stepper, Failure Slashing Simulation
```

---

## 📐 Dynamic Multi-Dimensional Scoring Engine Formula

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

---

## 🛠️ Local Development & Build

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

1. **Step 1: Intent Creation & Sliders (0:00 - 0:25)**
   - View live network status bar. Adjust sliders $\rightarrow$ Observe proportional auto-rebalancing and live strategy preview line. Click **Review & Broadcast Intent** $\rightarrow$ Approve wallet pre-commit signature.
2. **Step 2: Staggered Auction & Plain-Language Bids (0:25 - 0:45)**
   - Watch solvers arrive one by one ($1/3 \rightarrow 3/3$). Note summary pills (`Cheaper but slower`, `Fast but pricier`) and the *"Why this ranked #1"* scoring synthesis rationale.
3. **Step 3: High-Value Gate Checkpoint (0:45 - 1:05)**
   - Click `$1,500 High-Value Gate` preset $\rightarrow$ Hover high-value tooltip $\rightarrow$ Protocol triggers **Sensitive Decision Modal**, requiring ZK/Oracle verification & user sign-off.
4. **Step 4: Paced Solana Execution & Settlement (1:05 - 1:30)**
   - Authorize execution $\rightarrow$ Watch 6s multi-substep Solana execution $\rightarrow$ Challenge window timer (0:15) $\rightarrow$ Inspect cryptographic proof payload modal $\rightarrow$ View Stage 8 Before/After balance comparison card!
