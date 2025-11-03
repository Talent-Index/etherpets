# EtherPets: Mindful Blockchain Companions

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Blockchain: Avalanche](https://img.shields.io/badge/Blockchain-Avalanche-red)](https://www.avax.network/)
[![Built with: React](https://img.shields.io/badge/Built_with-React-61DAFB?logo=react)](https://reactjs.org/)
[![Backend: Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js)](https://nodejs.org/)

**A decentralized wellness game where caring for your digital companion nurtures your own mental well-being.**

[Features](#-features) • [Quick Start](#-quick-start) • [Architecture](#-architecture) • [Documentation](#-documentation)

</div>

---

## Overview

**EtherPets** is a blockchain-powered companion game that reimagines the classic Tamagotchi experience through the lens of mindfulness and emotional wellness. Built on Avalanche for fast, low-cost transactions, EtherPets combines:

- Engaging Gameplay - Daily rituals, meditation exercises, and care mechanics
- Blockchain Ownership - True ownership of your digital companion as an NFT
- AI-Powered Emotions - Dynamic mood system that responds to your care patterns
- Social Connection - Community gardens, collaborative events, and player interactions
- Mental Wellness - Designed to reduce stress and promote mindfulness through play

### The Vision

**Problem:** Most games demand attention, create stress, and contribute to digital burnout.

**Solution:** EtherPets rewards calmness, consistency, and kindness. Each play session (5-15 minutes) leaves you feeling refreshed, not drained.

**Innovation:** Hidden emotional states (Trust, Empathy, Curiosity) aren't displayed as numbers—you learn your pet's personality through observation, creating a deeper emotional connection.

## Core Features

### Your SoulPet Companion
- Unique NFTs: Each pet is a one-of-a-kind ERC-721 token on Avalanche
- Dynamic Evolution: Grows and changes based on your care patterns
- Emotional Intelligence: AI-powered mood system responds to your actions
- Hidden Attributes: Discover your pet's personality through observation

### Mindfulness Mechanics
- Daily Rituals: Breathing exercises, gratitude journaling, focus puzzles
- Meditation Sessions: Guided activities that benefit both you and your pet
- Stress-Free Design: No penalties for taking breaks—your pet simply rests
- Progress Tracking: Monitor your mindfulness streak and emotional growth

### Blockchain Integration
- True Ownership: Your pet lives on-chain, fully owned by you
- Marketplace: Buy, sell, and trade in-game items (ERC-1155)
- Transparent Economy: All transactions recorded on Avalanche
- Low Fees: Fast, affordable interactions on Avalanche C-Chain

### Social Features
- Community Gardens: Join collaborative spaces with other players
- Energy Sharing: Send positive vibes to other pets
- Harmony Events: Global synchronization sessions
- Achievements: Unlock rewards through consistent care

## Architecture

### Technology Stack

#### Frontend
- Framework: React 18 with Vite
- Styling: TailwindCSS + Framer Motion
- Web3: Wagmi, Viem, ethers.js
- State Management: React Context API
- UI Components: Lucide React icons
- Real-time: Socket.io Client

#### Backend
- Runtime: Node.js with Express
- Database: MongoDB with Mongoose
- Blockchain: ethers.js for Avalanche integration
- Authentication: JWT + Wallet signatures
- Real-time: Socket.io for multiplayer
- Security: Helmet, rate limiting, CORS

#### Smart Contracts
- Language: Solidity ^0.8.19
- Framework: Hardhat
- Standards: ERC-721 (Pets), ERC-1155 (Items), ERC-20 (Rewards)
- Network: Avalanche C-Chain / Fuji Testnet
- Libraries: OpenZeppelin Contracts

### Project Structure

```
etherpets/
├── frontend/                  # React web application
│   ├── src/
│   │   ├── components/       # UI components (36 total)
│   │   ├── pages/            # Route pages (10 pages)
│   │   ├── context/          # State management (5 contexts)
│   │   ├── hooks/            # Custom React hooks
│   │   ├── utils/            # Helper functions
│   │   └── styles/           # Global styles
│   └── package.json
│
├── backend/                   # Node.js API server
│   ├── src/
│   │   ├── config/           # Configuration files
│   │   ├── controllers/      # Request handlers (18 files)
│   │   ├── models/           # MongoDB schemas (8 models)
│   │   ├── routes/           # API routes (18 routes)
│   │   ├── services/         # Business logic (15 services)
│   │   ├── middleware/       # Express middleware
│   │   └── utils/            # Utility functions
│   └── package.json
│
├── contracts/                 # Solidity smart contracts
│   ├── EtherPetNFT.sol       # Pet NFT (ERC-721)
│   ├── EtherItem.sol         # Items (ERC-1155)
│   ├── EtherGameLogic.sol    # Game mechanics
│   ├── EtherReward.sol       # Reward token (ERC-20)
│   ├── EtherMeditation.sol   # Meditation system
│   ├── EtherAura.sol         # Aura management
│   ├── EtherMarketplace.sol  # NFT marketplace
│   ├── scripts/              # Deployment scripts
│   └── hardhat.config.js
│
└── README.md                  # This file
```

## Quick Start

### Prerequisites

Before you begin, ensure you have:

- Node.js v18 or higher
- npm or yarn package manager
- MongoDB (local installation or MongoDB Atlas account)
- MetaMask or compatible Web3 wallet
- Avalanche Fuji Testnet AVAX (get from [faucet](https://faucet.avax.network/))

### Installation

**1. Clone the Repository**

```bash
git clone https://github.com/Talent-Index/etherpets.git
cd etherpets
```

**2. Install Dependencies**

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Install contract dependencies
cd ../contracts
npm install
```

**3. Configure Environment Variables**

Create `.env` files in each directory:

```bash
# Backend environment
cp backend/.env.example backend/.env

# Contracts environment
cp contracts/.env.example contracts/.env

# Frontend environment
cp frontend/.env.example frontend/.env
```

Edit each `.env` file with your configuration:

**Backend** (`backend/.env`):
```env
MONGODB_URI=mongodb://localhost:27017/etherpets
JWT_SECRET=your_secure_random_string
PRIVATE_KEY=your_wallet_private_key
AVALANCHE_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
PET_NFT_ADDRESS=          # Add after deployment
GAME_LOGIC_ADDRESS=       # Add after deployment
ITEM_CONTRACT_ADDRESS=    # Add after deployment
```

**Contracts** (`contracts/.env`):
```env
FUJI_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
PRIVATE_KEY=your_wallet_private_key
SNOWTRACE_API_KEY=your_snowtrace_api_key
```

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5000/api
VITE_AVALANCHE_FUJI_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
VITE_PET_NFT_CONTRACT=    # Add after deployment
VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
```

**4. Compile and Deploy Smart Contracts**

```bash
cd contracts

# Compile contracts
npx hardhat compile

# Deploy to Avalanche Fuji Testnet
npx hardhat run scripts/deploy.js --network fuji
```

**Important:** Copy the deployed contract addresses and update your `.env` files!

**5. Start the Application**

Open three terminal windows:

```bash
# Terminal 1: Start Backend
cd backend
npm run dev

# Terminal 2: Start Frontend
cd frontend
npm run dev

# Terminal 3: Ensure MongoDB is running
mongod
```

**6. Access the Application**

Open your browser and navigate to:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/health

### First-Time Setup

1. Connect your MetaMask wallet (Avalanche Fuji Testnet)
2. Create your first SoulPet (mints an NFT)
3. Complete daily rituals to nurture your pet
4. Watch your pet evolve based on your care!

## Documentation

- [Backend API Documentation](./backend/README.md) - API endpoints and integration guide
- [Frontend Guide](./frontend/README.md) - Component structure and development
- [Smart Contracts](./contracts/) - Contract specifications and deployment
- [Setup Guide](./SETUP_GUIDE.md) - Detailed step-by-step installation

## How to Play

### Daily Care Loop

1. Morning Check-In: Open the app and see your pet's current mood
2. Choose Activities: Select from breathing exercises, puzzles, or reflection
3. Earn Rewards: Complete rituals to earn in-game currency and items
4. Social Interaction: Visit other players' gardens or send positive energy
5. Track Progress: Monitor your mindfulness streak and pet's evolution

### Pet Evolution Stages

- Stage 1: Seed (Day 1-7) - Your pet begins as a glowing orb
- Stage 2: Sprout (Day 8-21) - First evolution based on care patterns
- Stage 3: Guardian (Day 22+) - Final form reflects your relationship

### Hidden Mechanics

Your pet has hidden emotional attributes:
- Calm: Influenced by breathing exercises and meditation
- Trust: Built through consistent daily visits
- Empathy: Grows when you help other players
- Curiosity: Increased by trying new activities

These hidden states affect your pet's behavior and evolution path!

## Development

### Available Scripts

**Backend:**
```bash
npm run dev          # Start development server
npm start            # Production server
npm test             # Run tests
npm run lint         # Check code quality
```

**Frontend:**
```bash
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # ESLint check
```

**Contracts:**
```bash
npx hardhat compile  # Compile contracts
npx hardhat test     # Run contract tests
npx hardhat run scripts/deploy.js --network fuji  # Deploy
```

### Testing

Run the complete test suite:

```bash
# Backend tests
cd backend && npm test

# Contract tests
cd contracts && npx hardhat test

# Frontend tests (if configured)
cd frontend && npm test
```

## Security

- Wallet-based authentication with JWT
- Rate limiting on API endpoints
- Input validation and sanitization
- CORS protection
- Helmet security headers
- Smart contract audited for common vulnerabilities

**Never share your private keys or seed phrases!**

## Contributing

We welcome contributions from the community! Here's how you can help:

### Ways to Contribute

- Report Bugs: Open an issue with details and reproduction steps
- Suggest Features: Share your ideas for improvements
- Improve Documentation: Help make our docs clearer
- Submit Code: Fix bugs or implement new features

### Contribution Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to your branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style and conventions
- Write clear commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- OpenZeppelin - Smart contract libraries
- Avalanche - High-performance blockchain platform
- React Team - Frontend framework
- Community Contributors - Thank you for your support!

## Support & Community

- Issues: [GitHub Issues](https://github.com/yourusername/etherpets/issues)
- Discussions: [GitHub Discussions](https://github.com/yourusername/etherpets/discussions)
- Twitter: [@EtherPets](https://twitter.com/etherpets)
- Discord: [Join our community](https://discord.gg/etherpets)

## Roadmap

### Phase 1: MVP (Current)
- Core pet mechanics
- Basic NFT system
- Daily rituals
- Simple marketplace

### Phase 2: Social Features (Q2 2025)
- Community gardens
- Multiplayer events
- Achievement system
- Leaderboards

### Phase 3: Advanced Features (Q3 2025)
- AR pet viewing
- Voice commands
- Cross-chain support
- Mobile app

### Phase 4: Ecosystem (Q4 2025)
- Breeding system
- Pet tournaments
- DAO governance
- Creator tools

---

<div align="center">

**Built with ❤️ for mental wellness and blockchain innovation**

*A game that heals instead of drains*

[⬆ Back to Top](#-etherpets-mindful-blockchain-companions)

</div>