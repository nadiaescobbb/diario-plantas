'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Sprout, Droplet } from 'lucide-react';
import { Planta } from '../lib/types';
import { calcularDiasParaRiego } from '../lib/utils';

interface VistaCalendarioProps {
  plantas: Planta[];
  onRegar: (id: number) => void;
}

interface PlantaConFecha extends Planta {
  fechaRiego: Date;
  diasRestantes: number;
}

export default function VistaCalendario({ plantas, onRegar }: VistaCalendarioProps) {
  const { t } = useTranslation();
  
  const proximosCuidados = plantas
    .map(p => {
      const dias = calcularDiasParaRiego(p.ultimoRiego, p.frecuenciaRiego || 7);
      const fechaRiego = new Date();
      fechaRiego.setDate(fechaRiego.getDate() + dias);
      return { ...p, fechaRiego, diasRestantes: dias };
    })
    .sort((a, b) => a.diasRestantes - b.diasRestantes);

  const cuidadosHoy = proximosCuidados.filter(p => p.diasRestantes === 0);
  const proximamente = proximosCuidados.filter(p => p.diasRestantes > 0 && p.diasRestantes <= 7);
  const despues = proximosCuidados.filter(p => p.diasRestantes > 7);

  const Seccion = ({ 
    titulo, 
    plantas, 
    color 
  }: { 
    titulo: string; 
    plantas: PlantaConFecha[]; 
    color: string;
  }) => (
    <div className="mb-8">
      <h3 className={`text-xl font-bold mb-4 ${color}`}>
        {titulo}
      </h3>
      {plantas.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 italic">
          {t('calendar.noScheduled')}
        </p>
      ) : (
        <div className="space-y-3">
          {plantas.map(p => (
            <div 
              key={p.id} 
              className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-between hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
                  <Sprout className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-white">
                    {p.nombre}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {p.diasRestantes === 0 
                      ? t('stats.today')
                      : t('calendar.in') + ' ' + p.diasRestantes + ' ' + (p.diasRestantes === 1 ? t('calendar.day') : t('calendar.days'))
                    }
                  </p>
                </div>
              </div>
              <button
                onClick={() => onRegar(p.id)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 flex-shrink-0"
              >
                <Droplet className="w-4 h-4" />
                <span className="hidden sm:inline">{t('actions.water')}</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
        {t('calendar.title')}
      </h2>
      
      <Seccion 
        titulo={t('calendar.waterToday')} 
        plantas={cuidadosHoy} 
        color="text-red-600 dark:text-red-400" 
      />
      
      <Seccion 
        titulo={t('calendar.next7Days')} 
        plantas={proximamente} 
        color="text-orange-600 dark:text-orange-400" 
      />
      
      <Seccion 
        titulo={t('calendar.later')} 
        plantas={despues} 
        color="text-green-600 dark:text-green-400" 
      />
    </div>
  );
}