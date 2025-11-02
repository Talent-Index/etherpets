import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { UserProvider } from './context/UserContext'
import { WalletProvider } from './context/WalletContext'
import { GameStateProvider } from './context/GameStateContext'
import NavBar from './components/common/NavBar'
import LoadingSpinner from './components/common/LoadingSpinner'
import CreatePetModal from './components/pets/CreatePetModal'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Garden from './pages/Garden'
import Reflection from './pages/Reflection'
import Inventory from './pages/Inventory'
import Profile from './pages/Profile'

function App() {
  const [showCreatePet, setShowCreatePet] = useState(false)

  return (
    <Router>
      <WalletProvider>
        <UserProvider>
          <GameStateProvider>
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
                </Routes>
              </main>

              {/* Create Pet Modal */}
              <CreatePetModal
                isOpen={showCreatePet}
                onClose={() => setShowCreatePet(false)}
                onCreate={(petData) => {
                  // This would be handled by the UserContext
                  console.log('Creating pet:', petData)
                  setShowCreatePet(false)
                }}
              />
            </div>
          </GameStateProvider>
        </UserProvider>
      </WalletProvider>
    </Router>
  )
}

export default App