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

function App() {
  const [showCreatePet, setShowCreatePet] = useState(false)

  return (
    <Router>
      <WalletProvider>
        <GameStateProvider>
          <UserProvider>
            <ThemeProvider>
              <ErrorBoundary>
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
                      <Route path="/tutorial" element={<Tutorial />} />
                      
                      {/* Fallback route for 404 pages */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>

                  {/* Create Pet Modal - shown when user needs to create their first pet */}
                  <CreatePetModal
                    isOpen={showCreatePet}
                    onClose={() => setShowCreatePet(false)}
                  />
                </div>
              </ErrorBoundary>
            </ThemeProvider>
          </UserProvider>
        </GameStateProvider>
      </WalletProvider>
    </Router>
  )
}

export default App