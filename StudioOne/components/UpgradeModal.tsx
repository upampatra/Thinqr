import React from 'react';
import { User } from '../types';
import { CrownIcon } from './icons/CrownIcon';

interface UpgradeModalProps {
  user: User;
  onClose: () => void;
  onUpgrade: () => void;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ user, onClose, onUpgrade }) => {
  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 transition-opacity"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="upgrade-modal-title"
    >
      <div 
        className="bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-4xl transform transition-all"
        onClick={e => e.stopPropagation()}
      >
        <div className="text-center">
            <h2 id="upgrade-modal-title" className="text-3xl font-bold text-white mb-2">Choose Your Plan</h2>
            <p className="text-gray-400 mb-8">Unlock your full potential with our Pro features.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Tier */}
            <div className={`border-2 rounded-lg p-6 flex flex-col ${user.tier === 'Free' ? 'border-blue-500' : 'border-gray-700'}`}>
                <h3 className="text-xl font-semibold text-white">Free</h3>
                <p className="text-gray-400 mt-2">For trying out the basics.</p>
                <p className="text-4xl font-bold text-white my-6">$0<span className="text-lg font-normal text-gray-400">/month</span></p>
                <ul className="space-y-3 text-gray-300 flex-grow">
                    <li className="flex items-center gap-2">✓ 10 AI Generations/month</li>
                    <li className="flex items-center gap-2">✓ Standard document analysis</li>
                    <li className="flex items-center gap-2">✓ Community support</li>
                </ul>
                <button
                    disabled={user.tier === 'Free'}
                    className="w-full mt-8 bg-gray-600 text-white font-semibold py-2 px-4 rounded-md text-sm cursor-default"
                >
                    Current Plan
                </button>
            </div>

            {/* Pro Tier */}
            <div className={`border-2 rounded-lg p-6 flex flex-col relative overflow-hidden ${user.tier === 'Pro' ? 'border-blue-500' : 'border-gray-700 hover:border-blue-500'}`}>
                <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-4 py-1 rounded-bl-lg">MOST POPULAR</div>
                <h3 className="text-xl font-semibold text-blue-400 flex items-center gap-2"><CrownIcon /> Pro</h3>
                <p className="text-gray-400 mt-2">For professionals and power users.</p>
                <p className="text-4xl font-bold text-white my-6">$19<span className="text-lg font-normal text-gray-400">/month</span></p>
                <ul className="space-y-3 text-gray-300 flex-grow">
                    <li className="flex items-center gap-2">✓ 100 AI Generations/month</li>
                    <li className="flex items-center gap-2">✓ Advanced document analysis</li>
                    <li className="flex items-center gap-2">✓ Priority support</li>
                    <li className="flex items-center gap-2">✓ Early access to new features</li>
                </ul>
                <button
                    onClick={onUpgrade}
                    disabled={user.tier === 'Pro'}
                    className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md text-sm transition-colors disabled:bg-gray-600 disabled:cursor-default"
                >
                    {user.tier === 'Pro' ? 'Current Plan' : 'Upgrade to Pro'}
                </button>
            </div>

            {/* Enterprise Tier */}
            <div className="border-2 border-gray-700 rounded-lg p-6 flex flex-col">
                <h3 className="text-xl font-semibold text-white">Enterprise</h3>
                <p className="text-gray-400 mt-2">For teams and organizations.</p>
                <p className="text-4xl font-bold text-white my-6">Custom</p>
                <ul className="space-y-3 text-gray-300 flex-grow">
                    <li className="flex items-center gap-2">✓ Unlimited AI Generations</li>
                    <li className="flex items-center gap-2">✓ Team management & billing</li>
                    <li className="flex items-center gap-2">✓ Dedicated account manager</li>
                    <li className="flex items-center gap-2">✓ On-premise deployment option</li>
                </ul>
                <button className="w-full mt-8 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-md text-sm transition-colors">
                    Contact Sales
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;
