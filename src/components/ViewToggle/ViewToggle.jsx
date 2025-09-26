import React from 'react';

const ViewToggle = ({ currentView, onViewChange }) => {
  const views = [
    { id: 'calendar', label: 'Calendario', icon: '📅' },
    { id: 'list', label: 'Lista', icon: '📋' },
    { id: 'stats', label: 'Estadísticas', icon: '📊' }
  ];

  return (
    <div className="bg-white/95 backdrop-blur-lg rounded-xl p-3 shadow-xl border border-white/30">
      <div className="flex space-x-2 bg-gray-100 p-2 rounded-xl">
        {views.map((view) => (
          <button
            key={view.id}
            onClick={() => onViewChange(view.id)}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-semibold transition-all duration-300 border-2 ${
              currentView === view.id
                ? 'bg-white text-blue-600 shadow-lg transform scale-105 border-blue-500'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/80 border-gray-200'
            }`}
          >
            <span className="text-lg">{view.icon}</span>
            <span className="hidden sm:inline font-medium">{view.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ViewToggle;
