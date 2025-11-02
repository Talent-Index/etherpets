/**
 * Main entry point for the EtherPets React application
 * Renders the root component and sets up the application
 */
import React from 'react'
import ReactDOM from 'react-dom/client'
import { WagmiProvider, createConfig, http } from 'wagmi'
import { avalanche, avalancheFuji } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { injected } from 'wagmi/connectors'

import App from './App.jsx'
import './styles/globals.css'

// Setup Wagmi config
const config = createConfig({
  chains: [avalanche, avalancheFuji],
  connectors: [injected()],
  transports: {
    [avalanche.id]: http(),
    [avalancheFuji.id]: http(),
  },
})

// Setup React Query client
const queryClient = new QueryClient()

// Create root and render the App component
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>,
)