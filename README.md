# 🥇 TrustChain: Social Recovery Smart Wallet Layer

## 🔐 Problem

In the decentralized world, **losing access to your wallet = losing your identity and assets forever**. There’s no customer support to help you recover, and existing social recovery wallets are either too complex or underutilized.

## ✅ Solution: TrustChain

**TrustChain** is a user-friendly **smart wallet layer on BlockDAG** that enables **social recovery** via guardian-based multisig logic. It combines security, convenience, and transparency — with a focus on real-world usage and safety features.

---

## 🚀 Key Features

### 🔑 1. Smart Wallet with Guardians
- Users can create a wallet and assign **guardians** (friends, family, or other wallets).
- Guardians can help **recover access** if the user loses private keys.
- Threshold-based recovery: e.g., 2-of-3 guardian signatures.

### 🧠 2. Social Recovery Logic (Multisig)
- Built-in smart contract recovery function.
- Flexible multisig logic to adjust the number of required guardian approvals.

### 🔄 3. Undo Transactions
- Add an **"Undo" option** for transactions sent by mistake.
- Temporarily holds the transaction in a reversible buffer for X seconds/minutes before finalization.

### 🔔 4. Notification on Accidental Receipts
- If someone **accidentally sends tokens**, the receiver is notified.
- Offers a simple **return option** to send them back to the sender.
- Helps build a culture of ethical returns and transparency.

### 🆓 5. Gasless Login (Session Keys)
- Uses **BlockDAG’s gasless wallet SDK** for seamless onboarding.
- Allows users to log in and interact without needing gas tokens.
- Ideal for mainstream adoption and better UX.

---

## 📱 User Interface

- Built with **React + TailwindCSS**.
- Simple onboarding to create or import wallet.
- Guardian management panel.
- Notification center for received funds.
- Undo transaction timer UI with confirmation modals.
- Mobile-responsive and accessible.

---

## 🛠️ Tech Stack

| Layer        | Tool/Framework                   |
|--------------|----------------------------------|
| Frontend     | React + TailwindCSS              |
| Wallet SDK   | BlockDAG Wallet & UX SDK         |
| Contracts    | Solidity (via BlockDAG Contract Wizard / Hardhat) |
| Blockchain   | **BlockDAG Primordial Testnet**  |
| Notifications| Push mechanism (mock or on-chain)|
| Deployment   | Vercel + IPFS (optional)         |

---

## 📦 Smart Contract Overview

### `TrustChainWallet.sol`

- `addGuardian(address guardian)`
- `removeGuardian(address guardian)`
- `recoverWallet(address newOwner, address[] calldata signatures)`
- `undoLastTransaction()`
- `notifyIncoming(address sender, uint256 amount)`
- `returnTokens(address originalSender)`

Contracts are written in Solidity and deployed on **BlockDAG Testnet**.

---

## 🔐 Recovery Workflow

1. Owner loses keys → initiates recovery from another wallet.
2. Guardians receive recovery request.
3. 2-of-3 (or configurable threshold) approve recovery.
4. Contract assigns a **new owner** safely.

---

## 🔔 Undo Workflow

1. User initiates a transaction.
2. System sets a **buffer time** (e.g., 30 seconds).
3. User can **cancel** during this time.
4. After the buffer, the transaction becomes final.

---

## 📨 Token Receipt Notification Workflow

1. Wallet receives unexpected tokens.
2. UI shows a notification: _"You’ve received tokens from an unknown address. Return?"_
3. User can return or ignore.

---

# Step 1: Clone your repository (optional)
# git clone https://github.com/rohitjadhav07/BlockDagHack.git
echo "🔧 Installing frontend dependencies..."
npm install
echo "🌐 Starting frontend at http://localhost:5173 ..."
npm run dev

echo "✅ TrustChain is set up and running!"


## 🧪 Demo & Walkthrough

[📽️ Watch Demo Video](https://your-demo-link.com)  
[🌐 Live App](https://trustchain.vercel.app)  
[🧠 Smart Contract Explorer](https://blockdag.explorer/testnet/contracts/...)

---

## 🧱 Project Structure

trustchain/
├── contracts/
│ └── TrustChainWallet.sol
├── frontend/
│ ├── components/
│ ├── pages/
│ ├── hooks/
│ └── App.jsx
├── scripts/
│ └── deploy.js
├── hardhat.config.js
└── README.md

---

## 🌟 Why It Wins

| Aspect               | Value |
|----------------------|-------|
| 🧠 Intuitive Recovery | Makes wallets human-friendly with social backup |
| 🔄 Undo Feature      | Prevents accidental losses |
| 🔔 Ethical UX        | Notifications & token returns build trust |
| 💸 Gasless UX        | Powered by BlockDAG’s advanced SDKs |
| 🧰 Real Use-Case     | High adoption potential in real-world dApps |

---

## 🧭 Future Plans

- 🔁 Integrate with BlockDAG's native wallet seamlessly.
- 🪙 Add DAO-based guardianship (voting model for recovery).
- 🔐 Enable biometric guardians (e.g., device-based approvals).
- 📱 Launch mobile version (React Native).
- ⛓️ Explore cross-chain recovery support.

---

## 🤝 Credits

- Developed for the **BlockDAG Hackathon**.
- Built by Rohit and contributors.
- Special thanks to the BlockDAG team for SDKs, IDE, and gasless infra.

---

## 📬 Contact

Have feedback or ideas?

Email: rohitjadhav45074507@gmail.com  

---

> _"A wallet you can trust, because your identity shouldn’t be a single point of failure."_

