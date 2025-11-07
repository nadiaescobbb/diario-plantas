'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Sun, Moon, Plus } from 'lucide-react';
import { Vista } from '@/app/lib/types';
import LanguageSwitcher from '../LanguageSwitcher';

interface HeaderProps {
  vistaActual: Vista;
  plantasCount: number;
  plantasFiltradas: number;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onAddPlant: () => void;
  busqueda: string;
  onBusquedaChange: (value: string) => void;
}

export default function Header({
  vistaActual,
  plantasCount,
  plantasFiltradas,
  darkMode,
  onToggleDarkMode,
  onAddPlant,
  busqueda,
  onBusquedaChange
}: HeaderProps) {
  const { t } = useTranslation();

  // Títulos y subtítulos por vista
  const getViewInfo = () => {
    switch (vistaActual) {
      case 'dashboard':
        return {
          title: t('nav.dashboard'),
          subtitle: `${plantasCount} ${t('stats.active').toLowerCase()}`
        };
      case 'mis-plantas':
        return {
          title: t('nav.myPlants'),
          subtitle: `${plantasFiltradas} ${t('stats.active').toLowerCase()}`
        };
      case 'calendario':
        return {
          title: t('calendar.title'),
          subtitle: t('calendar.title')
        };
      case 'base-datos':
        return {
          title: t('database.title'),
          subtitle: t('database.comingSoon')
        };
      case 'configuracion':
        return {
          title: t('settings.title'),
          subtitle: t('settings.comingSoon')
        };
      default:
        return { title: '', subtitle: '' };
    }
  };

  const { title, subtitle } = getViewInfo();
  const showSearch = vistaActual === 'mis-plantas';
  const showAddButton = vistaActual === 'dashboard' || vistaActual === 'mis-plantas';

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Título y Subtítulo */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {title}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {subtitle}
          </p>
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-3">
          {/* Buscador (solo en mis-plantas) */}
          {showSearch && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => onBusquedaChange(e.target.value)}
                placeholder={t('plant.searchPlaceholder')}
                className="pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none w-64 text-gray-900 dark:text-white"
              />
            </div>
          )}

          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Dark mode toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
            title={darkMode ? t('common.lightMode') : t('common.darkMode')}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Add plant button */}
          {showAddButton && (
            <button
              onClick={onAddPlant}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all shadow-lg shadow-green-500/30"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">{t('plant.addPlant')}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}