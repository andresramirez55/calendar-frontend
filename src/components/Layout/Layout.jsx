import React, { useState } from 'react';
import { useEvents } from '../../contexts/EventContext';
import FamilySettings from '../FamilySettings/FamilySettings';

const Layout = ({ children }) => {
  const { loading, error, clearError } = useEvents();
  const [showFamilySettings, setShowFamilySettings] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Modern Header */}
      <header className="bg-white/90 backdrop-blur-lg border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl font-bold">📅</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Calendar App
              </h1>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-blue-50">
                Calendario
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-600 px-3 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-blue-50">
                Eventos
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-600 px-3 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-blue-50">
                Estadísticas
              </a>
              <button
                onClick={() => setShowFamilySettings(true)}
                className="text-gray-500 hover:text-blue-600 px-3 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-blue-50 flex items-center gap-2"
              >
                👨‍👩‍👧‍👦 Familia
              </button>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button className="text-gray-700 hover:text-blue-600 p-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="w-full min-h-screen">
        <div className="w-full">
          {children}
        </div>
      </main>

      {/* Modern Loading overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 flex items-center space-x-4">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <span className="text-gray-700 font-semibold text-lg">Cargando eventos...</span>
          </div>
        </div>
      )}

      {/* Modern Error notification */}
      {error && (
        <div className="fixed top-4 right-4 bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-2xl shadow-lg z-50 max-w-md animate-slideUp backdrop-blur-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 text-sm">⚠️</span>
              </div>
              <span className="font-medium">{error}</span>
            </div>
            <button
              onClick={clearError}
              className="ml-4 text-red-600 hover:text-red-800 hover:bg-red-100 p-1 rounded-full transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Configuración familiar */}
      {showFamilySettings && (
        <FamilySettings onClose={() => setShowFamilySettings(false)} />
      )}
    </div>
  );
};

export default Layout;
