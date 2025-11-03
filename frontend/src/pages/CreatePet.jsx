import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Loader } from 'lucide-react';

const CreatePet = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { createPet, isLoading } = useUser();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState(null);

  const onSubmit = async (data) => {
    setApiError(null);
    try {
      await createPet({
        name: data.name,
        species: data.species,
        // Add other initial traits if needed
      });
      navigate('/'); // Redirect to dashboard after creation
    } catch (error) {
      setApiError(error.message || 'An unexpected error occurred. Please try again.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto p-4 md:p-6 lg:p-8"
    >
      <div className="glass-morphism p-8 rounded-2xl">
        <div className="text-center mb-8">
          <Sparkles className="mx-auto text-accent-cyan h-12 w-12 mb-4" />
          <h1 className="text-3xl font-bold text-white">Create Your Companion</h1>
          <p className="text-gray-300 mt-2">Bring a new SoulPet into the world. Give it a name and choose its form.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Pet's Name</label>
            <input
              id="name"
              type="text"
              {...register('name', { required: 'A name is required', maxLength: 20 })}
              className="form-input"
              placeholder="e.g., Luna, Sparky"
            />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="species" className="block text-sm font-medium text-gray-300 mb-2">Species</label>
            <select id="species" {...register('species', { required: 'Please select a species' })} className="form-input">
              <option value="">Choose a species...</option>
              <option value="AuraSprite">AuraSprite (Spirit)</option>
              <option value="GlimmerFox">GlimmerFox (Animal)</option>
              <option value="TerraGolem">TerraGolem (Elemental)</option>
              <option value="ChronoWing">ChronoWing (Mystical)</option>
            </select>
            {errors.species && <p className="text-red-400 text-xs mt-1">{errors.species.message}</p>}
          </div>

          {apiError && <p className="text-red-400 text-center">{apiError}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center bg-accent-teal hover:bg-accent-mint text-primary font-bold py-3 px-4 rounded-xl transition-all duration-300 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader className="animate-spin mr-2" size={20} />
                Creating...
              </>
            ) : 'Mint Your Companion'}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default CreatePet;