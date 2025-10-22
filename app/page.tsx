import React, { useState, useEffect } from 'react';
import { 
  LayoutGrid, Sprout, Calendar, BookOpen, Settings, 
  HelpCircle, Plus, Search, Sun, Moon, User, LogOut,
  Bell, Home
} from 'lucide-react';

// Tipos
type Vista = 'dashboard' | 'mis-plantas' | 'calendario' | 'base-datos' | 'configuracion';

export default function DiariePlantasPro() {
  const [vistaActual, setVistaActual] = useState<Vista>('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const modoGuardado = localStorage.getItem('darkMode') === 'true';
    setDarkMode(modoGuardado);
    if (modoGuardado) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('darkMode', String(!darkMode));
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* SIDEBAR */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-[#2d5016] dark:bg-gray-800 text-white transition-all duration-300 flex flex-col`}>
        {/* Logo */}
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

        {/* Navigation */}
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

        {/* Add New Plant Button */}
        <div className="p-4 border-t border-white/10">
          <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" />
            {sidebarOpen && <span>Add New Plant</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Search */}
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

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg relative">
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button onClick={toggleDarkMode} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                {darkMode ? (
                  <Sun className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600" />
                )}
              </button>
              <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
              <button className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded-lg">
                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden md:block">Usuario</span>
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {vistaActual === 'dashboard' && <DashboardView />}
          {vistaActual === 'mis-plantas' && <MisPlantasView />}
          {vistaActual === 'calendario' && <CalendarioView />}
          {vistaActual === 'base-datos' && <BaseDatosView />}
          {vistaActual === 'configuracion' && <ConfiguracionView />}
        </main>
      </div>
    </div>
  );
}

// Componente NavItem
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
        active
          ? 'bg-white/10 text-white'
          : 'text-white/70 hover:bg-white/5 hover:text-white'
      }`}
      title={collapsed ? label : undefined}
    >
      {icon}
      {!collapsed && <span className="font-medium">{label}</span>}
    </button>
  );
}

// Vistas temporales
function DashboardView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Plants Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Welcome back, get an overview of your plants.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Plants" value="12" change="+2 this month" positive />
        <StatCard title="Needs Water" value="3" change="Today" />
        <StatCard title="Healthy" value="10" change="83%" positive />
        <StatCard title="Needs Attention" value="2" change="Check now" />
      </div>

      {/* Placeholder */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border-2 border-dashed border-gray-300 dark:border-gray-700">
        <Sprout className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Dashboard en construcción</h3>
        <p className="text-gray-600 dark:text-gray-400">Las funcionalidades completas se están implementando...</p>
      </div>
    </div>
  );
}

function MisPlantasView() {
  return (
    <div className="text-center py-20">
      <Sprout className="w-20 h-20 mx-auto text-gray-400 mb-4" />
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Vista Mis Plantas</h2>
      <p className="text-gray-600 dark:text-gray-400">En desarrollo...</p>
    </div>
  );
}

function CalendarioView() {
  return (
    <div className="text-center py-20">
      <Calendar className="w-20 h-20 mx-auto text-gray-400 mb-4" />
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Vista Calendario</h2>
      <p className="text-gray-600 dark:text-gray-400">En desarrollo...</p>
    </div>
  );
}

function BaseDatosView() {
  return (
    <div className="text-center py-20">
      <BookOpen className="w-20 h-20 mx-auto text-gray-400 mb-4" />
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Base de Datos de Plantas</h2>
      <p className="text-gray-600 dark:text-gray-400">En desarrollo...</p>
    </div>
  );
}

function ConfiguracionView() {
  return (
    <div className="text-center py-20">
      <Settings className="w-20 h-20 mx-auto text-gray-400 mb-4" />
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Configuración</h2>
      <p className="text-gray-600 dark:text-gray-400">En desarrollo...</p>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  positive?: boolean;
}

function StatCard({ title, value, change, positive }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{title}</p>
      <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{value}</h3>
      <p className={`text-sm ${positive ? 'text-green-600' : 'text-gray-500'}`}>{change}</p>
    </div>
  );
}
