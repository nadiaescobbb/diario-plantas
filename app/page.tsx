'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  LayoutGrid, Sprout, Calendar, BookOpen, Settings, 
  Plus, Search, Sun, Moon, TrendingUp, AlertTriangle,
  Home, Menu
} from 'lucide-react';


// Importar tipos y utilidades consolidadas
import { Planta, AccionCuidado, Vista } from './lib/types';
import { 
  calcularEstadisticas, 
  determinarEstadoSalud,
  cargarPlantas,
  guardarPlantas,
  cargarHistorial,
  guardarHistorial,
  generarId,
  filtrarPlantas,
  PLANTAS_EJEMPLO
} from './lib/utils';

// Importar componentes
import Landing from './components/Landing';
import CardPlanta from './components/CardPlanta';
import PlantDetailModal from './components/PlantDetailModal';
import ModalPlanta from './components/ModalPlanta';
import VistaCalendario from './components/VistaCalendario';
import LanguageSwitcher from './components/LanguageSwitcher';
import I18nProvider from './components/I18nProvider';
import ClientOnly from './components/ClientOnly';



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
        {/* 🔽 Este componente va definido más abajo */}
        <PlantDiaryContent />
      </I18nProvider>
    </ClientOnly>
  );
}

function PlantDiaryContent() {
  const { t, ready } = useTranslation(); 
  
  // Estados principales
  const [vistaActual, setVistaActual] = useState<Vista>('landing');
  const [plantas, setPlantas] = useState<Planta[]>([]);
  const [historial, setHistorial] = useState<AccionCuidado[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  
  // Estados para modales
  const [plantaSeleccionada, setPlantaSeleccionada] = useState<Planta | null>(null);
  const [mostrarModalDetalle, setMostrarModalDetalle] = useState(false);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [plantaAEditar, setPlantaAEditar] = useState<Planta | null>(null);

  // Cargar datos al inicio
  useEffect(() => {
    const plantasGuardadas = cargarPlantas();
    const historialGuardado = cargarHistorial();
    const modoOscuro = localStorage.getItem('darkMode') === 'true';
    const vistaGuardada = localStorage.getItem('vistaActual') as Vista;
    
    if (plantasGuardadas.length === 0) {
      const plantasConId = PLANTAS_EJEMPLO.map(p => ({
        ...p,
        id: generarId(),
        estadoSalud: determinarEstadoSalud({ ...p, id: 0 } as Planta)
      }));
      setPlantas(plantasConId);
      guardarPlantas(plantasConId);
    } else {
      setPlantas(plantasGuardadas);
    }
    
    setHistorial(historialGuardado);
    setDarkMode(modoOscuro);
    setVistaActual(vistaGuardada || 'landing');
    
    if (modoOscuro) {
      document.documentElement.classList.add('dark');
    }
    
    setCargando(false);
  }, []);


  // verificación de 'ready'
  if (cargando || !ready) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Sprout className="w-16 h-16 mx-auto text-green-600 animate-pulse mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Guardar plantas cuando cambien
  useEffect(() => {
    if (!cargando && plantas.length > 0) {
      guardarPlantas(plantas);
    }
  }, [plantas, cargando]);

  // Guardar historial cuando cambie
  useEffect(() => {
    if (!cargando) {
      guardarHistorial(historial);
    }
  }, [historial, cargando]);

  // Guardar vista actual
  useEffect(() => {
    if (!cargando) {
      localStorage.setItem('vistaActual', vistaActual);
    }
  }, [vistaActual, cargando]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', String(newDarkMode));
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Handlers de plantas
  const handleRegar = (id: number) => {
    const plantasActualizadas = plantas.map(p => {
      if (p.id === id) {
        return { 
          ...p, 
          ultimoRiego: new Date().toISOString(),
          estadoSalud: 'healthy' as const
        };
      }
      return p;
    });
    
    setPlantas(plantasActualizadas);
    
    // Agregar al historial
    const nuevaAccion: AccionCuidado = {
      id: generarId(),
      plantaId: id,
      tipo: 'riego',
      fecha: new Date().toISOString()
    };
    setHistorial([...historial, nuevaAccion]);
  };

  const handleEliminar = (id: number) => {
    if (window.confirm(t('plant.deleteConfirm'))) {
      setPlantas(plantas.filter(p => p.id !== id));
      setHistorial(historial.filter(h => h.plantaId !== id));
    }
  };

  const handleGuardarPlanta = (plantaData: Omit<Planta, 'id'>) => {
    if (plantaAEditar) {
      // Editar planta existente
      setPlantas(plantas.map(p => 
        p.id === plantaAEditar.id 
          ? { ...plantaData, id: plantaAEditar.id }
          : p
      ));
    } else {
      // Agregar nueva planta
      const nuevaPlanta: Planta = {
        ...plantaData,
        id: generarId(),
        estadoSalud: 'healthy'
      };
      setPlantas([...plantas, nuevaPlanta]);
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
    const nuevaAccion: AccionCuidado = {
      ...accion,
      id: generarId()
    };
    setHistorial([...historial, nuevaAccion]);
    
    // Si es riego, actualizar la planta
    if (accion.tipo === 'riego') {
      setPlantas(plantas.map(p => 
        p.id === accion.plantaId 
          ? { ...p, ultimoRiego: accion.fecha, estadoSalud: 'healthy' as const }
          : p
      ));
    }
  };

  const handleEliminarAccion = (id: number) => {
    setHistorial(historial.filter(h => h.id !== id));
  };

  // Entrar a la app desde landing
  const handleEntrar = () => {
    setVistaActual('dashboard');
  };

  // Plantas filtradas
  const plantasFiltradas = filtrarPlantas(plantas, busqueda);

  if (cargando) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Sprout className="w-16 h-16 mx-auto text-green-600 animate-pulse mb-4" />
          <p className="text-gray-600 dark:text-gray-400">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  // Mostrar landing page
  if (vistaActual === 'landing') {
    return <Landing onEntrar={handleEntrar} />;
  }

  const stats = calcularEstadisticas(plantas);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* SIDEBAR */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-green-700 to-green-900 dark:from-gray-800 dark:to-gray-900 text-white transition-all duration-300 flex flex-col shadow-2xl`}>
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Sprout className="w-6 h-6" />
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="font-bold text-lg">{t('app.title')}</h1>
                <p className="text-xs text-white/70">{t('app.version')}</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <NavItem 
            icon={<Home className="w-5 h-5" />}
            label={t('nav.dashboard')}
            active={vistaActual === 'dashboard'}
            onClick={() => setVistaActual('dashboard')}
            collapsed={!sidebarOpen}
          />
          <NavItem 
            icon={<LayoutGrid className="w-5 h-5" />}
            label={t('nav.myPlants')}
            active={vistaActual === 'mis-plantas'}
            onClick={() => setVistaActual('mis-plantas')}
            collapsed={!sidebarOpen}
          />
          <NavItem 
            icon={<Calendar className="w-5 h-5" />}
            label={t('nav.calendar')}
            active={vistaActual === 'calendario'}
            onClick={() => setVistaActual('calendario')}
            collapsed={!sidebarOpen}
          />
          <NavItem 
            icon={<BookOpen className="w-5 h-5" />}
            label={t('nav.database')}
            active={vistaActual === 'base-datos'}
            onClick={() => setVistaActual('base-datos')}
            collapsed={!sidebarOpen}
          />
          <NavItem 
            icon={<Settings className="w-5 h-5" />}
            label={t('nav.settings')}
            active={vistaActual === 'configuracion'}
            onClick={() => setVistaActual('configuracion')}
            collapsed={!sidebarOpen}
          />
        </nav>

        {/* Toggle Sidebar */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full py-2 px-3 bg-white/10 hover:bg-white/20 rounded-lg transition-all flex items-center justify-center gap-2"
            title={sidebarOpen ? t('nav.collapse') : t('nav.expand')}
          >
            <Menu className="w-5 h-5" />
            {sidebarOpen && <span className="text-sm">{t('nav.collapse')}</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* HEADER */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {vistaActual === 'dashboard' && t('nav.dashboard')}
                {vistaActual === 'mis-plantas' && t('nav.myPlants')}
                {vistaActual === 'calendario' && t('calendar.title')}
                {vistaActual === 'base-datos' && t('database.title')}
                {vistaActual === 'configuracion' && t('settings.title')}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {vistaActual === 'dashboard' && `${plantas.length} ${t('stats.active').toLowerCase()}`}
                {vistaActual === 'mis-plantas' && `${plantasFiltradas.length} ${t('stats.active').toLowerCase()}`}
                {vistaActual === 'calendario' && t('calendar.title')}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Buscador (solo en mis-plantas) */}
              {vistaActual === 'mis-plantas' && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder={t('plant.searchPlaceholder')}
                    className="pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none w-64 text-gray-900 dark:text-white"
                  />
                </div>
              )}

              {/* Language Switcher */}
              <LanguageSwitcher />

              {/* Dark mode toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
                title={darkMode ? t('common.lightMode') : t('common.darkMode')}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Add plant button */}
              {(vistaActual === 'dashboard' || vistaActual === 'mis-plantas') && (
                <button
                  onClick={() => handleAbrirModalEditar()}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all shadow-lg shadow-green-500/30"
                >
                  <Plus className="w-5 h-5" />
                  <span className="hidden sm:inline">{t('plant.addPlant')}</span>
                </button>
              )}
            </div>
          </div>
        </header>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* DASHBOARD */}
          {vistaActual === 'dashboard' && (
            <div className="space-y-6 animate-fade-in">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                  title={t('stats.totalPlants')} 
                  value={stats.total.toString()} 
                  change={t('stats.active')} 
                  icon={<Sprout className="w-6 h-6" />} 
                  color="green" 
                />
                <StatCard 
                  title={t('stats.needsWater')} 
                  value={stats.necesitanRiego.toString()} 
                  change={t('stats.today')} 
                  icon={<AlertTriangle className="w-6 h-6" />} 
                  color="red" 
                />
                <StatCard 
                  title={t('stats.healthy')} 
                  value={stats.saludables.toString()} 
                  change={`${stats.porcentajeSaludables}%`} 
                  icon={<TrendingUp className="w-6 h-6" />} 
                  color="green" 
                  positive 
                />
                <StatCard 
                  title={t('stats.needsAttention')} 
                  value={stats.necesitanAtencion.toString()} 
                  change={t('stats.checkNow')} 
                  icon={<AlertTriangle className="w-6 h-6" />} 
                  color="yellow" 
                />
              </div>

              {/* Plants Grid */}
              {plantas.length === 0 ? (
                <EmptyState onAddPlant={() => handleAbrirModalEditar()} t={t} />
              ) : (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    {t('stats.yourPlants')}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {plantas.slice(0, 6).map(planta => (
                      <CardPlanta
                        key={planta.id}
                        planta={planta}
                        onRegar={handleRegar}
                        onEditar={handleAbrirModalEditar}
                        onEliminar={handleEliminar}
                        onClick={handleAbrirDetalle}
                      />
                    ))}
                  </div>
                  {plantas.length > 6 && (
                    <div className="mt-6 text-center">
                      <button
                        onClick={() => setVistaActual('mis-plantas')}
                        className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-all"
                      >
                        {t('stats.viewAll', { count: plantas.length })}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* MY PLANTS */}
          {vistaActual === 'mis-plantas' && (
            <div className="animate-fade-in">
              {plantasFiltradas.length === 0 ? (
                <div className="text-center py-12">
                  <Search className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {t('plant.noPlantsFound')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('plant.adjustSearch')}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {plantasFiltradas.map(planta => (
                    <CardPlanta
                      key={planta.id}
                      planta={planta}
                      onRegar={handleRegar}
                      onEditar={handleAbrirModalEditar}
                      onEliminar={handleEliminar}
                      onClick={handleAbrirDetalle}
                    />
                  ))}
                </div>
              )}
            </div>
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
          onEliminarAccion={handleEliminarAccion}
          onEditar={(planta: Planta) => {
            setMostrarModalDetalle(false);
            handleAbrirModalEditar(planta);
          }}
        />
      )}
    </div>
  );
}

// ====== COMPONENTES AUXILIARES ======

function NavItem({ icon, label, active, onClick, collapsed }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        active 
          ? 'bg-white/20 text-white shadow-lg' 
          : 'text-white/70 hover:bg-white/10 hover:text-white'
      }`}
      title={collapsed ? label : undefined}
    >
      {icon}
      {!collapsed && <span className="font-medium">{label}</span>}
    </button>
  );
}

const colorClasses = {
  green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
  red: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
  yellow: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
  blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
} as const;

type ColorKey = keyof typeof colorClasses;

function StatCard({ title, value, change, icon, color, positive }: any) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{title}</p>
        <div className={`p-3 rounded-xl ${colorClasses[color as ColorKey]}`}>
          {icon}
        </div>
      </div>
      <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{value}</h3>
      <p className={`text-sm ${positive ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
        {change}
      </p>
    </div>
  );
}

function EmptyState({ onAddPlant, t }: { onAddPlant: () => void; t: any }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border-2 border-dashed border-gray-300 dark:border-gray-700">
      <Sprout className="w-16 h-16 mx-auto text-gray-400 mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {t('plant.noPlants')}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        {t('plant.addFirstPlant')}
      </p>
      <button 
        onClick={onAddPlant}
        className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-green-500/30"
      >
        <Plus className="w-5 h-5 inline mr-2" />
        {t('plant.addPlant')}
      </button>
    </div>
  );
}

function PlaceholderView({ icon, title, subtitle }: any) {
  return (
    <div className="text-center py-20 animate-fade-in">
      <div className="text-gray-400 mb-4 flex justify-center">{icon}</div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{title}</h2>
      <p className="text-gray-600 dark:text-gray-400">{subtitle}</p>
    </div>
  );
}

