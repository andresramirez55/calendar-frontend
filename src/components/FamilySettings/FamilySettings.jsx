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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              👨‍👩‍👧‍👦 Configuración Familiar
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="px-6 py-4 space-y-6">
          {/* Miembros de la familia */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">👨‍👩‍👧‍👦 Miembros de la familia</h4>
            <div className="space-y-4">
              {familyMembers.map((member, index) => (
                <div key={member.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) => {
                        const updated = [...familyMembers];
                        updated[index].name = e.target.value;
                        setFamilyMembers(updated);
                      }}
                      className="input-field mb-2"
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
                      className="input-field mb-2"
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
                      className="input-field"
                      placeholder="Teléfono"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Niñas */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">👧 Niñas</h4>
            <div className="space-y-2">
              {kids.map((kid, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <span className="text-2xl">👧</span>
                  <input
                    type="text"
                    value={kid}
                    onChange={(e) => {
                      const updated = [...kids];
                      updated[index] = e.target.value;
                      setKids(updated);
                    }}
                    className="input-field flex-1"
                    placeholder="Nombre de la niña"
                  />
                  <button
                    onClick={() => {
                      const updated = kids.filter((_, i) => i !== index);
                      setKids(updated);
                    }}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                onClick={() => setKids([...kids, ''])}
                className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600"
              >
                + Agregar niña
              </button>
            </div>
          </div>

          {/* Información adicional */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h5 className="font-medium text-blue-900 mb-2">💡 Cómo funciona</h5>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Los eventos se pueden compartir entre ambos padres</li>
              <li>• Puedes seleccionar qué niñas están involucradas en cada evento</li>
              <li>• Los recordatorios se envían a ambos padres</li>
              <li>• Cada evento puede ser privado o compartido</li>
            </ul>
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-3 px-6 py-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="btn-secondary"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="btn-primary"
          >
            💾 Guardar configuración
          </button>
        </div>
      </div>
    </div>
  );
};

export default FamilySettings;
