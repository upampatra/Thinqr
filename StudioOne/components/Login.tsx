import React from 'react';
import { GoogleIcon } from './icons/GoogleIcon';
import { FacebookIcon } from './icons/FacebookIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface LoginProps {
  onLogin: (provider: 'google' | 'facebook') => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  return (
    <div className="flex-grow flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-gray-800 rounded-lg shadow-md p-8 text-center">
        <SparklesIcon className="h-12 w-12 text-blue-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-100 mb-2">Welcome Back</h1>
        <p className="text-gray-400 mb-6">Sign in to continue to the AI Credit Memo Assistant.</p>
        <div className="space-y-4">
          <button
            onClick={() => onLogin('google')}
            className="w-full flex items-center justify-center gap-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            <GoogleIcon />
            <span>Sign in with Google</span>
          </button>
          <button
            onClick={() => onLogin('facebook')}
            className="w-full flex items-center justify-center gap-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            <FacebookIcon />
            <span>Sign in with Facebook</span>
          </button>
        </div>
         <p className="text-xs text-gray-500 mt-8">
            This is a simulated login. No actual authentication will occur.
        </p>
      </div>
    </div>
  );
};

export default Login;
