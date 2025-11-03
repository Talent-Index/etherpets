import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PetDashboard from '../components/dashboard/PetDashboard';
import AIPetCompanion from '../components/ar/AIPetCompanion';
import MyPets from '../components/dashboard/MyPets';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { currentPet, switchPet, updatePetMood } = useUser();
  const navigate = useNavigate();

  const handleSelectPet = (pet) => {
    switchPet(pet._id);
  };

  const handleAddNewPet = () => {
    navigate('/create-pet');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-4 md:p-6 lg:p-8 space-y-8"
    >
      <MyPets onSelectPet={handleSelectPet} onAddNew={handleAddNewPet} />

      {currentPet ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Pet Stats and Actions */}
          <div className="lg:col-span-1">
            <PetDashboard />
          </div>

          {/* Right Column: AI Chat Companion */}
          <div className="lg:col-span-2">
            <AIPetCompanion pet={currentPet} onMoodChange={(newMood) => updatePetMood(currentPet.id, newMood)} />
          </div>
        </div>
      ) : (
        <div className="text-center p-10 glass-morphism rounded-xl">
          <h2 className="text-2xl font-bold text-white">Welcome to EtherPets!</h2>
          <p className="text-gray-300 mt-2">Select a companion above or create a new one to begin your journey.</p>
        </div>
      )}
    </motion.div>
  );
};

export default Dashboard;