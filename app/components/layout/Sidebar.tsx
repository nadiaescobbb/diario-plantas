'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Home, LayoutGrid, Calendar, BookOpen, Settings, 
  Sprout, Menu 
} from 'lucide-react';
import { Vista } from '@/app/lib/types';

interface SidebarProps {
  vistaActual: Vista;
  onVistaChange: (vista: Vista) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ 
  vistaActual, 
  onVistaChange, 
  isOpen, 
  onToggle 
}: SidebarProps) {
  const { t } = useTranslation();

  return (
    <aside className={`${isOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-green-700 to-green-900 dark:from-gray-800 dark:to-gray-900 text-white transition-all duration-300 flex flex-col shadow-2xl`}>
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Sprout className="w-6 h-6" />
          </div>
          {isOpen && (
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
          onClick={() => onVistaChange('dashboard')}
          collapsed={!isOpen}
        />
        <NavItem 
          icon={<LayoutGrid className="w-5 h-5" />}
          label={t('nav.myPlants')}
          active={vistaActual === 'mis-plantas'}
          onClick={() => onVistaChange('mis-plantas')}
          collapsed={!isOpen}
        />
        <NavItem 
          icon={<Calendar className="w-5 h-5" />}
          label={t('nav.calendar')}
          active={vistaActual === 'calendario'}
          onClick={() => onVistaChange('calendario')}
          collapsed={!isOpen}
        />
        <NavItem 
          icon={<BookOpen className="w-5 h-5" />}
          label={t('nav.database')}
          active={vistaActual === 'base-datos'}
          onClick={() => onVistaChange('base-datos')}
          collapsed={!isOpen}
        />
        <NavItem 
          icon={<Settings className="w-5 h-5" />}
          label={t('nav.settings')}
          active={vistaActual === 'configuracion'}
          onClick={() => onVistaChange('configuracion')}
          collapsed={!isOpen}
        />
      </nav>

      {/* Toggle Button */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={onToggle}
          className="w-full py-2 px-3 bg-white/10 hover:bg-white/20 rounded-lg transition-all flex items-center justify-center gap-2"
          title={isOpen ? t('nav.collapse') : t('nav.expand')}
        >
          <Menu className="w-5 h-5" />
          {isOpen && <span className="text-sm">{t('nav.collapse')}</span>}
        </button>
      </div>
    </aside>
  );
}

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