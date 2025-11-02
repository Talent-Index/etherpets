# EtherPets Backend

This is the backend server for **EtherPets**, an on-chain Tamagotchi-style game focused on mindfulness and emotional wellness, built on the Avalanche blockchain.

## Features

- 🐾 Pet management system
- 🔐 Wallet-based authentication
- 🧠 AI-powered mood analysis
- ⛓️ Smart contract integration (Avalanche C-Chain)
- 🎮 Game event tracking
- 📊 User statistics and streaks
- 🔒 JWT-based security
- 🛒 In-game shop and inventory management
- 🏆 Leaderboards and seasonal rewards
-  WebSocket support for real-time updates

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Blockchain Interaction**: ethers.js
- **Authentication**: JWT + Wallet signatures
- **Real-time**: Socket.io
- **Deployment**: Docker-ready

## Setup Instructions

1. **Clone the repository**
   ```bash
   # Navigate to the root of the monorepo if you haven't already
   cd etherpets
   ```

2. **Install dependencies**
   ```bash
   # From the root directory
   npm install
   
   # Or, if installing for the backend only
   cd backend
   npm install
   ```

3. **Environment Configuration**
   ```bash
   # In the /backend directory
   cp .env.example .env
   ```
   Edit the `.env` file with your configuration:
   - `MONGODB_URI`: Your MongoDB connection string.
   - `JWT_SECRET`: A secret key for signing JWTs.
   - `PRIVATE_KEY`: The private key of the wallet that will pay for gas fees.
   - `AVALANCHE_RPC_URL`: RPC URL for the Avalanche network (e.g., Fuji testnet).
   - `ADMIN_WALLETS`: Comma-separated list of admin wallet addresses.

4. **Run the application**
   ```bash
   # From the /backend directory
   # Development mode with hot-reloading
   npm run dev

   # Production mode
   npm start
   ```
   The server will start on the port specified in your `.env` file (default: 5000).


Install dependencies

bash
npm install
Environment Configuration

bash
cp .env.example .env
# Edit .env with your configuration
Start MongoDB

bash
# Make sure MongoDB is running locally or update MONGODB_URI
Run the application

## API Endpoints

A comprehensive list of API endpoints is available through the route definitions in `src/routes/`.

*   **Users**: `POST /api/users/login`, `GET /api/users/profile`
*   **Pets**: `POST /api/pets`, `GET /api/pets/owner/:owner`, `POST /api/pets/:petId/feed`
*   **Game Actions**: `POST /api/game/pets/:petId/meditate`
*   **Inventory**: `GET /api/inventory`, `POST /api/inventory/items/:itemId/use`
*   **Shop**: `GET /api/shop/items`, `POST /api/shop/items/:itemId/purchase`
*   **Marketplace**: `GET /api/marketplace/listings`, `POST /api/marketplace/pets/:petId/purchase`
*   **Rewards & Quests**: `POST /api/rewards/daily`, `GET /api/quests`
*   **Leaderboards**: `GET /api/leaderboards/pets`
*   **Admin**: `GET /api/admin/stats`, `GET /api/admin/users`
*   **Health**: `GET /health`

For detailed request/response formats, please refer to the controller logic in `src/controllers/`.

## Folder Structure

```
src/
├── config/         # Database and environment configuration
├── controllers/    # Express route handlers (business logic)
├── middleware/     # Auth, error handling, validation
├── models/         # Mongoose schemas for DB collections
├── routes/         # API route definitions
├── services/       # Business logic services (AI, Blockchain, etc.)
└── utils/          # Helper functions, logger, constants
```