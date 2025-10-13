'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Edit2, Trash2, Sun, Moon, Droplet, Sprout, X, Search } from 'lucide-react';
import Landing from './components/Landing';
import CardPlanta from './components/CardPlanta';
import ModalPlanta from './components/ModalPlanta';
import VistaCalendario from './components/VistaCalendario';
import { Planta, Vista, TIPOS_PLANTA, CONFIG } from './types';

export default function DiarioPlantas() {
  const [darkMode, setDarkMode] = useState(false);
  const [plantas, setPlantas] = useState<Planta[]>([]);
  const [vista, setVista] = useState<Vista>('galeria');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [plantaEditar, setPlantaEditar] = useState<Planta | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('Todos');
  const [mostrarLanding, setMostrarLanding] = useState(true);

  // Cargar datos al inicio
  useEffect(() => {
    const plantasGuardadas = localStorage.getItem('plantas');
    const modoOscuro = localStorage.getItem('darkMode') === 'true';
    const yaVistoLanding = localStorage.getItem('visitado') === 'true';
    
    if (plantasGuardadas) setPlantas(JSON.parse(plantasGuardadas));
    setDarkMode(modoOscuro);
    setMostrarLanding(!yaVistoLanding);
  }, []);

  // Guardar plantas
  useEffect(() => {
    if (plantas.length >= 0) {
      localStorage.setItem('plantas', JSON.stringify(plantas));
    }
  }, [plantas]);

  // Cambiar modo oscuro
  useEffect(() => {
    localStorage.setItem('darkMode', String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const agregarPlanta = (planta: Omit<Planta, 'id'>) => {
    if (plantaEditar) {
      setPlantas(plantas.map(p => 
        p.id === plantaEditar.id ? { ...planta, id: plantaEditar.id } : p
      ));
    } else {
      setPlantas([...plantas, { ...planta, id: Date.now() }]);
    }
    setModalAbierto(false);
    setPlantaEditar(null);
  };

  const eliminarPlanta = (id: number) => {
    if (window.confirm('¿Seguro que deseas eliminar esta planta?')) {
      setPlantas(plantas.filter(p => p.id !== id));
    }
  };

  const editarPlanta = (planta: Planta) => {
    setPlantaEditar(planta);
    setModalAbierto(true);
  };

  const marcarRiego = (id: number) => {
    setPlantas(plantas.map(p => 
      p.id === id ? { ...p, ultimoRiego: new Date().toISOString() } : p
    ));
  };

  const plantasFiltradas = plantas.filter(p => {
    const matchBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const matchTipo = filtroTipo === 'Todos' || p.tipo === filtroTipo;
    return matchBusqueda && matchTipo;
  });

  if (mostrarLanding) {
    return (
      <Landing 
        onEntrar={() => {
          setMostrarLanding(false);
          localStorage.setItem('visitado', 'true');
        }} 
      />
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50'
    }`}>
      {/* NAVBAR */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-green-100 dark:border-gray-700 sticky top-0 z-40 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Sprout className="w-8 h-8 text-green-600 dark:text-green-400" />
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              {CONFIG.appName}
            </h1>
          </div>
          
          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={() => setVista('galeria')}
              className={`px-4 py-2 rounded-lg transition-all ${
                vista === 'galeria' 
                  ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Galería
            </button>
            <button
              onClick={() => setVista('calendario')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                vista === 'calendario' 
                  ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Calendar className="w-5 h-5" />
              <span className="hidden sm:inline">Calendario</span>
            </button>
            <button
              onClick={() => setMostrarLanding(true)}
              className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 px-4 py-2 rounded-lg transition-all"
              title="Ver página de inicio"
            >
              ℹ️ Acerca de
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>
            <button
              onClick={() => {
                setPlantaEditar(null);
                setModalAbierto(true);
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg shadow-green-600/30"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Nueva Planta</span>
            </button>
          </div>
        </div>
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {vista === 'galeria' && (
          <div className="space-y-6">
            {/* Búsqueda y Filtros */}
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 min-w-[200px] relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar plantas..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
              >
                <option>Todos</option>
                {TIPOS_PLANTA.map(tipo => (
                  <option key={tipo}>{tipo}</option>
                ))}
              </select>
            </div>

            {/* Grid de Plantas */}
            {plantasFiltradas.length === 0 ? (
              <div className="text-center py-20">
                <Sprout className="w-20 h-20 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  {plantas.length === 0 
                    ? "Aún no tienes plantas. ¡Agrega tu primera planta!" 
                    : "No se encontraron plantas"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plantasFiltradas.map((planta) => (
                  <CardPlanta 
                    key={planta.id} 
                    planta={planta} 
                    onEditar={editarPlanta}
                    onEliminar={eliminarPlanta}
                    onRegar={marcarRiego}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {vista === 'calendario' && (
          <VistaCalendario plantas={plantas} onRegar={marcarRiego} />
        )}
      </main>

      {/* MODAL */}
      {modalAbierto && (
        <ModalPlanta
          planta={plantaEditar}
          onGuardar={agregarPlanta}
          onCerrar={() => {
            setModalAbierto(false);
            setPlantaEditar(null);
          }}
        />
      )}
    </div>
  );
}