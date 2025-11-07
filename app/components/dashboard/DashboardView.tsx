'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Sprout, AlertTriangle, TrendingUp, Plus } from 'lucide-react';
import { Planta } from '@/app/lib/types';
import StatCard from './StatCard';
import CardPlanta from '../CardPlanta';

interface DashboardViewProps {
  plantas: Planta[];
  stats: {
    total: number;
    necesitanRiego: number;
    saludables: number;
    necesitanAtencion: number;
    porcentajeSaludables: number;
  };
  onRegar: (id: number) => void;
  onEditar: (planta: Planta) => void;
  onEliminar: (id: number) => void;
  onAbrirDetalle: (planta: Planta) => void;
  onAddPlant: () => void;
  onViewAll: () => void;
}

export default function DashboardView({
  plantas,
  stats,
  onRegar,
  onEditar,
  onEliminar,
  onAbrirDetalle,
  onAddPlant,
  onViewAll
}: DashboardViewProps) {
  const { t } = useTranslation();

  if (plantas.length === 0) {
    return <EmptyState onAddPlant={onAddPlant} t={t} />;
  }

  return (
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
      <div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          {t('stats.yourPlants')}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {plantas.slice(0, 6).map(planta => (
            <CardPlanta
              key={planta.id}
              planta={planta}
              onRegar={onRegar}
              onEditar={onEditar}
              onEliminar={onEliminar}
              onClick={onAbrirDetalle}
            />
          ))}
        </div>
        {plantas.length > 6 && (
          <div className="mt-6 text-center">
            <button
              onClick={onViewAll}
              className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-all"
            >
              {t('stats.viewAll', { count: plantas.length })}
            </button>
          </div>
        )}
      </div>
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