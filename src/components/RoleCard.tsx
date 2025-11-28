import React from 'react';

interface RoleCardProps {
  title: string;
  icon: React.ComponentType<any>;
  selected: boolean;
  onClick: () => void;
}

export const RoleCard: React.FC<RoleCardProps> = ({ title, icon: Icon, selected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`group p-6 rounded-2xl border-2 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 bg-white/50 dark:bg-gray-700 backdrop-blur-md ${
        selected ? 'border-blue-500 bg-blue-100 dark:bg-blue-900' : 'border-gray-200 dark:border-gray-600 hover:border-blue-300'
      }`}
    >
      <Icon
        className={`w-10 h-10 mx-auto mb-3 transition-colors ${
          selected ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-500'
        }`}
      />
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{title}</h3>
    </button>
  );
};
