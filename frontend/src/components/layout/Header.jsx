import React from 'react';
import { useAccount } from 'wagmi';
import { Bell, Settings, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import NotificationBell from '../common/NotificationBell';

/**
 * Header Component
 * Top navigation bar with wallet info and notifications
 */
const Header = () => {
  const { address, isConnected } = useAccount();

  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <header className="bg-primary-50 border-b border-white/10 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Page title */}
        <div>
          <h1 className="text-2xl font-semibold text-white">EtherPets</h1>
          <p className="text-sm text-gray-400">Your Digital Wellness Companion</p>
        </div>

        {/* Right side - User actions */}
        <div className="flex items-center gap-4">
          {/* Notification Bell */}
          <NotificationBell />

          {/* Wallet Address */}
          {isConnected && (
            <div className="flex items-center gap-2 bg-accent-teal/20 px-4 py-2 rounded-lg border border-accent-teal/30">
              <div className="w-2 h-2 bg-accent-mint rounded-full animate-pulse" />
              <span className="text-sm font-medium text-accent-mint">
                {formatAddress(address)}
              </span>
            </div>
          )}

          {/* Settings Link */}
          <Link
            to="/settings"
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5 text-gray-400 hover:text-white" />
          </Link>

          {/* Profile Link */}
          <Link
            to="/profile"
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Profile"
          >
            <User className="w-5 h-5 text-gray-400 hover:text-white" />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
