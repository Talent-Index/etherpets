/**
 * Main App component that sets up the application structure
 * Includes routing, context providers, and global layout
 */
import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// Context providers
import { UserProvider, useUser } from './context/UserContext'
import { WalletProvider } from './context/WalletContext'
import { GameStateProvider } from './context/GameStateContext'
import { ThemeProvider } from './context/ThemeContext'

// Components
import NavBar from './components/common/NavBar'
import CreatePetModal from './components/pets/CreatePetModal'
import ErrorBoundary from './components/common/ErrorBoundary'

// Pages
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Garden from './pages/Garden'
import Reflection from './pages/Reflection'
import Inventory from './pages/Inventory'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import Tutorial from './pages/Tutorial'
import NotFound from './pages/NotFound'

const AppContent = () => {
  const [showCreatePet, setShowCreatePet] = useState(false)
  const { user, createPet } = useUser()

  // Automatically show create pet modal if there's a user but no pet
  useEffect(() => {
    if (user && user.pets.length === 0) {
      setShowCreatePet(true)
    }
  }, [user])

  return (
    <div className="min-h-screen bg-primary text-white">
      <NavBar onCreatePet={() => setShowCreatePet(true)} />
      
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Landing onCreatePet={() => setShowCreatePet(true)} />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/garden" element={<Garden />} />
          <Route path="/reflect" element={<Reflection />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/tutorial" element={<Tutorial />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <CreatePetModal
        isOpen={showCreatePet}
        onClose={() => setShowCreatePet(false)}
        onCreate={(petData) => {
          createPet(petData)
          setShowCreatePet(false)
        }}
      />
    </div>
  )
}

function App() {
  return (
    <Router>
      <WalletProvider>
        <GameStateProvider>
          <UserProvider>
            <ThemeProvider>
              <ErrorBoundary>
                <AppContent />
              </ErrorBoundary>
            </ThemeProvider>
          </UserProvider>
        </GameStateProvider>
      </WalletProvider>
    </Router>
  )
}

export default App