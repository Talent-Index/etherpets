import React, { useState, useEffect } from 'react';
import { useWallet } from '../../context/WalletContext';
import apiClient from '../../utils/api';
import { motion } from 'framer-motion';
import { PlusCircle, Loader, AlertTriangle } from 'lucide-react';

const PetCard = ({ pet, onSelect }) => {
  const getMoodEmoji = (mood) => {
    const emojis = {
      happy: '😊',
      calm: '😌',
      excited: '🤩',
      sad: '😢',
      hungry: '🍔',
      tired: '😴',
    };
    return emojis[mood] || '😐';
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="glass-morphism p-4 rounded-xl cursor-pointer flex flex-col items-center text-center"
      onClick={() => onSelect(pet)}
    >
      <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-3" style={{ backgroundColor: pet.traits?.color || '#4ECDC4' }}>
        {getMoodEmoji(pet.mood)}
      </div>
      <h4 className="font-semibold text-white">{pet.name}</h4>
      <p className="text-xs text-gray-300">Lvl {pet.level} {pet.species}</p>
    </motion.div>
  );
};

const MyPets = ({ onSelectPet, onAddNew }) => {
  const { account, isConnected } = useWallet();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPets = async () => {
      if (!isConnected || !account) {
        setLoading(false);
        setPets([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        // The backend has a GET /api/pets/owner/:owner endpoint
        const response = await apiClient.get(`/pets/owner/${account}`);
        // The backend now returns an array of pets.
        setPets(response.data.data || []);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          // It's not an error if the user has no pets yet.
          setPets([]);
        } else {
          setError('Failed to fetch your pets. Please try again.');
          console.error('Error fetching pets:', err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, [account, isConnected]);

  if (loading) {
    return <div className="flex justify-center items-center h-40"><Loader className="animate-spin text-accent-cyan" /></div>;
  }

  if (error) {
    return <div className="flex flex-col items-center text-center text-red-400 h-40 justify-center"><AlertTriangle className="mb-2" /> <p>{error}</p></div>;
  }

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold text-white mb-4">My Companions</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {pets.map((pet) => (
          <PetCard key={pet._id} pet={pet} onSelect={onSelectPet} />
        ))}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="border-2 border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:text-white hover:border-accent-cyan transition-colors cursor-pointer min-h-[150px]"
          onClick={onAddNew}
        >
          <PlusCircle className="w-8 h-8 mb-2" />
          <span className="text-sm font-semibold">Add New Pet</span>
        </motion.div>
      </div>
    </div>
  );
};

export default MyPets;