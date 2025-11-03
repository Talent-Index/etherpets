import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GameStateProvider } from './context/GameStateContext';
import { UserProvider } from './context/UserContext';
import { WalletProvider } from './context/WalletContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import ErrorBoundary from './components/common/ErrorBoundary';

import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';
import CreatePet from './pages/CreatePet';
import Garden from './pages/Garden';
import Profile from './pages/Profile';
import Inventory from './pages/Inventory';
import Reflection from './pages/Reflection';
import Settings from './pages/Settings';
import Tutorial from './pages/Tutorial';
import NotFound from './pages/NotFound';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <WalletProvider>
          <UserProvider>
            <GameStateProvider>
              <NotificationProvider>
                <Router>
                  <div className="min-h-screen bg-primary text-white flex">
                    <Sidebar />
                    <div className="flex-1 flex flex-col">
                      <Header />
                      <main className="flex-1 overflow-y-auto p-6">
                        <Routes>
                          <Route path="/" element={<Landing />} />
                          <Route path="/dashboard" element={<Dashboard />} />
                          <Route path="/create-pet" element={<CreatePet />} />
                          <Route path="/garden" element={<Garden />} />
                          <Route path="/profile" element={<Profile />} />
                          <Route path="/inventory" element={<Inventory />} />
                          <Route path="/reflection" element={<Reflection />} />
                          <Route path="/settings" element={<Settings />} />
                          <Route path="/tutorial" element={<Tutorial />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </main>
                    </div>
                  </div>
                </Router>
              </NotificationProvider>
            </GameStateProvider>
          </UserProvider>
        </WalletProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;