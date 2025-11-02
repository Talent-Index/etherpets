# EtherPets Frontend

This is the frontend application for **EtherPets**, a mindful on-chain companion game. It provides the user interface for interacting with SoulPets, managing wallet connections, and engaging in the game's wellness-focused activities.

## ✨ Features

*   **🦊 Pet Dashboard:** A central hub to view your pet's status, mood, and stats.
*   **🤖 AI Companion Chat:** Engage in conversation with your pet through an AI-powered chat interface.
*   **🎤 Voice Commands:** Control pet actions and interactions using your voice.
*   **🧘‍♀️ Mindful Rituals:** Participate in guided meditations and other wellness activities.
*   **🎨 Dynamic Theming:** Switch between light and dark modes for a comfortable viewing experience.
*   **🔐 Secure Wallet Integration:** Connect your wallet securely using Wagmi and WalletConnect.
*   **📊 Interactive Charts:** Visualize your pet's statistics and growth over time.
*   **🎉 Real-time Notifications:** Receive instant feedback and updates on your pet's activities.

## 🛠️ Tech Stack

- **Framework**: React (with Vite)
- **Styling**: TailwindCSS
- **Animation**: Framer Motion
- **Blockchain**: Wagmi, Viem, ethers.js
- **State Management**: React Context API
- **Routing**: React Router

## 🚀 Getting Started

These instructions assume you are running the project from the root of the `etherpets` monorepo.

### 1. Install Dependencies

If you haven't already, install all project dependencies from the root directory.

```bash
npm install
npm run install:all
```

### 2. Environment Variables

The frontend uses environment variables for configuration. You can create a `.env` file in the `/frontend` directory if needed, but most configuration is handled by the backend.

```
VITE_API_URL=http://localhost:5000/api
```

### 3. Run the Development Server

Start the frontend development server.

```bash
# From the /frontend directory
npm run dev
```

The application will be available at `http://localhost:3000`.

## 📂 Folder Structure

The `src` directory is organized to keep the codebase modular and maintainable.

```
src/
├── assets/         # Static assets like images, fonts, and icons
├── components/     # Reusable React components (e.g., PetCard, EnergyBar)
├── context/        # Global state management with React Context (User, Wallet, GameState)
├── hooks/          # Custom React hooks for shared logic
├── pages/          # Top-level page components for each route
├── utils/          # Utility functions (blockchain, formatters, API client)
├── App.jsx         # Main application component with routing
└── main.jsx        # Application entry point
```

This structure separates concerns, making it easier to navigate, develop, and test different parts of the application.