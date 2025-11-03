# EtherPets Frontend

React-based web application for EtherPets, a blockchain-powered digital companion platform focused on mindfulness and emotional wellness. Built with modern web technologies and integrated with Avalanche blockchain.

## Overview

EtherPets provides an interactive interface for users to create, manage, and interact with digital companions. The platform combines blockchain technology with wellness-focused activities including meditation, reflection, and community engagement.

## Technology Stack

- **Framework:** React 18.2 with Vite
- **Styling:** TailwindCSS with custom theming
- **Animations:** Framer Motion
- **Blockchain:** Wagmi, Viem, Ethers.js
- **State Management:** React Context API
- **Routing:** React Router v6
- **Data Visualization:** Recharts
- **Icons:** Lucide React
- **Real-time Communication:** Socket.io Client

## Prerequisites

- Node.js 16.x or higher
- npm or yarn package manager
- MetaMask or compatible Web3 wallet

## Installation

1. Clone the repository and navigate to the frontend directory:
```bash
cd etherpets/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables by creating a `.env` file:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```env
VITE_API_URL=http://localhost:5000/api
VITE_AVALANCHE_RPC=https://api.avax-test.network/ext/bc/C/rpc
VITE_CHAIN_ID=43113
```

## Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Build

Create a production build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
src/
├── components/      # Reusable UI components
│   ├── common/      # Shared components (buttons, modals, etc.)
│   ├── layout/      # Layout components (header, sidebar)
│   ├── pets/        # Pet-related components
│   ├── garden/      # Community garden components
│   ├── rituals/     # Mindfulness ritual components
│   ├── ar/          # AR viewing components
│   └── voice/       # Voice command components
├── context/         # React Context providers
├── hooks/           # Custom React hooks
├── pages/           # Route page components
├── utils/           # Utility functions and helpers
├── data/            # Static data and configurations
├── styles/          # Global styles and CSS
├── App.jsx          # Main application component
└── main.jsx         # Application entry point
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Key Features

### Pet Management
- Create and customize digital companions
- Track pet mood, energy, and statistics
- View pet evolution and growth

### Mindfulness Activities
- Daily ritual system with rewards
- Guided meditation sessions
- Breathing exercises
- Reflection journaling

### Community Features
- Community garden for collaborative activities
- Real-time chat functionality
- Shared puzzles and challenges

### Blockchain Integration
- Wallet connection via Wagmi
- Avalanche network support
- On-chain pet ownership
- Transaction management

## Configuration Files

- `vite.config.js` - Vite build configuration
- `tailwind.config.js` - TailwindCSS configuration
- `postcss.config.js` - PostCSS configuration
- `.eslintrc.cjs` - ESLint rules

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Follow the existing code style and conventions
2. Write clear commit messages
3. Test thoroughly before submitting changes
4. Update documentation as needed

## License

See LICENSE file in the root directory.

## Support

For issues and questions, please refer to the main project repository.