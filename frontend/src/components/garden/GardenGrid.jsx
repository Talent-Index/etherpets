import React, { useState } from 'react'
import { motion } from 'framer-motion'
import EnergyNode from './EnergyNode'
import { Sparkles, Users, Lock } from 'lucide-react'

const GardenGrid = () => {
  const [nodes, setNodes] = useState([
    { id: 1, type: 'puzzle', energy: 3, solved: true, position: [0, 0] },
    { id: 2, type: 'reflection', energy: 2, solved: false, position: [1, 0] },
    { id: 3, type: 'social', energy: 4, solved: false, position: [2, 0] },
    { id: 4, type: 'puzzle', energy: 3, solved: false, position: [0, 1] },
    { id: 5, type: 'meditation', energy: 2, solved: false, position: [1, 1] },
    { id: 6, type: 'puzzle', energy: 5, solved: false, position: [2, 1] },
    { id: 7, type: 'social', energy: 3, solved: false, position: [0, 2] },
    { id: 8, type: 'reflection', energy: 2, solved: false, position: [1, 2] },
    { id: 9, type: 'meditation', energy: 4, solved: false, position: [2, 2] },
  ])

  const handleNodeClick = (nodeId) => {
    const node = nodes.find(n => n.id === nodeId)
    if (!node.solved) {
      // In a real app, this would open a modal with the puzzle/activity
      console.log('Opening node:', nodeId)
    }
  }

  return (
    <div className="space-y-6">
      {/* Garden Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Harmony Garden</h2>
          <p className="text-gray-400">Work together to solve puzzles and grow energy</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-accent-cyan">
            <Sparkles className="w-5 h-5" />
            <span className="font-semibold">24/100 Energy</span>
          </div>
          <div className="flex items-center space-x-2 text-accent-lavender">
            <Users className="w-5 h-5" />
            <span className="font-semibold">5/12 Active</span>
          </div>
        </div>
      </div>

      {/* Garden Grid */}
      <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
        <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
          {nodes.map((node, index) => (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <EnergyNode
                node={node}
                onClick={() => handleNodeClick(node.id)}
              />
            </motion.div>
          ))}
        </div>

        {/* Progress */}
        <div className="mt-8 max-w-2xl mx-auto">
          <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
            <span>Garden Progress</span>
            <span>1/9 Completed</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '11%' }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-3 bg-gradient-to-r from-accent-cyan to-accent-mint rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="glass-morphism p-6 rounded-xl"
      >
        <h3 className="text-lg font-semibold mb-3">How to Play</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-accent-cyan/20 rounded-full flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-accent-cyan" />
            </div>
            <div>
              <div className="font-medium">Solve Puzzles</div>
              <div className="text-gray-400">Complete challenges to earn energy</div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-accent-teal/20 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-accent-teal" />
            </div>
            <div>
              <div className="font-medium">Collaborate</div>
              <div className="text-gray-400">Work with others for bigger rewards</div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-accent-mint/20 rounded-full flex items-center justify-center">
              <Lock className="w-4 h-4 text-accent-mint" />
            </div>
            <div>
              <div className="font-medium">Unlock Areas</div>
              <div className="text-gray-400">Progress opens new garden sections</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default GardenGrid