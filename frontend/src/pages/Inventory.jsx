import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useUser } from '../context/UserContext'
import { Package, Zap, Star, Gift, ShoppingBag, Coins } from 'lucide-react'

const Inventory = () => {
  const { currentPet } = useUser()
  const [activeTab, setActiveTab] = useState('items')
  
  const inventoryItems = [
    {
      id: 1,
      name: 'Energy Crystal',
      description: 'Restores 25 energy to your pet',
      type: 'consumable',
      rarity: 'common',
      quantity: 3,
      icon: '💎',
      color: 'from-blue-400 to-cyan-400'
    },
    {
      id: 2,
      name: 'Harmony Bloom',
      description: 'Increases happiness for 1 hour',
      type: 'consumable',
      rarity: 'uncommon',
      quantity: 1,
      icon: '🌸',
      color: 'from-pink-400 to-rose-400'
    },
    {
      id: 3,
      name: 'Starlight Fragment',
      description: 'Rare material for crafting',
      type: 'material',
      rarity: 'rare',
      quantity: 5,
      icon: '✨',
      color: 'from-yellow-400 to-orange-400'
    },
    {
      id: 4,
      name: 'Ancient Token',
      description: 'Mysterious artifact with unknown powers',
      type: 'artifact',
      rarity: 'legendary',
      quantity: 1,
      icon: '🏺',
      color: 'from-purple-400 to-indigo-400'
    }
  ]

  const marketplaceItems = [
    {
      id: 101,
      name: 'Energy Pack',
      description: '5 Energy Crystals',
      price: 100,
      currency: 'HMY',
      icon: '💎',
      color: 'from-green-400 to-emerald-400'
    },
    {
      id: 102,
      name: 'Cosmic Outfit',
      description: 'Rare cosmetic for your pet',
      price: 500,
      currency: 'HMY',
      icon: '👗',
      color: 'from-purple-400 to-pink-400'
    },
    {
      id: 103,
      name: 'Garden Boost',
      description: '2x garden energy for 24 hours',
      price: 250,
      currency: 'HMY',
      icon: '🚀',
      color: 'from-orange-400 to-red-400'
    }
  ]

  const getRarityColor = (rarity) => {
    const colors = {
      common: 'text-gray-400',
      uncommon: 'text-green-400',
      rare: 'text-blue-400',
      epic: 'text-purple-400',
      legendary: 'text-yellow-400'
    }
    return colors[rarity] || colors.common
  }

  const getRarityBg = (rarity) => {
    const colors = {
      common: 'bg-gray-400/20',
      uncommon: 'bg-green-400/20',
      rare: 'bg-blue-400/20',
      epic: 'bg-purple-400/20',
      legendary: 'bg-yellow-400/20'
    }
    return colors[rarity] || colors.common
  }

  if (!currentPet) {
    return (
      <div className="text-center py-16">
        <h2 className="text-3xl font-bold mb-4">No Pet Found</h2>
        <p className="text-gray-400 mb-8">Create your SoulPet to access inventory</p>
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
        <h1 className="text-4xl font-bold mb-2">Inventory & Marketplace</h1>
        <p className="text-gray-400">
          Manage your items and discover new treasures
        </p>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
      >
        <div className="glass-morphism p-6 rounded-xl text-center">
          <Package className="w-8 h-8 text-accent-cyan mx-auto mb-2" />
          <div className="text-2xl font-bold">{inventoryItems.length}</div>
          <div className="text-gray-400">Total Items</div>
        </div>
        <div className="glass-morphism p-6 rounded-xl text-center">
          <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
          <div className="text-2xl font-bold">7</div>
          <div className="text-gray-400">Energy Items</div>
        </div>
        <div className="glass-morphism p-6 rounded-xl text-center">
          <Star className="w-8 h-8 text-accent-lavender mx-auto mb-2" />
          <div className="text-2xl font-bold">2</div>
          <div className="text-gray-400">Rare Items</div>
        </div>
        <div className="glass-morphism p-6 rounded-xl text-center">
          <Coins className="w-8 h-8 text-accent-mint mx-auto mb-2" />
          <div className="text-2xl font-bold">1,250</div>
          <div className="text-gray-400">HMY Tokens</div>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-morphism p-2 rounded-xl mb-6"
      >
        <div className="flex space-x-2">
          {[
            { id: 'items', label: 'My Inventory', icon: Package },
            { id: 'market', label: 'Marketplace', icon: ShoppingBag }
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-300 flex-1 justify-center ${
                  activeTab === tab.id
                    ? 'bg-accent-teal text-primary'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </motion.div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'items' ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {inventoryItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="glass-morphism rounded-xl overflow-hidden group hover:transform hover:scale-105 transition-all duration-300"
              >
                {/* Item Header */}
                <div className={`h-24 bg-gradient-to-br ${item.color} flex items-center justify-center relative`}>
                  <span className="text-4xl">{item.icon}</span>
                  <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-semibold ${getRarityBg(item.rarity)} ${getRarityColor(item.rarity)}`}>
                    {item.rarity}
                  </div>
                  {item.quantity > 1 && (
                    <div className="absolute top-3 left-3 bg-primary/90 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                      {item.quantity}
                    </div>
                  )}
                </div>

                {/* Item Info */}
                <div className="p-4">
                  <h3 className="font-semibold mb-1">{item.name}</h3>
                  <p className="text-sm text-gray-400 mb-3">{item.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 capitalize">{item.type}</span>
                    <button className="bg-accent-teal hover:bg-accent-mint text-primary text-xs font-semibold px-3 py-1 rounded-lg transition-colors">
                      Use
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {marketplaceItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-morphism rounded-xl overflow-hidden group hover:transform hover:scale-105 transition-all duration-300"
              >
                {/* Item Header */}
                <div className={`h-32 bg-gradient-to-br ${item.color} flex items-center justify-center relative`}>
                  <span className="text-5xl">{item.icon}</span>
                  <div className="absolute top-4 right-4 bg-primary/90 text-white text-sm font-bold rounded-full w-12 h-12 flex items-center justify-center">
                    {item.price}
                  </div>
                </div>

                {/* Item Info */}
                <div className="p-4">
                  <h3 className="font-semibold mb-1">{item.name}</h3>
                  <p className="text-sm text-gray-400 mb-4">{item.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-accent-mint">
                      <Coins className="w-4 h-4" />
                      <span className="text-sm font-semibold">{item.price} {item.currency}</span>
                    </div>
                    <button className="bg-accent-teal hover:bg-accent-mint text-primary text-sm font-semibold px-4 py-2 rounded-lg transition-colors flex items-center space-x-2">
                      <ShoppingBag className="w-4 h-4" />
                      <span>Buy</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Empty State */}
      {activeTab === 'items' && inventoryItems.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Items Yet</h3>
          <p className="text-gray-400 mb-6">Start playing to earn items and rewards!</p>
          <button className="btn-primary">Start Exploring</button>
        </motion.div>
      )}
    </div>
  )
}

export default Inventory