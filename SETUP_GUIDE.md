# EtherPets - Complete Setup Guide

## 🎯 Quick Start (Follow in Order)

This guide will get your EtherPets project fully operational.

---

## Step 1: Install Dependencies

### Install Root Dependencies
```bash
# From project root
cd d:\Projects\etherpets
npm install
```

### Install Backend Dependencies
```bash
cd backend
npm install
```

### Install Frontend Dependencies
```bash
cd frontend
npm install
```

### Install Contract Dependencies
```bash
cd contracts
npm install
```

---

## Step 2: Setup MongoDB

### Option A: Local MongoDB
```bash
# Start MongoDB service (Windows)
net start MongoDB

# Or use MongoDB Compass to start your local instance
```

### Option B: MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get your connection string
4. Use it in `.env` file

---

## Step 3: Compile Smart Contracts

```bash
cd contracts

# Create .env file
cp .env.example .env

# Edit contracts/.env and add:
# - PRIVATE_KEY (your wallet private key)
# - FUJI_RPC_URL (Avalanche testnet RPC)
# - SNOWTRACE_API_KEY (optional, for verification)

# Compile contracts - THIS IS CRITICAL
npx hardhat compile
```

**Expected Output:**
```
Compiled 7 Solidity files successfully
```

This creates the `artifacts/` folder needed by the backend.

---

## Step 4: Deploy Contracts to Avalanche Fuji Testnet

```bash
# Still in contracts directory

# Make sure you have testnet AVAX in your wallet
# Get free testnet AVAX: https://faucet.avax.network/

# Deploy contracts
npx hardhat run scripts/deploy.js --network fuji
```

**Save the contract addresses** from the output! You'll need them.

---

## Step 5: Configure Backend Environment

```bash
cd backend

# Create .env file
cp .env.example .env
```

Edit `backend/.env` and configure:

```env
# Server
NODE_ENV=development
PORT=5000

# Database - Use your MongoDB connection string
MONGODB_URI=mongodb://localhost:27017/etherpets

# JWT Secret - Generate a random string
JWT_SECRET=your_super_secure_random_string_here
JWT_EXPIRES_IN=7d

# Blockchain
AVALANCHE_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
PRIVATE_KEY=your_wallet_private_key_here
CHAIN_ID=43113

# Smart Contract Addresses - PASTE FROM DEPLOYMENT
PET_NFT_ADDRESS=0x...
GAME_LOGIC_ADDRESS=0x...
ITEM_CONTRACT_ADDRESS=0x...
REWARD_TOKEN_ADDRESS=0x...
MEDITATION_ADDRESS=0x...
AURA_SYSTEM_ADDRESS=0x...
MARKETPLACE_ADDRESS=0x...

# Admin (your wallet address)
ADMIN_WALLETS=0xYourWalletAddress

# Optional: Redis (for caching)
REDIS_URL=redis://localhost:6379
```

---

## Step 6: Configure Frontend Environment

```bash
cd frontend

# Create .env file
cp .env.example .env
```

Edit `frontend/.env`:

```env
# Backend API
VITE_API_URL=http://localhost:5000/api

# Blockchain
VITE_AVALANCHE_RPC_URL=https://api.avax.network/ext/bc/C/rpc
VITE_AVALANCHE_FUJI_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
VITE_DEFAULT_CHAIN_ID=43113

# Contract Addresses - PASTE FROM DEPLOYMENT
VITE_PET_NFT_CONTRACT=0x...
VITE_GAME_LOGIC_CONTRACT=0x...
VITE_REWARD_TOKEN_CONTRACT=0x...

# WalletConnect (get from https://cloud.walletconnect.com)
VITE_WALLETCONNECT_PROJECT_ID=your_project_id_here

# Features
VITE_ENABLE_AI_MOOD=true
VITE_SOCKET_URL=http://localhost:5000
```

---

## Step 7: Start the Application

### Terminal 1: Backend
```bash
cd backend
npm run dev
```

**Expected Output:**
```
🚀 EtherPets Backend Server Started!
📍 Port: 5000
📍 Database: Connected
✨ Server is ready to receive requests!
```

### Terminal 2: Frontend
```bash
cd frontend
npm run dev
```

**Expected Output:**
```
VITE ready in XXX ms
➜ Local: http://localhost:5173/
```

---

## Step 8: Test the Application

1. Open browser: http://localhost:5173
2. Connect your MetaMask wallet (Avalanche Fuji testnet)
3. Create your first pet
4. Interact with your pet (feed, play, meditate)

---

## 🔍 Verification Checklist

✅ MongoDB is running and connected  
✅ Contracts compiled (artifacts folder exists)  
✅ Contracts deployed to Avalanche Fuji  
✅ Backend `.env` has all contract addresses  
✅ Frontend `.env` has all contract addresses  
✅ Backend server running on port 5000  
✅ Frontend running on port 5173  
✅ MetaMask connected to Avalanche Fuji testnet  
✅ Wallet has testnet AVAX for gas fees

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check MongoDB connection
mongosh

# Check if port 5000 is available
netstat -ano | findstr :5000
```

### "Contract artifacts not found" warning
```bash
# Compile contracts
cd contracts
npx hardhat compile
```

### "PET_NFT_ADDRESS not set" warning
- Make sure you deployed contracts
- Copy addresses to `backend/.env`

### Frontend can't connect to backend
- Check backend is running on port 5000
- Verify `VITE_API_URL` in `frontend/.env`

### Can't mint pet
- Ensure wallet has testnet AVAX
- Check contract addresses in both `.env` files
- Verify contracts are deployed

---

## 📚 Additional Resources

### API Documentation
All API endpoints: http://localhost:5000/health

### Smart Contract Explorer
View your deployed contracts: https://testnet.snowtrace.io/

### Project Structure
```
etherpets/
├── backend/          # Node.js API (Port 5000)
├── frontend/         # React UI (Port 5173)
├── contracts/        # Solidity contracts
└── PROJECT_AUDIT_REPORT.md  # Full audit details
```

---

## 🎉 Success!

If all steps completed successfully, you now have:
- ✅ Fully functional backend API
- ✅ Beautiful React frontend
- ✅ Smart contracts deployed on Avalanche
- ✅ All components connected and working

**Start creating and caring for your EtherPets! 🐾**

---

## 🔗 Useful Links

- **Get Testnet AVAX:** https://faucet.avax.network/
- **Avalanche Docs:** https://docs.avax.network/
- **MongoDB Atlas:** https://www.mongodb.com/cloud/atlas
- **WalletConnect:** https://cloud.walletconnect.com/

---

*For detailed technical audit, see `PROJECT_AUDIT_REPORT.md`*
