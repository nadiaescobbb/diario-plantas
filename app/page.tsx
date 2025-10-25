'use client';

import React, { useState, useEffect } from 'react';
import { 
  LayoutGrid, Sprout, Calendar, BookOpen, Settings, 
  HelpCircle, Plus, Search, Sun, Moon, User, Bell, Home,
  TrendingUp, AlertTriangle, Globe
} from 'lucide-react';

// Tipos
export interface Planta {
  id: number;
  nombre: string;
  nombreCientifico: string;
  tipo: string;
  ubicacion: string;
  foto: string;
  frecuenciaRiego: number;
  ultimoRiego: string;
  estadoSalud: 'excelente' | 'bueno' | 'necesita-atencion' | 'critico';
  notas: string;
}

type Vista = 'dashboard' | 'mis-plantas' | 'calendario' | 'base-datos' | 'configuracion';

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
    edit_in_dev: "Edit functionality in development. Plant: ",
    add_plant_dev: "Add plant in development",
    language: "Language",
    water: "Water",
    days_ago: "d ago"
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
    edit_in_dev: "Editar funcionalidad en desarrollo. Planta: ",
    add_plant_dev: "Agregar planta en desarrollo",
    language: "Idioma",
    water: "Regar",
    days_ago: "d atrás"
  }
};

// Utilidades
const generarId = () => Math.floor(Math.random() * 1000000);

const determinarEstadoSalud = (planta: Planta): Planta['estadoSalud'] => {
  const diasSinRiego = Math.floor(
    (new Date().getTime() - new Date(planta.ultimoRiego).getTime()) / (1000 * 60 * 60 * 24)
  );
  
  if (diasSinRiego > planta.frecuenciaRiego * 1.5) return 'critico';
  if (diasSinRiego > planta.frecuenciaRiego) return 'necesita-atencion';
  if (diasSinRiego > planta.frecuenciaRiego * 0.7) return 'bueno';
  return 'excelente';
};

const calcularEstadisticas = (plantas: Planta[]) => {
  const total = plantas.length;
  const necesitanRiego = plantas.filter(p => {
    const dias = Math.floor(
      (new Date().getTime() - new Date(p.ultimoRiego).getTime()) / (1000 * 60 * 60 * 24)
    );
    return dias >= p.frecuenciaRiego;
  }).length;
  
  const saludables = plantas.filter(p => 
    p.estadoSalud === 'excelente' || p.estadoSalud === 'bueno'
  ).length;
  
  const necesitanAtencion = plantas.filter(p => 
    p.estadoSalud === 'necesita-atencion' || p.estadoSalud === 'critico'
  ).length;
  
  return {
    total,
    necesitanRiego,
    saludables,
    necesitanAtencion,
    porcentajeSaludables: total > 0 ? Math.round((saludables / total) * 100) : 0
  };
};

// Ejemplo de plantas
const PLANTAS_EJEMPLO: Omit<Planta, 'id'>[] = [
  {
    nombre: 'Monstera Deliciosa',
    nombreCientifico: 'Monstera deliciosa',
    tipo: 'Interior',
    ubicacion: 'Sala',
    foto: 'https://cdn.pixabay.com/photo/2021/01/22/06/04/snake-plant-5939187_1280.jpg',
    frecuenciaRiego: 7,
    ultimoRiego: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    estadoSalud: 'bueno',
    notas: 'Le gusta la luz indirecta'
  },
  {
    nombre: 'Pothos',
    nombreCientifico: 'Epipremnum aureum',
    tipo: 'Interior',
    ubicacion: 'Oficina',
    foto: 'https://cdn.pixabay.com/photo/2020/03/24/13/38/pothos-4964432_1280.jpg',
    frecuenciaRiego: 5,
    ultimoRiego: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    estadoSalud: 'necesita-atencion',
    notas: 'Muy resistente'
  },
  {
    nombre: 'Suculenta Mix',
    nombreCientifico: 'Echeveria sp.',
    tipo: 'Suculenta',
    ubicacion: 'Ventana',
    foto: 'https://cdn.pixabay.com/photo/2017/09/18/15/38/succulent-2762590_1280.jpg',
    frecuenciaRiego: 14,
    ultimoRiego: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    estadoSalud: 'excelente',
    notas: 'Riego escaso'
  }
];

// Colores para tarjetas
const colorClasses = {
  green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
  red: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
  yellow: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
  blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
} as const;

type ColorKey = keyof typeof colorClasses;

// ====================
// COMPONENTES
// ====================

interface PlantCardProps {
  planta: Planta;
  onRegar: (id: number) => void;
  onClick: (planta: Planta) => void;
  t: (key: string) => string;
}

function PlantCard({ planta, onRegar, onClick, t }: PlantCardProps) {
  const diasSinRiego = Math.floor(
    (new Date().getTime() - new Date(planta.ultimoRiego).getTime()) / (1000 * 60 * 60 * 24)
  );

  const estadoColors = {
    'excelente': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    'bueno': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'necesita-atencion': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    'critico': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
  };

  return (
    <div 
      onClick={() => onClick(planta)}
      className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <img src={planta.foto} alt={planta.nombre} className="w-20 h-20 object-cover rounded-lg"/>
        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${estadoColors[planta.estadoSalud]}`}>
          {planta.estadoSalud}
        </span>
      </div>
      
      <h3 className="font-bold text-gray-900 dark:text-white mb-1">{planta.nombre}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 italic">{planta.nombreCientifico}</p>
      
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600 dark:text-gray-400">
          {diasSinRiego}{t('days_ago')}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRegar(planta.id);
          }}
          className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-medium transition-colors"
        >
          💧 {t('water')}
        </button>
      </div>
    </div>
  );
}

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

function NavItem({ icon, label, active, onClick, collapsed }: any) {
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

function PlaceholderView({ icon, title, subtitle }: any) {
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

export default function DiariePlantasPro() {
  const [vistaActual, setVistaActual] = useState<Vista>('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [plantas, setPlantas] = useState<Planta[]>([]);
  const [cargando, setCargando] = useState(true);
  const [lang, setLang] = useState<'en' | 'es'>('es');
  const [showLangMenu, setShowLangMenu] = useState(false);

  const t = (key: string) => translations[lang][key as keyof typeof translations.en] ?? key;

  useEffect(() => {
    const savedLang = (localStorage.getItem('lang') as 'en' | 'es') || 'es';
    const plantasGuardadas = localStorage.getItem('plantas-pro');
    const modoOscuro = localStorage.getItem('darkMode') === 'true';
    
    setLang(savedLang);
    
    if (plantasGuardadas) {
      setPlantas(JSON.parse(plantasGuardadas));
    } else {
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

  useEffect(() => {
    if (!cargando) localStorage.setItem('plantas-pro', JSON.stringify(plantas));
  }, [plantas, cargando]);

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

  const handleRegar = (id: number) => {
    setPlantas(plantas.map(p => {
      if (p.id === id) {
        const updated = { ...p, ultimoRiego: new Date().toISOString() };
        return { ...updated, estadoSalud: determinarEstadoSalud(updated) };
      }
      return p;
    }));
  };

  const handleEliminar = (id: number) => {
    if (window.confirm(t('confirm_delete'))) {
      setPlantas(plantas.filter(p => p.id !== id));
    }
  };

  const handleClickPlanta = (planta: Planta) => {
    console.log('Planta seleccionada:', planta);
  };

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

  const stats = calcularEstadisticas(plantas);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* SIDEBAR */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-[#2d5016] dark:bg-gray-800 text-white transition-all duration-300 flex flex-col`}>
        {/* ... aquí va todo tu código de sidebar y nav items ... */}
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* HEADER */}
        {/* ... código de header ... */}

        <main className="flex-1 overflow-y-auto p-6">
          {vistaActual === 'dashboard' ? (
            <div className="space-y-6">
              {/* Estadísticas */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title={t('total_plants')} value={stats.total.toString()} change={t('active')} icon={<Sprout className="w-6 h-6" />} color="green" />
                <StatCard title={t('needs_water')} value={stats.necesitanRiego.toString()} change={t('today')} icon={<AlertTriangle className="w-6 h-6" />} color="red" />
                <StatCard title={t('healthy')} value={stats.saludables.toString()} change={`${stats.porcentajeSaludables}%`} icon={<TrendingUp className="w-6 h-6" />} color="green" positive />
                <StatCard title={t('needs_attention')} value={stats.necesitanAtencion.toString()} change={t('check_now')} icon={<AlertTriangle className="w-6 h-6" />} color="yellow" />
              </div>

              {/* Plantas */}
              {plantas.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border-2 border-dashed border-gray-300 dark:border-gray-700">
                  <Sprout className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{t('no_plants')}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{t('add_first')}</p>
                  <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium">{t('add_new_plant')}</button>
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{t('your_plants')}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {plantas.map(p => (
                      <PlantCard key={p.id} planta={p} onRegar={handleRegar} onClick={handleClickPlanta} t={t} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <PlaceholderView icon={<BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />} title={t('view_in_development')} subtitle={t('view_in_development')} />
          )}
        </main>
      </div>
    </div>
  );
}
