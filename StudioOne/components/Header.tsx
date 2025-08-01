import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';
import { UserCircleIcon } from './icons/UserCircleIcon';
import { CrownIcon } from './icons/CrownIcon';
import { User, MEMBERSHIP_LIMITS } from '../types';

interface HeaderProps {
    isLoggedIn: boolean;
    user: User | null;
    onLogout: () => void;
    onUpgradeClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn, user, onLogout, onUpgradeClick }) => {
  const getUsagePercentage = () => {
    if (!user) return 0;
    const limit = MEMBERSHIP_LIMITS[user.tier];
    return (user.generationsUsed / limit) * 100;
  };

  return (
    <header className="bg-gray-800 shadow-md p-4 flex-shrink-0">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SparklesIcon className="text-blue-500 h-8 w-8" />
          <h1 className="text-2xl font-bold text-gray-100">AI Credit Memo Assistant</h1>
        </div>
        {isLoggedIn && user && (
            <div className="flex items-center gap-6">
                <div className="flex flex-col items-end">
                  <span className="text-xs text-gray-400">
                    Usage: {user.generationsUsed} / {MEMBERSHIP_LIMITS[user.tier]} Generations
                  </span>
                  <div className="w-32 bg-gray-700 rounded-full h-1.5 mt-1">
                    <div 
                      className="bg-blue-500 h-1.5 rounded-full"
                      style={{ width: `${getUsagePercentage()}%` }}
                    ></div>
                  </div>
                </div>
                <button
                    onClick={onUpgradeClick}
                    className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-2 px-4 rounded-md text-sm transition-colors"
                >
                    <CrownIcon className="h-4 w-4" />
                    <span>Upgrade</span>
                </button>
                <div className="flex items-center gap-2">
                    <UserCircleIcon className="h-8 w-8 text-gray-400"/>
                    <span className="text-gray-200 font-medium">{user.name}</span>
                </div>
                <button
                    onClick={onLogout}
                    className="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-md text-sm transition-colors"
                >
                    Sign Out
                </button>
            </div>
        )}
      </div>
    </header>
  );
};

export default Header;
