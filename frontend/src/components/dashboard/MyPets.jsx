import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import PetCard from '../pets/PetCard';

/**
 * MyPets Component
 * Displays a horizontal scrollable list of user's pets
 */
const MyPets = ({ onSelectPet, onAddNew }) => {
  const { pets, currentPet } = useUser();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">My Companions</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAddNew}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span>Create New Pet</span>
        </motion.button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {pets && pets.length > 0 ? (
          pets.map((pet) => (
            <motion.div
              key={pet._id || pet.id}
              whileHover={{ y: -4 }}
              className="flex-shrink-0"
            >
              <PetCard
                pet={pet}
                isSelected={currentPet && (currentPet._id === pet._id || currentPet.id === pet.id)}
                onClick={() => onSelectPet(pet)}
              />
            </motion.div>
          ))
        ) : (
          <div className="glass-morphism p-8 rounded-xl text-center w-full">
            <p className="text-gray-400">You haven't created any companions yet.</p>
            <p className="text-gray-500 text-sm mt-2">Click "Create New Pet" to begin your journey!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPets;
