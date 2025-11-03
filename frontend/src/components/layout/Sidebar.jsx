import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  PlusCircle, 
  Users, 
  Package, 
  Heart, 
  BookOpen,
  Sparkles,
  Settings
} from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Sidebar Component
 * Main navigation sidebar with links to all major sections
 */
const Sidebar = () => {
  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/create-pet', icon: PlusCircle, label: 'Create Pet' },
    { path: '/garden', icon: Users, label: 'Garden' },
    { path: '/inventory', icon: Package, label: 'Inventory' },
    { path: '/reflection', icon: Heart, label: 'Reflection' },
    { path: '/tutorial', icon: BookOpen, label: 'Tutorial' },
    { path: '/profile', icon: Sparkles, label: 'Profile' },
  ];

  return (
    <aside className="w-64 bg-primary-50 border-r border-white/10 flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-accent-teal to-accent-mint rounded-lg flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">EtherPets</h2>
            <p className="text-xs text-gray-400">Wellness Game</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item, index) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-accent-teal text-primary font-semibold'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <motion.div
                className="flex items-center gap-3 w-full"
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-primary' : ''}`} />
                <span>{item.label}</span>
              </motion.div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Section - Settings */}
      <div className="p-4 border-t border-white/10">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              isActive
                ? 'bg-accent-teal text-primary font-semibold'
                : 'text-gray-300 hover:bg-white/5 hover:text-white'
            }`
          }
        >
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
