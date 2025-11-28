import React from 'react';

interface DomainButtonProps {
  domain: string;
  selected: boolean;
  onClick: () => void;
}

export const DomainButton: React.FC<DomainButtonProps> = ({ domain, selected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full px-4 py-3 rounded-lg border text-sm font-medium transition-all ${
        selected
          ? 'border-blue-500 bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-300'
          : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
      }`}
    >
      {domain}
    </button>
  );
};
