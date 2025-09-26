import React, { useState } from 'react';
import { getDefaultContacts } from '../../config/familyConfig';

const FamilySettings = ({ onClose }) => {
  const [familyMembers, setFamilyMembers] = useState(getDefaultContacts());
  const [kids, setKids] = useState(['María', 'Sofía', 'Ana', 'Lucía']);

  const handleSave = () => {
    // Aquí guardarías la configuración en localStorage o en el backend
    localStorage.setItem('familyMembers', JSON.stringify(familyMembers));
    localStorage.setItem('kids', JSON.stringify(kids));
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        overflow: 'hidden'
      }}
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-xs w-full mx-4 max-h-[70vh] flex flex-col"
        style={{
          position: 'relative',
          zIndex: 100000,
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          maxWidth: '300px',
          width: '85%',
          maxHeight: '70vh'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-3 py-2 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">
              👨‍👩‍👧‍👦 Familia
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-sm font-bold"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="px-2 py-2 flex-1 overflow-y-auto space-y-1">
          {/* Solo un padre */}
          <div>
            <h4 className="text-xs font-semibold text-gray-900 mb-1">👨‍👩‍👧‍👦 Padre</h4>
            <div className="p-1 bg-gray-50 rounded">
              <input
                type="text"
                value={familyMembers[0]?.name || ''}
                onChange={(e) => {
                  const updated = [...familyMembers];
                  updated[0].name = e.target.value;
                  setFamilyMembers(updated);
                }}
                className="w-full px-1 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nombre"
              />
              <input
                type="email"
                value={familyMembers[0]?.email || ''}
                onChange={(e) => {
                  const updated = [...familyMembers];
                  updated[0].email = e.target.value;
                  setFamilyMembers(updated);
                }}
                className="w-full px-1 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 mt-1"
                placeholder="Email"
              />
            </div>
          </div>

          {/* Solo una niña */}
          <div>
            <h4 className="text-xs font-semibold text-gray-900 mb-1">👧 Niña</h4>
            <div className="p-1 bg-pink-50 rounded">
              <input
                type="text"
                value={kids[0] || ''}
                onChange={(e) => {
                  const updated = [...kids];
                  updated[0] = e.target.value;
                  setKids(updated);
                }}
                className="w-full px-1 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-pink-500 focus:border-pink-500"
                placeholder="Nombre"
              />
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-1 px-2 py-1 border-t border-gray-200 bg-white flex-shrink-0">
          <button
            onClick={onClose}
            className="px-2 py-1 text-gray-600 hover:text-gray-800 font-medium text-xs border border-gray-300 rounded hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium text-xs"
          >
            💾 Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default FamilySettings;
