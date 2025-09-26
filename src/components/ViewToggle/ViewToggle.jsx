import React from 'react';

const ViewToggle = ({ currentView, onViewChange }) => {
  const views = [
    { id: 'calendar', label: 'Calendario', icon: '📅' },
    { id: 'list', label: 'Lista', icon: '📋' },
    { id: 'stats', label: 'Estadísticas', icon: '📊' }
  ];

  return (
    <div className="card">
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
        {views.map((view) => (
          <button
            key={view.id}
            onClick={() => onViewChange(view.id)}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
              currentView === view.id
                ? 'bg-white text-blue-600 shadow-lg transform scale-105'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
            }`}
          >
            <span className="text-lg">{view.icon}</span>
            <span className="hidden sm:inline">{view.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ViewToggle;
