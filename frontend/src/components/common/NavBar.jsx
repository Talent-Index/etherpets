import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useWallet } from '../../context/WalletContext'
import { useUser } from '../../context/UserContext'
import { 
  Home, 
  LayoutDashboard, 
  Sprout, 
  Notebook, 
  Package, 
  User,
  Wallet,
  LogOut,
  Menu,
  X
} from 'lucide-react'

const NavBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { account, isConnected, connectWallet, disconnectWallet } = useWallet()
  const { currentPet } = useUser()
  const location = useLocation()

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Garden', href: '/garden', icon: Sprout },
    { name: 'Reflect', href: '/reflect', icon: Notebook },
    { name: 'Inventory', href: '/inventory', icon: Package },
    { name: 'Profile', href: '/profile', icon: User },
  ]

  const shortenedAddress = account ? `${account.slice(0, 6)}...${account.slice(-4)}` : ''

  return (
    <nav className="glass-morphism border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-accent-cyan to-accent-teal rounded-full flex items-center justify-center">
              <Sprout className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xl font-bold text-accent-mint">EtherPets</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                    isActive
                      ? 'bg-accent-teal/20 text-accent-teal border border-accent-teal/30'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              )
            })}
          </div>

          {/* Wallet & User Info */}
          <div className="hidden md:flex items-center space-x-4">
            {currentPet && (
              <div className="flex items-center space-x-3 bg-white/5 rounded-xl px-4 py-2">
                <div className="w-8 h-8 bg-gradient-to-br from-accent-cyan to-accent-teal rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">EP</span>
                </div>
                <div className="text-sm">
                  <div className="font-medium">{currentPet.name}</div>
                  <div className="text-gray-400 text-xs">Level {currentPet.level}</div>
                </div>
              </div>
            )}

            {isConnected ? (
              <div className="flex items-center space-x-3">
                <div className="bg-accent-teal/20 text-accent-teal border border-accent-teal/30 rounded-xl px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <Wallet className="w-4 h-4" />
                    <span className="text-sm font-medium">{shortenedAddress}</span>
                  </div>
                </div>
                <button
                  onClick={disconnectWallet}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className="btn-primary flex items-center space-x-2"
              >
                <Wallet className="w-4 h-4" />
                <span>Connect Wallet</span>
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t border-white/10"
          >
            <div className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.href
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? 'bg-accent-teal/20 text-accent-teal border border-accent-teal/30'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                )
              })}

              {/* Mobile Wallet Info */}
              <div className="pt-4 border-t border-white/10">
                {isConnected ? (
                  <div className="space-y-3">
                    {currentPet && (
                      <div className="flex items-center space-x-3 bg-white/5 rounded-xl px-4 py-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-accent-cyan to-accent-teal rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-primary">EP</span>
                        </div>
                        <div>
                          <div className="font-medium">{currentPet.name}</div>
                          <div className="text-gray-400 text-sm">Level {currentPet.level}</div>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm">
                        <Wallet className="w-4 h-4" />
                        <span>{shortenedAddress}</span>
                      </div>
                      <button
                        onClick={disconnectWallet}
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                      >
                        <LogOut className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={connectWallet}
                    className="w-full btn-primary flex items-center justify-center space-x-2"
                  >
                    <Wallet className="w-4 h-4" />
                    <span>Connect Wallet</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  )
}

export default NavBar