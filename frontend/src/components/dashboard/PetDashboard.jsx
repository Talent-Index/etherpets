import React from 'react';
import { useUser } from '../../context/UserContext';
import { motion } from 'framer-motion';
import { Heart, Zap, Star, Utensils, ToyBrick, Bed, Brain } from 'lucide-react';
import MoodIndicator from '../pets/MoodIndicator';
import EnergyBar from '../common/EnergyBar';

/**
 * Pet Dashboard Component
 * Main interaction panel for the current pet with vital stats and action buttons
 */
const StatBar = ({ label, value, color, icon }) => (
  <div>
    <div className="flex justify-between items-center mb-1">
      <div className="flex items-center space-x-2">
        {icon}
        <span className="text-sm font-medium text-gray-300">{label}</span>
      </div>
      <span className="text-sm font-semibold text-white">{value}%</span>
    </div>
    <div className="w-full bg-white/10 rounded-full h-2.5">
      <motion.div
        className={`h-2.5 rounded-full ${color}`}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.8 }}
      />
    </div>
  </div>
);

const PetDashboard = () => {
  const { currentPet, performPetAction } = useUser();

  if (!currentPet) {
    return (
      <div className="glass-morphism p-6 rounded-xl text-center">
        <p className="text-gray-400">Select a pet to view its dashboard.</p>
      </div>
    );
  }

  const actions = [
    { 
      id: 'feed', 
      label: 'Feed', 
      icon: <Utensils className="w-5 h-5" />, 
      color: 'bg-green-500/20 hover:bg-green-500/30 border border-green-500/30' 
    },
    { 
      id: 'play', 
      label: 'Play', 
      icon: <ToyBrick className="w-5 h-5" />, 
      color: 'bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/30' 
    },
    { 
      id: 'rest', 
      label: 'Rest', 
      icon: <Bed className="w-5 h-5" />, 
      color: 'bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30' 
    },
    { 
      id: 'meditate', 
      label: 'Meditate', 
      icon: <Brain className="w-5 h-5" />, 
      color: 'bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30' 
    },
  ];

  const handleAction = (actionType) => {
    if (performPetAction) {
      performPetAction(currentPet._id || currentPet.id, actionType);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-morphism p-6 rounded-xl space-y-6"
    >
      {/* Pet Info Header */}
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-gradient-to-br from-accent-cyan to-accent-teal rounded-full flex items-center justify-center text-3xl relative">
          <span>{currentPet.avatar || '🐾'}</span>
          {currentPet.mood && (
            <div className="absolute -bottom-1 -right-1">
              <MoodIndicator mood={currentPet.mood} size="sm" />
            </div>
          )}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">{currentPet.name}</h2>
          <p className="text-gray-300">
            Level {currentPet.level || 1} {currentPet.species || 'Guardian'}
          </p>
        </div>
      </div>

      {/* Pet Stats */}
      <div className="space-y-4">
        <StatBar
          label="Energy"
          value={currentPet.energy || 80}
          color="bg-yellow-400"
          icon={<Zap className="w-4 h-4 text-yellow-400" />}
        />
        <StatBar
          label="Happiness"
          value={currentPet.happiness || 90}
          color="bg-pink-400"
          icon={<Heart className="w-4 h-4 text-pink-400" />}
        />
        <StatBar
          label="Experience"
          value={currentPet.experience || 45}
          color="bg-accent-mint"
          icon={<Star className="w-4 h-4 text-accent-mint" />}
        />
      </div>

      {/* Action Buttons */}
      <div>
        <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => (
            <motion.button
              key={action.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAction(action.id)}
              className={`p-3 rounded-lg flex items-center justify-center space-x-2 transition-colors ${action.color}`}
            >
              {action.icon}
              <span className="font-semibold text-sm text-white">{action.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default PetDashboard;
