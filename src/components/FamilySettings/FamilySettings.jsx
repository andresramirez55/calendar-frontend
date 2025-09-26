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
        className="bg-white rounded-lg shadow-xl max-w-sm w-full mx-4 max-h-[60vh] overflow-hidden"
        style={{
          position: 'relative',
          zIndex: 100000,
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden'
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
              className="text-gray-400 hover:text-gray-600 text-lg font-bold"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="px-3 py-2 max-h-[45vh] overflow-y-auto space-y-2">
          {/* Miembros de la familia */}
          <div>
            <h4 className="text-xs font-semibold text-gray-900 mb-1">👨‍👩‍👧‍👦 Padres</h4>
            <div className="space-y-1">
              {familyMembers.map((member, index) => (
                <div key={member.id} className="p-2 bg-gray-50 rounded">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-xs">
                        {member.name.charAt(0)}
                      </span>
                    </div>
                    <h5 className="font-medium text-gray-900 text-xs">Padre {index + 1}</h5>
                  </div>
                  <div className="space-y-1">
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) => {
                        const updated = [...familyMembers];
                        updated[index].name = e.target.value;
                        setFamilyMembers(updated);
                      }}
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nombre"
                    />
                    <input
                      type="email"
                      value={member.email}
                      onChange={(e) => {
                        const updated = [...familyMembers];
                        updated[index].email = e.target.value;
                        setFamilyMembers(updated);
                      }}
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Email"
                    />
                    <input
                      type="tel"
                      value={member.phone}
                      onChange={(e) => {
                        const updated = [...familyMembers];
                        updated[index].phone = e.target.value;
                        setFamilyMembers(updated);
                      }}
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Teléfono"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Niñas */}
          <div>
            <h4 className="text-xs font-semibold text-gray-900 mb-1">👧 Niñas</h4>
            <div className="space-y-1">
              {kids.map((kid, index) => (
                <div key={index} className="p-2 bg-pink-50 rounded">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">👧</span>
                    <input
                      type="text"
                      value={kid}
                      onChange={(e) => {
                        const updated = [...kids];
                        updated[index] = e.target.value;
                        setKids(updated);
                      }}
                      className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-pink-500 focus:border-pink-500"
                      placeholder="Nombre de la niña"
                    />
                    <button
                      onClick={() => {
                        const updated = kids.filter((_, i) => i !== index);
                        setKids(updated);
                      }}
                      className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
              <button
                onClick={() => setKids([...kids, ''])}
                className="w-full py-1 border border-dashed border-pink-300 rounded text-pink-500 hover:border-pink-400 hover:text-pink-600 hover:bg-pink-50 transition-colors text-xs"
              >
                + Agregar niña
              </button>
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-2 px-3 py-2 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-2 py-1 text-gray-600 hover:text-gray-800 font-medium text-xs"
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
