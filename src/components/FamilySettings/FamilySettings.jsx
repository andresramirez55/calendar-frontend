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
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(4px)',
        overflow: 'hidden',
        touchAction: 'none'
      }}
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden"
        style={{
          position: 'relative',
          zIndex: 10000,
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          pointerEvents: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              👨‍👩‍👧‍👦 Configuración Familiar
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="px-6 py-4 max-h-[70vh] overflow-y-auto space-y-6">
          {/* Miembros de la familia */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">👨‍👩‍👧‍👦 Miembros de la familia</h4>
            <div className="space-y-4">
              {familyMembers.map((member, index) => (
                <div key={member.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-lg">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) => {
                        const updated = [...familyMembers];
                        updated[index].name = e.target.value;
                        setFamilyMembers(updated);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nombre completo"
                    />
                    <input
                      type="email"
                      value={member.email}
                      onChange={(e) => {
                        const updated = [...familyMembers];
                        updated[index].email = e.target.value;
                        setFamilyMembers(updated);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Teléfono"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Niñas */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">👧 Niñas</h4>
            <div className="space-y-3">
              {kids.map((kid, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-pink-50 rounded-lg">
                  <span className="text-2xl">👧</span>
                  <input
                    type="text"
                    value={kid}
                    onChange={(e) => {
                      const updated = [...kids];
                      updated[index] = e.target.value;
                      setKids(updated);
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    placeholder="Nombre de la niña"
                  />
                  <button
                    onClick={() => {
                      const updated = kids.filter((_, i) => i !== index);
                      setKids(updated);
                    }}
                    className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100"
                  >
                    ✕
                  </button>
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

          {/* Información adicional */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h5 className="font-semibold text-blue-900 mb-3">💡 Cómo funciona</h5>
            <ul className="text-sm text-blue-800 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>Los eventos se pueden compartir entre ambos padres</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>Puedes seleccionar qué niñas están involucradas en cada evento</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>Los recordatorios se envían a ambos padres</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>Cada evento puede ser privado o compartido</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-3 px-6 py-4 border-t border-gray-200 bg-white">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
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
