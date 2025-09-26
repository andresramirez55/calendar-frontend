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
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              👨‍👩‍👧‍👦 Configuración Familiar
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl font-bold transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="px-6 py-4 flex-1 overflow-y-auto space-y-6">
          {/* Miembros de la familia */}
          <div>
            <h4 className="text-base font-semibold text-gray-900 mb-4">👨‍👩‍👧‍👦 Miembros de la familia</h4>
            <div className="space-y-4">
              {familyMembers.map((member, index) => (
                <div key={member.id} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-lg">
                        {member.name.charAt(0)}
                      </span>
                    </div>
                    <h5 className="font-medium text-gray-900">Padre {index + 1}</h5>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
                      <input
                        type="text"
                        value={member.name}
                        onChange={(e) => {
                          const updated = [...familyMembers];
                          updated[index].name = e.target.value;
                          setFamilyMembers(updated);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ej: Juan Pérez"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={member.email}
                        onChange={(e) => {
                          const updated = [...familyMembers];
                          updated[index].email = e.target.value;
                          setFamilyMembers(updated);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="juan@ejemplo.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                      <input
                        type="tel"
                        value={member.phone}
                        onChange={(e) => {
                          const updated = [...familyMembers];
                          updated[index].phone = e.target.value;
                          setFamilyMembers(updated);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="+1 234 567 8900"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Niñas */}
          <div>
            <h4 className="text-base font-semibold text-gray-900 mb-4">👧 Niñas</h4>
            <div className="space-y-3">
              {kids.map((kid, index) => (
                <div key={index} className="p-3 bg-pink-50 rounded-lg border border-pink-200">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">👧</span>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Niña {index + 1}</label>
                      <input
                        type="text"
                        value={kid}
                        onChange={(e) => {
                          const updated = [...kids];
                          updated[index] = e.target.value;
                          setKids(updated);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                        placeholder="Ej: María"
                      />
                    </div>
                    <button
                      onClick={() => {
                        const updated = kids.filter((_, i) => i !== index);
                        setKids(updated);
                      }}
                      className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
              <button
                onClick={() => setKids([...kids, ''])}
                className="w-full py-3 border-2 border-dashed border-pink-300 rounded-lg text-pink-500 hover:border-pink-400 hover:text-pink-600 hover:bg-pink-50 transition-colors"
              >
                + Agregar niña
              </button>
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-3 px-6 py-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center gap-2"
          >
            💾 Guardar configuración
          </button>
        </div>
      </div>
    </div>
  );
};

export default FamilySettings;
