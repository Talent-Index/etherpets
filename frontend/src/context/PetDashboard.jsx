import React from 'react';
import { useUser } from '../../context/UserContext';
import { motion } from 'framer-motion';
import { Heart, Zap, Utensils, Bed, Gamepad2, Loader, Smile, Meh, Frown } from 'lucide-react';

// A simple progress bar component for stats
const StatBar = ({ label, value, icon, color }) => (
  <div className="w-full">
    <div className="flex justify-between items-center mb-1">
      <div className="flex items-center text-sm font-medium text-gray-300">
        {icon}
        <span className="ml-2">{label}</span>
      </div>
      <span className="text-sm font-bold text-white">{value}%</span>
    </div>
    <div className="w-full bg-white/10 rounded-full h-2.5">
      <motion.div
        className={`h-2.5 rounded-full ${color}`}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
    </div>
  </div>
);

const PetDashboard = () => {
  const { currentPet, performPetAction, isLoading } = useUser();

  if (isLoading && !currentPet) {
    return <div className="flex justify-center items-center h-full"><Loader className="animate-spin text-accent-cyan" size={48} /></div>;
  }

  if (!currentPet) {
    return (
      <div className="text-center p-8 glass-morphism rounded-xl">
        <h3 className="text-xl font-semibold text-white">No Companion Selected</h3>
        <p className="text-gray-400 mt-2">Please select or create a pet to see its dashboard.</p>
      </div>
    );
  }

  const getMoodIcon = (mood) => {
    switch (mood) {
      case 'happy': return <Smile className="text-green-400" />;
      case 'excited': return <Smile className="text-yellow-400" />;
      case 'sad': return <Frown className="text-blue-400" />;
      case 'tired': return <Meh className="text-gray-400" />;
      default: return <Meh className="text-gray-400" />;
    }
  };

  const handleAction = (actionType) => {
    if (currentPet) {
      performPetAction(currentPet.id, actionType);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-morphism p-6 rounded-2xl"
    >
      {/* Pet Header */}
      <div className="flex items-center mb-6">
        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mr-4">
          {getMoodIcon(currentPet.mood)}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">{currentPet.name}</h2>
          <p className="text-gray-300">Lvl {currentPet.level} {currentPet.species}</p>
        </div>
      </div>

      {/* Pet Stats */}
      <div className="space-y-4 mb-6">
        <StatBar label="Happiness" value={currentPet.happiness} icon={<Heart size={16} />} color="bg-pink-500" />
        <StatBar label="Energy" value={currentPet.energy} icon={<Zap size={16} />} color="bg-yellow-500" />
        <StatBar label="Hunger" value={currentPet.hunger} icon={<Utensils size={16} />} color="bg-orange-500" />
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => handleAction('feed')}
          className="action-button bg-green-500/20 hover:bg-green-500/40 text-green-300"
        >
          <Utensils size={20} />
          <span>Feed</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => handleAction('play')}
          className="action-button bg-blue-500/20 hover:bg-blue-500/40 text-blue-300"
        >
          <Gamepad2 size={20} />
          <span>Play</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => handleAction('rest')}
          className="action-button bg-purple-500/20 hover:bg-purple-500/40 text-purple-300"
        >
          <Bed size={20} />
          <span>Rest</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default PetDashboard;