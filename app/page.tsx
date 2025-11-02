'use client';

import React, { useState, useEffect } from 'react';
import { 
  LayoutGrid, Sprout, Calendar, BookOpen, Settings, 
  HelpCircle, Plus, Search, Sun, Moon, User, Bell, Home,
  TrendingUp, AlertTriangle, Globe, Menu, X
} from 'lucide-react';

// Importar tipos y utilidades
import { Planta, Vista, PLANTAS_EJEMPLO } from './lib/types';
import { 
  calcularEstadisticas, 
  guardarPlantas, 
  cargarPlantas,
  generarId,
  calcularDiasParaRiego,
  obtenerEstadoRiego,
  filtrarPlantas
} from './lib/utils';

// Importar componentes
import PlantCard from './components/CardPlanta';
import PlantDetailModal from './components/PlantDetailModal';
import VistaCalendario from './components/VistaCalendario';
import Landing from './components/Landing';

// Traducciones
const translations = {
  en: {
    app_title: "Plant Diary",
    app_version: "v2.0 Pro",
    dashboard: "Dashboard",
    my_plants: "My Plants",
    calendar: "Calendar",
    database: "Plant Database",
    settings: "Settings",
    help: "Help",
    add_new_plant: "Add New Plant",
    loading: "Loading...",
    welcome: "Welcome back, get an overview of your plants.",
    total_plants: "Total Plants",
    needs_water: "Needs Water",
    healthy: "Healthy",
    needs_attention: "Needs Attention",
    no_plants: "No plants yet",
    add_first: "Add your first plant to get started",
    view_in_development: "In development...",
    active: "Active",
    today: "Today",
    check_now: "Check now",
    your_plants: "Your Plants",
    search_placeholder: "Search for a plant...",
    confirm_delete: "Are you sure you want to delete this plant?",
    language: "Language",
    toggle_sidebar: "Toggle Sidebar",
    notifications: "Notifications",
    profile: "Profile"
  },
  es: {
    app_title: "Diario de Plantas",
    app_version: "v2.0 Pro",
    dashboard: "Panel",
    my_plants: "Mis Plantas",
    calendar: "Calendario",
    database: "Base de Datos",
    settings: "Configuración",
    help: "Ayuda",
    add_new_plant: "Agregar Planta",
    loading: "Cargando...",
    welcome: "Bienvenido, revisa el estado de tus plantas.",
    total_plants: "Plantas Totales",
    needs_water: "Necesitan Agua",
    healthy: "Saludables",
    needs_attention: "Necesitan Atención",
    no_plants: "Aún no hay plantas",
    add_first: "Agrega tu primera planta para comenzar",
    view_in_development: "En desarrollo...",
    active: "Activas",
    today: "Hoy",
    check_now: "Revisar ahora",
    your_plants: "Tus Plantas",
    search_placeholder: "Buscar una planta...",
    confirm_delete: "¿Estás seguro de que deseas eliminar esta planta?",
    language: "Idioma",
    toggle_sidebar: "Alternar Menú",
    notifications: "Notificaciones",
    profile: "Perfil"
  }
};

// Colores para tarjetas de estadísticas
const colorClasses = {
  green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
  red: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
  yellow: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
  blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
} as const;

type ColorKey = keyof typeof colorClasses;

// ====================
// COMPONENTE: StatCard
// ====================
interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  color: ColorKey;
  positive?: boolean;
}

function StatCard({ title, value, change, icon, color, positive }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{title}</p>
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
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

// ====================
// COMPONENTE: NavItem
// ====================
interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  collapsed: boolean;
}

function NavItem({ icon, label, active, onClick, collapsed }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        active ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'
      }`}
      title={collapsed ? label : undefined}
    >
      {icon}
      {!collapsed && <span className="font-medium">{label}</span>}
    </button>
  );
}

// ====================
// COMPONENTE: PlaceholderView
// ====================
interface PlaceholderViewProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}

function PlaceholderView({ icon, title, subtitle }: PlaceholderViewProps) {
  return (
    <div className="text-center py-20">
      <div className="mx-auto text-gray-400 mb-4">{icon}</div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{title}</h2>
      <p className="text-gray-600 dark:text-gray-400">{subtitle}</p>
    </div>
  );
}

// ====================
// COMPONENTE PRINCIPAL
// ====================
export default function DiarioPlantasPro() {
  const [vistaActual, setVistaActual] = useState<Vista>('landing');
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [plantas, setPlantas] = useState<Planta[]>([]);
  const [plantasFiltradas, setPlantasFiltradas] = useState<Planta[]>([]);
  const [cargando, setCargando] = useState(true);
  const [lang, setLang] = useState<'en' | 'es'>('es');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [plantaEditar, setPlantaEditar] = useState<Planta | null>(null);

  const t = (key: string) => translations[lang][key as keyof typeof translations.en] ?? key;

  // Cargar datos al iniciar
  useEffect(() => {
    const savedLang = (localStorage.getItem('lang') as 'en' | 'es') || 'es';
    const modoOscuro = localStorage.getItem('darkMode') === 'true';
    const vistaSaved = (localStorage.getItem('vista') as Vista) || 'landing';
    
    setLang(savedLang);
    setVistaActual(vistaSaved);
    
    const plantasGuardadas = cargarPlantas();
    if (plantasGuardadas.length > 0) {
      // Normalizar estadoSalud para plantas antiguas
      const plantasNormalizadas = plantasGuardadas.map(p => ({
        ...p,
        estadoSalud: p.estadoSalud || 'healthy'
      }));
      setPlantas(plantasNormalizadas);
      setPlantasFiltradas(plantasNormalizadas);
    } else {
      const plantasConId = PLANTAS_EJEMPLO.map(p => ({ ...p, id: generarId() }));
      setPlantas(plantasConId);
      setPlantasFiltradas(plantasConId);
      guardarPlantas(plantasConId);
    }
    
    setDarkMode(modoOscuro);
    if (modoOscuro) {
      document.documentElement.classList.add('dark');
    }
    setCargando(false);
  }, []);

  // Guardar plantas cuando cambien
  useEffect(() => {
    if (!cargando) guardarPlantas(plantas);
  }, [plantas, cargando]);

  // Filtrar plantas cuando cambie la búsqueda
  useEffect(() => {
    setPlantasFiltradas(filtrarPlantas(plantas, busqueda));
  }, [busqueda, plantas]);

  // Handlers
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('darkMode', String(!darkMode));
    document.documentElement.classList.toggle('dark');
  };

  const handleChangeLanguage = (newLang: 'en' | 'es') => {
    setLang(newLang);
    localStorage.setItem('lang', newLang);
    setShowLangMenu(false);
  };

  const handleCambiarVista = (vista: Vista) => {
    setVistaActual(vista);
    localStorage.setItem('vista', vista);
  };

  const handleEntrarApp = () => {
    handleCambiarVista('dashboard');
  };

  const handleRegar = (id: number) => {
    setPlantas(plantas.map(p => 
      p.id === id 
        ? { ...p, ultimoRiego: new Date().toISOString() }
        : p
    ));
  };

  const handleAbrirModal = (planta?: Planta) => {
    setPlantaEditar(planta || null);
    setModalAbierto(true);
  };

  const handleGuardarPlanta = (plantaData: Omit<Planta, 'id'>) => {
    // Asegurar que estadoSalud sea válido
    const plantaConEstado = {
      ...plantaData,
      estadoSalud: plantaData.estadoSalud || 'healthy' as const
    };

    if (plantaEditar) {
      // Editar planta existente
      setPlantas(plantas.map(p => 
        p.id === plantaEditar.id 
          ? { ...plantaConEstado, id: plantaEditar.id }
          : p
      ));
    } else {
      // Agregar nueva planta
      const nuevaPlanta: Planta = {
        ...plantaConEstado,
        id: generarId()
      };
      setPlantas([...plantas, nuevaPlanta]);
    }
    setModalAbierto(false);
    setPlantaEditar(null);
  };

  const handleEliminar = (id: number) => {
    if (window.confirm(t('confirm_delete'))) {
      setPlantas(plantas.filter(p => p.id !== id));
    }
  };

  const handleClickPlanta = (planta: Planta) => {
    handleAbrirModal(planta);
  };

  // Loading
  if (cargando) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Sprout className="w-16 h-16 mx-auto text-green-600 animate-pulse mb-4" />
          <p className="text-gray-600 dark:text-gray-400">{t('loading')}</p>
        </div>
      </div>
    );
  }

  // Landing page
  if (vistaActual === 'landing') {
    return <Landing onEntrar={handleEntrarApp} />;
  }

  const stats = calcularEstadisticas(plantas);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* SIDEBAR */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-green-700 to-green-900 dark:from-gray-800 dark:to-gray-900 text-white transition-all duration-300 flex flex-col border-r border-green-800 dark:border-gray-700`}>
        {/* Header */}
        <div className="p-6 flex items-center justify-between border-b border-white/10">
          {sidebarOpen && (
            <div>
              <h1 className="text-2xl font-bold">{t('app_title')}</h1>
              <p className="text-xs text-white/60">{t('app_version')}</p>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title={t('toggle_sidebar')}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <NavItem
            icon={<Home className="w-5 h-5" />}
            label={t('dashboard')}
            active={vistaActual === 'dashboard'}
            onClick={() => handleCambiarVista('dashboard')}
            collapsed={!sidebarOpen}
          />
          <NavItem
            icon={<Sprout className="w-5 h-5" />}
            label={t('my_plants')}
            active={vistaActual === 'mis-plantas'}
            onClick={() => handleCambiarVista('mis-plantas')}
            collapsed={!sidebarOpen}
          />
          <NavItem
            icon={<Calendar className="w-5 h-5" />}
            label={t('calendar')}
            active={vistaActual === 'calendario'}
            onClick={() => handleCambiarVista('calendario')}
            collapsed={!sidebarOpen}
          />
          <NavItem
            icon={<BookOpen className="w-5 h-5" />}
            label={t('database')}
            active={vistaActual === 'base-datos'}
            onClick={() => handleCambiarVista('base-datos')}
            collapsed={!sidebarOpen}
          />
          <NavItem
            icon={<Settings className="w-5 h-5" />}
            label={t('settings')}
            active={vistaActual === 'configuracion'}
            onClick={() => handleCambiarVista('configuracion')}
            collapsed={!sidebarOpen}
          />
          <NavItem
            icon={<HelpCircle className="w-5 h-5" />}
            label={t('help')}
            active={false}
            onClick={() => alert('Help section coming soon!')}
            collapsed={!sidebarOpen}
          />
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          {sidebarOpen && (
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Plant Lover</p>
                <p className="text-xs text-white/60">Free Plan</p>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* HEADER */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t('welcome')}
              </h2>
            </div>

            {/* Search */}
            <div className="flex items-center gap-4">
              {(vistaActual === 'dashboard' || vistaActual === 'mis-plantas') && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder={t('search_placeholder')}
                    className="pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 outline-none w-64"
                  />
                </div>
              )}

              {/* Actions */}
              <button
                onClick={toggleDarkMode}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title={darkMode ? 'Light Mode' : 'Dark Mode'}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Language selector */}
              <div className="relative">
                <button
                  onClick={() => setShowLangMenu(!showLangMenu)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2"
                  title={t('language')}
                >
                  <Globe className="w-5 h-5" />
                  <span className="text-sm font-medium">{lang.toUpperCase()}</span>
                </button>
                
                {showLangMenu && (
                  <div className="absolute right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                    <button
                      onClick={() => handleChangeLanguage('es')}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      🇪🇸 Español
                    </button>
                    <button
                      onClick={() => handleChangeLanguage('en')}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      🇬🇧 English
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => handleAbrirModal()}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-medium transition-all shadow-lg"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">{t('add_new_plant')}</span>
              </button>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto p-6">
          {vistaActual === 'dashboard' && (
            <div className="space-y-6 animate-fade-in">
              {/* Estadísticas */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                  title={t('total_plants')} 
                  value={stats.total.toString()} 
                  change={t('active')} 
                  icon={<Sprout className="w-6 h-6" />} 
                  color="green" 
                />
                <StatCard 
                  title={t('needs_water')} 
                  value={stats.necesitanRiego.toString()} 
                  change={t('today')} 
                  icon={<AlertTriangle className="w-6 h-6" />} 
                  color="red" 
                />
                <StatCard 
                  title={t('healthy')} 
                  value={stats.saludables.toString()} 
                  change={`${stats.porcentajeSaludables}%`} 
                  icon={<TrendingUp className="w-6 h-6" />} 
                  color="green" 
                  positive 
                />
                <StatCard 
                  title={t('needs_attention')} 
                  value={stats.necesitanAtencion.toString()} 
                  change={t('check_now')} 
                  icon={<AlertTriangle className="w-6 h-6" />} 
                  color="yellow" 
                />
              </div>

              {/* Plantas */}
              {plantasFiltradas.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border-2 border-dashed border-gray-300 dark:border-gray-700">
                  <Sprout className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {t('no_plants')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {t('add_first')}
                  </p>
                  <button 
                    onClick={() => handleAbrirModal()}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium"
                  >
                    {t('add_new_plant')}
                  </button>
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                    {t('your_plants')}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {plantasFiltradas.map(p => (
                      <PlantCard 
                        key={p.id} 
                        planta={p} 
                        onRegar={handleRegar} 
                        onEditar={handleAbrirModal}
                        onEliminar={handleEliminar}
                        onClick={handleClickPlanta}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {vistaActual === 'mis-plantas' && (
            <div className="animate-fade-in">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
                {t('my_plants')}
              </h2>
              {plantasFiltradas.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center">
                  <Sprout className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {t('no_plants')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {t('add_first')}
                  </p>
                  <button 
                    onClick={() => handleAbrirModal()}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium"
                  >
                    {t('add_new_plant')}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {plantasFiltradas.map(p => (
                    <PlantCard 
                      key={p.id} 
                      planta={p} 
                      onRegar={handleRegar} 
                      onEditar={handleAbrirModal}
                      onEliminar={handleEliminar}
                      onClick={handleClickPlanta}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {vistaActual === 'calendario' && (
            <VistaCalendario plantas={plantas} onRegar={handleRegar} />
          )}

          {vistaActual === 'base-datos' && (
            <PlaceholderView 
              icon={<BookOpen className="w-16 h-16" />}
              title={t('database')}
              subtitle={t('view_in_development')}
            />
          )}

          {vistaActual === 'configuracion' && (
            <PlaceholderView 
              icon={<Settings className="w-16 h-16" />}
              title={t('settings')}
              subtitle={t('view_in_development')}
            />
          )}
        </main>
      </div>

      {/* MODAL */}
      {modalAbierto && (
        <PlantDetailModal
          planta={plantaEditar}
          onGuardar={handleGuardarPlanta}
          onCerrar={() => {
            setModalAbierto(false);
            setPlantaEditar(null);
          }}
        />
      )}
    </div>
  );
}