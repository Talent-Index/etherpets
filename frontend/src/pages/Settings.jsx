/**
 * Settings page for user preferences and application configuration
 * Includes sound, notifications, theme, and account settings
 */
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Settings as SettingsIcon, 
  Bell, 
  Volume2, 
  Moon, 
  Shield,
  Trash2,
  Download,
  User
} from 'lucide-react'
import { useUser } from '../context/UserContext'
import { useWallet } from '../context/WalletContext'

const Settings = () => {
  const { user, currentPet } = useUser()
  const { account, disconnectWallet } = useWallet()
  
  // Settings state
  const [settings, setSettings] = useState({
    sound: true,
    notifications: true,
    darkMode: true,
    autoSave: true,
    reduceMotion: false
  })

  /**
   * Handle setting change
   * @param {string} key - Setting key to update
   * @param {any} value - New value for the setting
   */
  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
    
    // In a real app, you would save to localStorage or backend here
    console.log(`Setting ${key} changed to:`, value)
  }

  /**
   * Export user data
   */
  const exportData = () => {
    const data = {
      user,
      currentPet,
      settings,
      exportDate: new Date().toISOString()
    }
    
    const dataStr = JSON.stringify(data, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    
    const link = document.createElement('a')
    link.href = URL.createObjectURL(dataBlob)
    link.download = `etherpets-backup-${new Date().getTime()}.json`
    link.click()
  }

  /**
   * Clear all user data
   */
  const clearData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      localStorage.clear()
      window.location.reload()
    }
  }

  /**
   * Disconnect wallet and clear blockchain data
   */
  const handleDisconnect = () => {
    disconnectWallet()
    // Additional cleanup for blockchain data if needed
  }

  const settingSections = [
    {
      title: 'Preferences',
      icon: <SettingsIcon className="w-5 h-5" />,
      settings: [
        {
          key: 'sound',
          label: 'Sound Effects',
          description: 'Enable sound effects and background music',
          icon: <Volume2 className="w-5 h-5" />,
          type: 'toggle'
        },
        {
          key: 'notifications',
          label: 'Notifications',
          description: 'Receive garden updates and pet reminders',
          icon: <Bell className="w-5 h-5" />,
          type: 'toggle'
        },
        {
          key: 'darkMode',
          label: 'Dark Mode',
          description: 'Use dark theme throughout the application',
          icon: <Moon className="w-5 h-5" />,
          type: 'toggle'
        },
        {
          key: 'reduceMotion',
          label: 'Reduce Motion',
          description: 'Minimize animations for accessibility',
          icon: <Moon className="w-5 h-5" />,
          type: 'toggle'
        }
      ]
    },
    {
      title: 'Account',
      icon: <User className="w-5 h-5" />,
      settings: [
        {
          key: 'wallet',
          label: 'Connected Wallet',
          description: account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Not connected',
          icon: <Shield className="w-5 h-5" />,
          type: 'action',
          action: handleDisconnect,
          actionLabel: 'Disconnect'
        }
      ]
    },
    {
      title: 'Data',
      icon: <Download className="w-5 h-5" />,
      settings: [
        {
          key: 'export',
          label: 'Export Data',
          description: 'Download a backup of your pets and progress',
          icon: <Download className="w-5 h-5" />,
          type: 'action',
          action: exportData,
          actionLabel: 'Export'
        },
        {
          key: 'clear',
          label: 'Clear All Data',
          description: 'Reset the application and remove all local data',
          icon: <Trash2 className="w-5 h-5" />,
          type: 'action',
          action: clearData,
          actionLabel: 'Clear',
          destructive: true
        }
      ]
    }
  ]

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold mb-2">Settings</h1>
        <p className="text-gray-400">
          Manage your preferences and application settings
        </p>
      </motion.div>

      <div className="space-y-8">
        {settingSections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sectionIndex * 0.1 }}
            className="glass-morphism rounded-xl overflow-hidden"
          >
            {/* Section Header */}
            <div className="bg-white/5 p-6 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <div className="text-accent-cyan">
                  {section.icon}
                </div>
                <h2 className="text-xl font-semibold">{section.title}</h2>
              </div>
            </div>

            {/* Settings List */}
            <div className="divide-y divide-white/5">
              {section.settings.map((setting, index) => (
                <div key={setting.key} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="text-accent-teal">
                        {setting.icon}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold">{setting.label}</div>
                        <div className="text-sm text-gray-400 mt-1">
                          {setting.description}
                        </div>
                      </div>
                    </div>

                    {/* Toggle Setting */}
                    {setting.type === 'toggle' && (
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings[setting.key]}
                          onChange={(e) => handleSettingChange(setting.key, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-teal"></div>
                      </label>
                    )}

                    {/* Action Setting */}
                    {setting.type === 'action' && (
                      <button
                        onClick={setting.action}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                          setting.destructive
                            ? 'bg-red-500 hover:bg-red-600 text-white'
                            : 'bg-accent-teal hover:bg-accent-mint text-primary'
                        }`}
                      >
                        {setting.actionLabel}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* App Information */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="glass-morphism p-6 rounded-xl text-center mt-8"
      >
        <div className="text-sm text-gray-400 space-y-2">
          <div>EtherPets v1.0.0</div>
          <div>Built with ❤️ for mental wellness and mindfulness</div>
          <div className="text-xs mt-4">
            Your data is stored locally in your browser. 
            Export regularly to prevent data loss.
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Settings