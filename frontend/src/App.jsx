import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useUser } from './context/UserContext'
// Context providers
import { UserProvider, useUser } from './context/UserContext'
import { WalletProvider } from './context/WalletContext'
import { GameStateProvider } from './context/GameStateContext'
import { ThemeProvider } from './context/ThemeContext'
import NotificationProvider from './context/NotificationContext'

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
  const { user, createPet } = useUser()

  return (
    <Router>
      <NotificationProvider>
        <WalletProvider>
          <GameStateProvider>
            <UserProvider>
              <ThemeProvider>
                <ErrorBoundary>
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
                </ErrorBoundary>
              </ThemeProvider>
            </UserProvider>
          </GameStateProvider>
        </WalletProvider>
      </NotificationProvider>
    </Router>
  )
}

export default App