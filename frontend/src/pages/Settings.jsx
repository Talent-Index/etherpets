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
  
  // Mock theme context for demonstration
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    // In a real app, you'd also update the class on the <html> element
  };

  // Settings state
  const [settings, setSettings] = useState({
    sound: JSON.parse(localStorage.getItem('settings-sound') || 'true'),
    notifications: JSON.parse(localStorage.getItem('settings-notifications') || 'true'),
    reduceMotion: JSON.parse(localStorage.getItem('settings-reduceMotion') || 'false')
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
    
    // Save to localStorage
    localStorage.setItem(`settings-${key}`, JSON.stringify(value))
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
          label: 'Theme',
          description: 'Switch between light, dark, and auto modes',
          icon: <Moon className="w-5 h-5" />,
          type: 'select'
        },
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
    <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
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
              {section.settings.map((setting) => (
                <div key={setting.key} className="p-6 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-accent-teal">{setting.icon}</div>
                    <div>
                      <div className="font-semibold">{setting.label}</div>
                      <div className="text-sm text-gray-400 mt-1">{setting.description}</div>
                    </div>
                  </div>
                  
                  {setting.type === 'toggle' && (
                    <label htmlFor={setting.key} className="relative inline-flex items-center cursor-pointer">
                      <input id={setting.key} type="checkbox" checked={settings[setting.key]} onChange={(e) => handleSettingChange(setting.key, e.target.checked)} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-teal"></div>
                    </label>
                  )}

                  {setting.type === 'select' && (
                    <select value={theme} onChange={(e) => handleThemeChange(e.target.value)} className="form-input bg-white/10">
                      <option value="dark">Dark</option>
                      <option value="light">Light</option>
                      <option value="auto">Auto</option>
                    </select>
                  )}

                  {setting.type === 'action' && (
                    <button onClick={setting.action} className={`btn ${setting.destructive ? 'btn-danger' : 'btn-secondary'}`}>
                      {setting.actionLabel}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default Settings