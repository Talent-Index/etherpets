import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { UserProvider } from './context/UserContext'
import { WalletProvider } from './context/WalletContext'
import { GameStateProvider } from './context/GameStateContext'
import NavBar from './components/common/NavBar'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Garden from './pages/Garden'
import Reflection from './pages/Reflection'
import Inventory from './pages/Inventory'
import Profile from './pages/Profile'

function App() {
  return (
    <Router>
      <WalletProvider>
        <UserProvider>
          <GameStateProvider>
            <div className="min-h-screen bg-primary text-white">
              <NavBar />
              <main className="container mx-auto px-4 py-8">
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/garden" element={<Garden />} />
                  <Route path="/reflect" element={<Reflection />} />
                  <Route path="/inventory" element={<Inventory />} />
                  <Route path="/profile" element={<Profile />} />
                </Routes>
              </main>
            </div>
          </GameStateProvider>
        </UserProvider>
      </WalletProvider>
    </Router>
  )
}

export default App