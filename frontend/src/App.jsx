/**
 * Main App component that sets up the application structure
 * Includes routing, context providers, and global layout
 */
import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// Context providers
import { UserProvider } from './context/UserContext'
import { WalletProvider } from './context/WalletContext'
import { GameStateProvider } from './context/GameStateContext'

// Components
import NavBar from './components/common/NavBar'
import LoadingSpinner from './components/common/LoadingSpinner'
import CreatePetModal from './components/pets/CreatePetModal'

// Pages
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Garden from './pages/Garden'
import Reflection from './pages/Reflection'
import Inventory from './pages/Inventory'
import Profile from './pages/Profile'
import Settings from './pages/Settings'

function App() {
  const [showCreatePet, setShowCreatePet] = useState(false)

  return (
    <Router>
      <WalletProvider>
        <UserProvider>
          <GameStateProvider>
            {/* Main application container with background gradient */}
            <div className="min-h-screen bg-primary text-white">
              <NavBar onCreatePet={() => setShowCreatePet(true)} />
              
              {/* Main content area */}
              <main className="container mx-auto px-4 py-8">
                <Routes>
                  <Route 
                    path="/" 
                    element={<Landing onCreatePet={() => setShowCreatePet(true)} />} 
                  />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/garden" element={<Garden />} />
                  <Route path="/reflect" element={<Reflection />} />
                  <Route path="/inventory" element={<Inventory />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/settings" element={<Settings />} />
                  
                  {/* Fallback route for 404 pages */}
                  <Route 
                    path="*" 
                    element={
                      <div className="text-center py-16">
                        <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
                        <p className="text-gray-400 mb-8">
                          The page you're looking for doesn't exist.
                        </p>
                        <a href="/" className="btn-primary">
                          Return Home
                        </a>
                      </div>
                    } 
                  />
                </Routes>
              </main>

              {/* Create Pet Modal - shown when user needs to create their first pet */}
              <CreatePetModal
                isOpen={showCreatePet}
                onClose={() => setShowCreatePet(false)}
                onCreate={(petData) => {
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