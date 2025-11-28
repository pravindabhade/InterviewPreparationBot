import React from 'react';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 p-4">
      <div className="text-center bg-white p-10 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-4 text-blue-700">Welcome to AI Interview Bot</h1>
        <p className="mb-6 text-gray-600">Your personal assistant for interview preparation!</p>
        <button
          onClick={onStart}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Start Practicing
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
