import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useUser } from '../context/UserContext'
import { useWallet } from '../context/WalletContext'
import { 
  User, 
  Calendar, 
  Award, 
  TrendingUp, 
  Settings,
  Edit3,
  Copy,
  ExternalLink
} from 'lucide-react'

const Profile = () => {
  const { currentPet, user } = useUser()
  const { account } = useWallet()
  const [activeTab, setActiveTab] = useState('overview')

  const stats = {
    streak: 7,
    totalPlayTime: '45h 23m',
    ritualsCompleted: 42,
    gardensJoined: 3,
    energyGenerated: 1250,
    tokensEarned: 1750
  }

  const achievements = [
    { id: 1, name: 'First Steps', description: 'Create your first SoulPet', earned: true, date: '2024-01-15' },
    { id: 2, name: 'Mindful Beginner', description: 'Complete 10 meditation sessions', earned: true, date: '2024-01-20' },
    { id: 3, name: 'Garden Guardian', description: 'Join your first garden', earned: true, date: '2024-01-22' },
    { id: 4, name: 'Energy Master', description: 'Generate 1000 energy points', earned: true, date: '2024-01-25' },
    { id: 5, name: 'Harmony Seeker', description: 'Maintain a 30-day streak', earned: false, date: null },
    { id: 6, name: 'Community Leader', description: 'Help 10 garden puzzles', earned: false, date: null }
  ]

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (!currentPet) {
    return (
      <div className="text-center py-16">
        <h2 className="text-3xl font-bold mb-4">No Pet Found</h2>
        <p className="text-gray-400 mb-8">Create your SoulPet to view your profile</p>
        <button className="btn-primary">Create SoulPet</button>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold mb-2">Your Profile</h1>
        <p className="text-gray-400">
          Track your journey and achievements
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-morphism p-6 rounded-xl text-center"
          >
            {/* Avatar */}
            <div className="w-24 h-24 bg-gradient-to-br from-accent-cyan to-accent-teal rounded-full mx-auto mb-4 flex items-center justify-center">
              <User className="w-12 h-12 text-primary" />
            </div>
            
            {/* User Info */}
            <h2 className="text-xl font-bold mb-1">SoulKeeper</h2>
            <p className="text-gray-400 text-sm mb-4">Mindful Adventurer</p>
            
            {/* Wallet */}
            <div className="bg-white/5 rounded-lg p-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Wallet</span>
                <div className="flex items-center space-x-2">
                  <span className="font-mono">
                    {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Not connected'}
                  </span>
                  <button
                    onClick={() => copyToClipboard(account)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Member Since */}
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>Member since Jan 2024</span>
            </div>
          </motion.div>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-morphism p-4 rounded-xl"
          >
            <nav className="space-y-2">
              {[
                { id: 'overview', label: 'Overview', icon: TrendingUp },
                { id: 'achievements', label: 'Achievements', icon: Award },
                { id: 'settings', label: 'Settings', icon: Settings }
              ].map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-300 ${
                      activeTab === item.id
                        ? 'bg-accent-teal/20 text-accent-teal border border-accent-teal/30'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                )
              })}
            </nav>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(stats).map(([key, value], index) => (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="glass-morphism p-4 rounded-xl text-center"
                    >
                      <div className="text-2xl font-bold text-accent-mint mb-1">
                        {value}
                      </div>
                      <div className="text-sm text-gray-400 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Current Pet */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="glass-morphism p-6 rounded-xl"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Your SoulPet</h3>
                    <button className="flex items-center space-x-2 text-sm text-accent-teal hover:text-accent-mint transition-colors">
                      <Edit3 className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-accent-cyan to-accent-teal rounded-full flex items-center justify-center">
                      <span className="text-xl">🐾</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">{currentPet.name}</h4>
                      <p className="text-gray-400">Level {currentPet.level} • {currentPet.type}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm">
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-accent-mint rounded-full"></div>
                          <span>Energy: {currentPet.energy}%</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                          <span>Happiness: {currentPet.happiness}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Recent Activity */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="glass-morphism p-6 rounded-xl"
                >
                  <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {[
                      { action: 'Completed morning meditation', time: '2 hours ago', energy: '+5' },
                      { action: 'Helped solve garden puzzle', time: '5 hours ago', energy: '+10' },
                      { action: 'Sent positive energy to Luna', time: '1 day ago', energy: '+3' },
                      { action: 'Reached level 5 with pet', time: '2 days ago', energy: '+15' }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                        <div>
                          <div className="font-medium">{activity.action}</div>
                          <div className="text-sm text-gray-400">{activity.time}</div>
                        </div>
                        <div className="text-accent-cyan font-semibold">
                          {activity.energy}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            )}

            {activeTab === 'achievements' && (
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-morphism p-6 rounded-xl"
                >
                  <h3 className="text-lg font-semibold mb-4">Your Achievements</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {achievements.map((achievement, index) => (
                      <motion.div
                        key={achievement.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                          achievement.earned
                            ? 'bg-accent-teal/20 border-accent-teal'
                            : 'bg-white/5 border-white/10 opacity-50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            achievement.earned
                              ? 'bg-accent-teal text-primary'
                              : 'bg-white/10 text-gray-400'
                          }`}>
                            <Award className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold">{achievement.name}</h4>
                            <p className="text-sm text-gray-400">{achievement.description}</p>
                            {achievement.earned && (
                              <div className="text-xs text-accent-mint mt-1">
                                Earned on {formatDate(achievement.date)}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-morphism p-6 rounded-xl"
                >
                  <h3 className="text-lg font-semibold mb-4">Preferences</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-white/5">
                      <div>
                        <div className="font-medium">Sound Effects</div>
                        <div className="text-sm text-gray-400">Enable game sounds</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-teal"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-white/5">
                      <div>
                        <div className="font-medium">Notifications</div>
                        <div className="text-sm text-gray-400">Receive garden updates</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-teal"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <div className="font-medium">Dark Mode</div>
                        <div className="text-sm text-gray-400">Use dark theme</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-teal"></div>
                      </label>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Profile