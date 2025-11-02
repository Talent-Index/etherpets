# EtherPets: A Mindful On-Chain Companion Game

![EtherPets Banner](https://user-images.githubusercontent.com/1011226/180000000-placeholder-image.png)

**EtherPets** is a decentralized wellness game built on the Avalanche blockchain. It reimagines the classic Tamagotchi experience, focusing on emotional connection, mindfulness, and mental well-being. Players nurture a "SoulPet," a digital companion whose growth and mood are a reflection of the player's own mindfulness practices and emotional state.

The game is designed to be a gentle, restorative daily ritual, not a stressful grind. It blends on-chain ownership with off-chain AI-driven emotional intelligence to create a unique and personal journey.

## 🌟 Core Vision

*   **Problem:** Modern digital spaces, including games, often contribute to stress and overstimulation.
*   **Solution:** EtherPets offers a "healing" gameplay loop. It rewards calmness, consistency, and kindness, helping players feel more centered and emotionally aware after each session.
*   **The Twist:** The game incorporates a "hidden information" layer. Your SoulPet's deepest emotional states (like Trust and Empathy) are not shown as numbers but are inferred through its behavior, encouraging players to learn, observe, and connect with their companion on a deeper level.

## ✨ Features

*   **🐾 On-Chain SoulPets:** Each pet is a unique NFT on the Avalanche blockchain, with its core traits and evolution milestones stored immutably.
*   **🧠 AI-Powered Moods:** An integrated AI service analyzes player interactions to generate dynamic, responsive moods and behaviors for each pet.
*   **🧘 Mindful Rituals:** Engage in daily activities like guided meditations, gratitude journaling, and focus puzzles that nurture both you and your pet.
*   **🌐 Decentralized Economy:** A player-driven marketplace for in-game items, cosmetics, and food, all powered by smart contracts.
*   **🤝 Social & Collaborative Play:** Visit other players' gardens, send positive energy, and participate in community-wide "Harmony Events."
*   **🔐 Wallet-Based Identity:** Secure and seamless authentication using your existing crypto wallet.
*   **📊 Rich Analytics & History:** Track your pet's growth, your mindfulness streak, and export your journey's data.
*   **🚀 Full-Stack Application:** A complete monorepo with a React frontend, Node.js backend, and Solidity smart contracts.

## 🛠️ Tech Stack & Architecture

The project is a monorepo divided into three main parts: `frontend`, `backend`, and `contracts`.

```
 etherpets/
 │
 ├── frontend/      # React UI (Vite, TailwindCSS, Wagmi)
 ├── backend/       # Node.js API (Express, MongoDB, ethers.js)
 └── contracts/     # Solidity Smart Contracts (Hardhat, OpenZeppelin)
```

*   **Frontend:** A responsive web application built with **React (Vite)**, **Wagmi** for wallet interactions, **TailwindCSS** for styling, and **Framer Motion** for smooth animations.
*   **Backend:** A robust API built with **Node.js** and **Express**, using **MongoDB** for storing off-chain data (like game events and user progress) and **ethers.js** to communicate with the blockchain.
*   **Smart Contracts:** **Solidity** contracts for the Pet NFTs (ERC-721), in-game items (ERC-1155), and marketplace logic, developed and tested with **Hardhat**.
*   **Blockchain:** Deployed on the **Avalanche C-Chain** (or Fuji Testnet) for fast, low-cost transactions.

---

## 🚀 Getting Started

Follow these steps to set up and run the entire EtherPets project locally.

### Prerequisites

*   Node.js (v18 or later)
*   Yarn or npm
*   MongoDB instance running locally or a connection string from MongoDB Atlas.
*   A crypto wallet like MetaMask with funds on the Avalanche Fuji Testnet.

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd etherpets
```

### 2. Install Dependencies

Install dependencies for all three packages from the root directory.

```bash
# Install root, backend, frontend, and contract dependencies
npm install
npm run install:all
```

### 3. Environment Configuration

Create a `.env` file in the root of the `backend` directory (`/backend/.env`) by copying the example file.

```bash
cp backend/.env.example backend/.env
```

Then, create a `.env` file in the root of the `contracts` directory (`/contracts/.env`).

```bash
cp contracts/.env.example contracts/.env
```

Now, fill in the required variables in both `.env` files:

*   `backend/.env`: Set your `MONGODB_URI`, `JWT_SECRET`, `PRIVATE_KEY`, and `AVALANCHE_RPC_URL`.
*   `contracts/.env`: Set your `FUJI_RPC_URL` (or mainnet), `PRIVATE_KEY`, and `SNOWTRACE_API_KEY`.

### 4. Deploy Smart Contracts

Deploy the Solidity contracts to the Avalanche Fuji Testnet.

```bash
cd contracts
npx hardhat run scripts/deploy.js --network fuji
```

After deployment, copy the contract addresses printed in the console and update your `backend/.env` file with the correct addresses for the Pet NFT, Item, and other contracts.

### 5. Run the Application

You can run the frontend and backend servers concurrently from the root directory.

```bash
# From the root /etherpets directory
npm run dev
```

This will start:
*   The **Backend API** on `http://localhost:5000`
*   The **Frontend App** on `http://localhost:3000`

You can now open `http://localhost:3000` in your browser to use the application.

## 📂 Project Structure Deep Dive

*   `frontend/`: Contains all the client-side code. It's responsible for rendering the game UI, managing wallet connections, and communicating with the backend API. See the frontend README for more details.
*   `backend/`: The server-side logic. It handles user authentication, manages game state, processes pet actions, and interacts with the smart contracts. See the backend README for API endpoints and more.
*   `contracts/`: The heart of the on-chain logic. It defines the structure of the NFTs, the rules of the marketplace, and the ownership of in-game assets.

## 🤝 Contributing

We welcome contributions! If you'd like to help improve EtherPets, please fork the repository and submit a pull request. For major changes, please open an issue first to discuss what you would like to change.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

> This project was inspired by the idea of creating a game that heals instead of drains, blending the permanence of blockchain with the dynamic nature of emotional AI.