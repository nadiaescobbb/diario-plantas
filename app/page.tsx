'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BookOpen, Settings, Sprout } from 'lucide-react';

// Types
import { Planta, AccionCuidado, Vista } from './lib/types';
import { calcularEstadisticas, filtrarPlantas, PLANTAS_EJEMPLO, determinarEstadoSalud, generarId, cargarPlantas, guardarPlantas } from './lib/utils';

// Hooks personalizados
import { usePlants } from './hooks/usePlants';
import { useHistory } from './hooks/useHistory';
import { useTheme } from './hooks/useTheme';

// Componentes de Layout
import Landing from './components/Landing';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import ClientOnly from './components/ClientOnly';
import I18nProvider from './components/I18nProvider';

// Componentes de Vistas
import DashboardView from './components/dashboard/DashboardView';
import MyPlantsView from './components/plants/MyPlantsView';
import VistaCalendario from './components/VistaCalendario';
import PlaceholderView from './components/common/PlaceholderView';

// Modales
import ModalPlanta from './components/ModalPlanta';
import PlantDetailModal from './components/PlantDetailModal';

export default function PlantDiary() {
  return (
    <ClientOnly
      fallback={
        <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center">
            <div className="text-6xl mb-4">🌿</div>
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      }
    >
      <I18nProvider>
        <PlantDiaryContent />
      </I18nProvider>
    </ClientOnly>
  );
}

function PlantDiaryContent() {
  const { t, ready } = useTranslation();

  // Custom Hooks
  const { plantas, cargando: cargandoPlantas, regarPlanta, eliminarPlanta, agregarPlanta, editarPlanta } = usePlants();
  const { historial, agregarAccion, eliminarAccion, limpiarHistorialPlanta } = useHistory();
  const { darkMode, toggleDarkMode } = useTheme();

  // Estado local
  const [vistaActual, setVistaActual] = useState<Vista>('landing');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  
  // Estados de modales
  const [plantaSeleccionada, setPlantaSeleccionada] = useState<Planta | null>(null);
  const [mostrarModalDetalle, setMostrarModalDetalle] = useState(false);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [plantaAEditar, setPlantaAEditar] = useState<Planta | null>(null);

  // Cargar vista guardada y plantas de ejemplo
  useEffect(() => {
    const vistaGuardada = localStorage.getItem('vistaActual') as Vista;
    if (vistaGuardada) {
      setVistaActual(vistaGuardada);
    }

    // Si no hay plantas, agregar ejemplos
    const plantasGuardadas = cargarPlantas();
    if (plantasGuardadas.length === 0) {
      const plantasConId = PLANTAS_EJEMPLO.map(p => ({
        ...p,
        id: generarId(),
        estadoSalud: determinarEstadoSalud({ ...p, id: 0 } as Planta)
      }));
      plantasConId.forEach(planta => agregarPlanta(planta));
    }
  }, []);

  // Guardar vista actual
  useEffect(() => {
    if (vistaActual !== 'landing') {
      localStorage.setItem('vistaActual', vistaActual);
    }
  }, [vistaActual]);

  // Verificar si está listo
  if (cargandoPlantas || !ready) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Sprout className="w-16 h-16 mx-auto text-green-600 animate-pulse mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Handlers
  const handleRegar = (id: number) => {
    regarPlanta(id);
    agregarAccion({
      plantaId: id,
      tipo: 'riego',
      fecha: new Date().toISOString()
    });
  };

  const handleEliminar = (id: number) => {
    if (window.confirm(t('plant.deleteConfirm'))) {
      eliminarPlanta(id);
      limpiarHistorialPlanta(id);
    }
  };

  const handleGuardarPlanta = (plantaData: Omit<Planta, 'id'>) => {
    if (plantaAEditar) {
      editarPlanta(plantaAEditar.id, plantaData);
    } else {
      agregarPlanta(plantaData);
    }
    setMostrarModalEditar(false);
    setPlantaAEditar(null);
  };

  const handleAbrirModalEditar = (planta?: Planta) => {
    setPlantaAEditar(planta || null);
    setMostrarModalEditar(true);
  };

  const handleAbrirDetalle = (planta: Planta) => {
    setPlantaSeleccionada(planta);
    setMostrarModalDetalle(true);
  };

  const handleAgregarAccion = (accion: Omit<AccionCuidado, 'id'>) => {
    agregarAccion(accion);
    if (accion.tipo === 'riego') {
      regarPlanta(accion.plantaId);
    }
  };

  const handleEntrar = () => {
    setVistaActual('dashboard');
  };

  // Datos computados
  const plantasFiltradas = filtrarPlantas(plantas, busqueda);
  const stats = calcularEstadisticas(plantas);

  // Mostrar landing page
  if (vistaActual === 'landing') {
    return <Landing onEntrar={handleEntrar} />;
  }

  // Render principal
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* SIDEBAR */}
      <Sidebar
        vistaActual={vistaActual}
        onVistaChange={setVistaActual}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* HEADER */}
        <Header
          vistaActual={vistaActual}
          plantasCount={plantas.length}
          plantasFiltradas={plantasFiltradas.length}
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
          onAddPlant={() => handleAbrirModalEditar()}
          busqueda={busqueda}
          onBusquedaChange={setBusqueda}
        />

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* DASHBOARD */}
          {vistaActual === 'dashboard' && (
            <DashboardView
              plantas={plantas}
              stats={stats}
              onRegar={handleRegar}
              onEditar={handleAbrirModalEditar}
              onEliminar={handleEliminar}
              onAbrirDetalle={handleAbrirDetalle}
              onAddPlant={() => handleAbrirModalEditar()}
              onViewAll={() => setVistaActual('mis-plantas')}
            />
          )}

          {/* MY PLANTS */}
          {vistaActual === 'mis-plantas' && (
            <MyPlantsView
              plantasFiltradas={plantasFiltradas}
              onRegar={handleRegar}
              onEditar={handleAbrirModalEditar}
              onEliminar={handleEliminar}
              onAbrirDetalle={handleAbrirDetalle}
            />
          )}

          {/* CALENDAR */}
          {vistaActual === 'calendario' && (
            <VistaCalendario plantas={plantas} onRegar={handleRegar} />
          )}

          {/* DATABASE */}
          {vistaActual === 'base-datos' && (
            <PlaceholderView 
              icon={<BookOpen className="w-16 h-16" />}
              title={t('database.title')}
              subtitle={t('database.comingSoon')}
            />
          )}

          {/* SETTINGS */}
          {vistaActual === 'configuracion' && (
            <PlaceholderView 
              icon={<Settings className="w-16 h-16" />}
              title={t('settings.title')}
              subtitle={t('settings.comingSoon')}
            />
          )}
        </main>
      </div>

      {/* MODALS */}
      {mostrarModalEditar && (
        <ModalPlanta
          planta={plantaAEditar}
          onGuardar={handleGuardarPlanta}
          onCerrar={() => {
            setMostrarModalEditar(false);
            setPlantaAEditar(null);
          }}
        />
      )}

      {mostrarModalDetalle && plantaSeleccionada && (
        <PlantDetailModal
          planta={plantaSeleccionada}
          historial={historial}
          onClose={() => {
            setMostrarModalDetalle(false);
            setPlantaSeleccionada(null);
          }}
          onRegar={handleRegar}
          onAgregarAccion={handleAgregarAccion}
          onEliminarAccion={eliminarAccion}
          onEditar={(planta: Planta) => {
            setMostrarModalDetalle(false);
            handleAbrirModalEditar(planta);
          }}
        />
      )}
    </div>
  );
}