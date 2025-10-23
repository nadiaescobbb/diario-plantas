'use client';

import React, { useState, useEffect } from 'react';
import { 
  LayoutGrid, Sprout, Calendar, BookOpen, Settings, 
  HelpCircle, Plus, Search, Sun, Moon, User, Bell, Home,
  TrendingUp, AlertTriangle
} from 'lucide-react';
import { Planta, AccionCuidado  } from './types-completo';
import { 
  calcularEstadisticas, 
  PLANTAS_EJEMPLO,
  generarId,
  determinarEstadoSalud
} from './utils-completo';
import PlantCard from './components/CardPlanta';
import PlantDetailModal from './components/PlantDetailModal';
import './i18n';
import { useTranslation } from 'react-i18next';


type Vista = 'dashboard' | 'mis-plantas' | 'calendario' | 'base-datos' | 'configuracion';

export default function DiariePlantasPro() {
  const [vistaActual, setVistaActual] = useState<Vista>('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [plantas, setPlantas] = useState<Planta[]>([]);
  const [cargando, setCargando] = useState(true);
  const [plantaSeleccionada, setPlantaSeleccionada] = useState<Planta | null>(null);
  const [historialCuidados, setHistorialCuidados] = useState<AccionCuidado[]>([]);
  const { t, i18n } = useTranslation();

  const handleChangeLanguage = (lang: string) => {
  i18n.changeLanguage(lang);
  localStorage.setItem("lang", lang);
};

  
  // Cargar plantas
  useEffect(() => {
    const plantasGuardadas = localStorage.getItem('plantas-pro');
    const modoOscuro = localStorage.getItem('darkMode') === 'true';
    
    if (plantasGuardadas) {
      setPlantas(JSON.parse(plantasGuardadas));
    } else {
      // Cargar plantas de ejemplo
      const plantasConId = PLANTAS_EJEMPLO.map(p => ({ ...p, id: generarId() }));
      setPlantas(plantasConId);
      localStorage.setItem('plantas-pro', JSON.stringify(plantasConId));
    }
    
    setDarkMode(modoOscuro);
    if (modoOscuro) {
      document.documentElement.classList.add('dark');
    }
    setCargando(false);
  }, []);

  // Cargar historial
  useEffect(() => {
  const historialGuardado = localStorage.getItem('historial-cuidados');
  if (historialGuardado) {
    setHistorialCuidados(JSON.parse(historialGuardado));
  }
}, []);

  // Guardar historial
  useEffect(() => {
  if (historialCuidados.length >= 0) {
    localStorage.setItem('historial-cuidados', JSON.stringify(historialCuidados));
  }
}, [historialCuidados]);

  // Guardar plantas
  useEffect(() => {
    if (!cargando && plantas.length >= 0) {
      localStorage.setItem('plantas-pro', JSON.stringify(plantas));
    }
  }, [plantas, cargando]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('darkMode', String(!darkMode));
    document.documentElement.classList.toggle('dark');
  };

  const handleRegar = (id: number) => {
    setPlantas(plantas.map(p => {
      if (p.id === id) {
        return {
          ...p,
          ultimoRiego: new Date().toISOString(),
          estadoSalud: determinarEstadoSalud({ ...p, ultimoRiego: new Date().toISOString() })
        };
      }
      return p;
    }));
  };

const handleEliminar = (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta planta?')) {
      setPlantas(plantas.filter(p => p.id !== id));
    }
  };

  const handleEditar = (planta: Planta) => {
    // Por ahora solo un alert, luego haremos el modal completo
    alert('Editar funcionalidad en desarrollo. Planta: ' + planta.nombre);
  };

  const handleClickPlanta = (planta: Planta) => {
  setPlantaSeleccionada(planta);
};

const handleAgregarAccion = (accion: Omit<AccionCuidado, 'id'>) => {
  const nuevaAccion: AccionCuidado = {
    ...accion,
    id: generarId()
  };
  setHistorialCuidados([...historialCuidados, nuevaAccion]);
  
  // Si es riego, actualizar la planta
  if (accion.tipo === 'riego') {
    handleRegar(accion.plantaId);
  }
};

const handleEliminarAccion = (id: number) => {
  setHistorialCuidados(historialCuidados.filter(a => a.id !== id));
};

  if (cargando) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Sprout className="w-16 h-16 mx-auto text-green-600 animate-pulse mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* SIDEBAR */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-[#2d5016] dark:bg-gray-800 text-white transition-all duration-300 flex flex-col`}>
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
              <Sprout className="w-6 h-6 text-[#2d5016]" />
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="font-bold text-lg">Diario de Plantas</h1>
                <p className="text-xs text-white/60">v2.0 Pro</p>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavItem
            icon={<Home className="w-5 h-5" />}
            label="Dashboard"
            active={vistaActual === 'dashboard'}
            onClick={() => setVistaActual('dashboard')}
            collapsed={!sidebarOpen}
          />
          <NavItem
            icon={<Sprout className="w-5 h-5" />}
            label="My Plants"
            active={vistaActual === 'mis-plantas'}
            onClick={() => setVistaActual('mis-plantas')}
            collapsed={!sidebarOpen}
          />
          <NavItem
            icon={<Calendar className="w-5 h-5" />}
            label="Calendar"
            active={vistaActual === 'calendario'}
            onClick={() => setVistaActual('calendario')}
            collapsed={!sidebarOpen}
          />
          <NavItem
            icon={<BookOpen className="w-5 h-5" />}
            label="Plant Database"
            active={vistaActual === 'base-datos'}
            onClick={() => setVistaActual('base-datos')}
            collapsed={!sidebarOpen}
          />
          
          <div className="pt-4 border-t border-white/10 mt-4">
            <NavItem
              icon={<Settings className="w-5 h-5" />}
              label="Settings"
              active={vistaActual === 'configuracion'}
              onClick={() => setVistaActual('configuracion')}
              collapsed={!sidebarOpen}
            />
            <NavItem
              icon={<HelpCircle className="w-5 h-5" />}
              label="Help"
              active={false}
              onClick={() => {}}
              collapsed={!sidebarOpen}
            />
          </div>
        </nav>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={() => alert('Agregar planta en desarrollo')}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            {sidebarOpen && <span>Add New Plant</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1 max-w-xl">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <LayoutGrid className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for a plant..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg relative">
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button onClick={toggleDarkMode} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
              </button>
              <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
              <button className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded-lg">
                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {vistaActual === 'dashboard' && (
            <DashboardView 
              plantas={plantas} 
              onRegar={handleRegar}
              onEditar={handleEditar}
              onEliminar={handleEliminar}
              onClickPlanta={handleClickPlanta}
            />
          )}
          {vistaActual === 'mis-plantas' && <MisPlantasView />}
          {vistaActual === 'calendario' && <CalendarioView />}
          {vistaActual === 'base-datos' && <BaseDatosView />}
          {vistaActual === 'configuracion' && <ConfiguracionView />}
        </main>
      </div>

                  {/* Modal de detalle */}
      {plantaSeleccionada && (
        <PlantDetailModal
          planta={plantaSeleccionada}
          historial={historialCuidados}
          onClose={() => setPlantaSeleccionada(null)}
          onRegar={handleRegar}
          onAgregarAccion={handleAgregarAccion}
          onEliminarAccion={handleEliminarAccion}
          onEditar={handleEditar}
        />
      )}
      
    </div>
  );
}

// NavItem Component
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

// Dashboard View
interface DashboardViewProps {
  plantas: Planta[];
  onRegar: (id: number) => void;
  onEditar: (planta: Planta) => void;
  onEliminar: (id: number) => void;
  onClickPlanta: (planta: Planta) => void;
}

function DashboardView({ plantas, onRegar, onEditar, onEliminar, onClickPlanta }: DashboardViewProps) {
  const stats = calcularEstadisticas(plantas);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Plants Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Welcome back, get an overview of your plants.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Plants" 
          value={stats.total.toString()} 
          change="Active" 
          icon={<Sprout className="w-6 h-6" />}
          color="green"
        />
        <StatCard 
          title="Needs Water" 
          value={stats.necesitanRiego.toString()} 
          change="Today" 
          icon={<AlertTriangle className="w-6 h-6" />}
          color="red"
        />
        <StatCard 
          title="Healthy" 
          value={stats.saludables.toString()} 
          change={`${stats.porcentajeSaludables}%`}
          icon={<TrendingUp className="w-6 h-6" />}
          color="green"
          positive
        />
        <StatCard 
          title="Needs Attention" 
          value={stats.necesitanAtencion.toString()} 
          change="Check now" 
          icon={<AlertTriangle className="w-6 h-6" />}
          color="yellow"
        />
      </div>

      {/* Plants Grid */}
      {plantas.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border-2 border-dashed border-gray-300 dark:border-gray-700">
          <Sprout className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No plants yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Add your first plant to get started</p>
          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium">
            Add New Plant
          </button>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Your Plants</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {plantas.map((planta) => (
              <PlantCard
                key={planta.id}
                planta={planta}
                onRegar={onRegar}
                onEditar={onEditar}
                onEliminar={onEliminar}
                onClick={onClickPlanta}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Stat Card Component
interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  color: 'green' | 'red' | 'yellow' | 'blue';
  positive?: boolean;
}

function StatCard({ title, value, change, icon, color, positive }: StatCardProps) {
  const colorClasses = {
    green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    red: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    yellow: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
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

// Placeholder Views
function MisPlantasView() {
  return <PlaceholderView icon={<Sprout className="w-20 h-20" />} title="Vista Mis Plantas" />;
}

function CalendarioView() {
  return <PlaceholderView icon={<Calendar className="w-20 h-20" />} title="Vista Calendario" />;
}

function BaseDatosView() {
  return <PlaceholderView icon={<BookOpen className="w-20 h-20" />} title="Base de Datos" />;
}

function ConfiguracionView() {
  return <PlaceholderView icon={<Settings className="w-20 h-20" />} title="Configuración" />;
}

function PlaceholderView({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="text-center py-20">
      <div className="mx-auto text-gray-400 mb-4">{icon}</div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{title}</h2>
      <p className="text-gray-600 dark:text-gray-400">En desarrollo...</p>
    </div>
  );
}



