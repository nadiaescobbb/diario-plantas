'use client';

import React from 'react';
import { Droplet, Edit2, Trash2, MapPin, Calendar as CalendarIcon } from 'lucide-react';
import { Planta, EstadoSalud } from '../lib/types';
import { 
  calcularDiasParaRiego, 
  obtenerEstadoRiego, 
  obtenerBadgeEstadoSalud,
  formatearFecha 
} from '../lib/utils';

interface PlantCardProps {
  planta: Planta;
  onRegar: (id: number) => void;
  onEditar: (planta: Planta) => void;
  onEliminar: (id: number) => void;
  onClick?: (planta: Planta) => void;
}

export default function PlantCard({ 
  planta, 
  onRegar, 
  onEditar, 
  onEliminar,
  onClick 
}: PlantCardProps) {
  const diasRiego = calcularDiasParaRiego(planta.ultimoRiego, planta.frecuenciaRiego);
  const estadoRiego = obtenerEstadoRiego(diasRiego);
  
  // Asegurar que estadoSalud sea válido
  const estadoSaludValido: EstadoSalud = 
    planta.estadoSalud === 'healthy' || 
    planta.estadoSalud === 'needs-attention' || 
    planta.estadoSalud === 'critical' 
      ? planta.estadoSalud 
      : 'healthy';
  
  const estadoSalud = obtenerBadgeEstadoSalud(estadoSaludValido);

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 group cursor-pointer"
      onClick={() => onClick?.(planta)}
    >
      {/* Imagen */}
      <div className="relative h-56 overflow-hidden bg-gray-100 dark:bg-gray-700">
        {planta.foto ? (
          <img 
            src={planta.foto} 
            alt={planta.nombre}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-6xl">🌿</div>
          </div>
        )}
        
        {/* Badge de estado de salud */}
        <div className={`absolute top-3 left-3 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm flex items-center gap-1.5 ${estadoSalud.bg}`}>
          <span className={`w-2 h-2 rounded-full ${estadoSalud.dot}`}></span>
          <span className={estadoSalud.color}>{estadoSalud.texto}</span>
        </div>

        {/* Badge de riego */}
        <div className={`absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm ${estadoRiego.badge} flex items-center gap-1`}>
          <Droplet className="w-3 h-3" />
          <span>{estadoRiego.texto}</span>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-5">
        {/* Nombre y tipo */}
        <div className="mb-3">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">
            {planta.nombre}
          </h3>
          {planta.nombreCientifico && (
            <p className="text-sm text-gray-500 dark:text-gray-400 italic line-clamp-1">
              {planta.nombreCientifico}
            </p>
          )}
          <span className="inline-block mt-2 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
            {planta.tipo}
          </span>
        </div>

        {/* Info rápida */}
        <div className="space-y-2 mb-4 text-sm text-gray-600 dark:text-gray-400">
          {planta.ubicacion && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="line-clamp-1">{planta.ubicacion}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Droplet className="w-4 h-4 flex-shrink-0" />
            <span>Water every {planta.frecuenciaRiego} days</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 flex-shrink-0" />
            <span>Last watered: {formatearFecha(planta.ultimoRiego)}</span>
          </div>
        </div>

        {/* Notas (preview) */}
        {planta.notas && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
            {planta.notas}
          </p>
        )}

        {/* Acciones */}
        <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRegar(planta.id);
            }}
            disabled={diasRiego > 0}
            className={`flex-1 py-2.5 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
              diasRiego === 0
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
            }`}
            type="button"
          >
            <Droplet className="w-4 h-4" />
            <span className="hidden sm:inline">
              {diasRiego === 0 ? 'Water Now' : 'Watered'}
            </span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEditar(planta);
            }}
            className="p-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-xl transition-all"
            type="button"
            title="Edit plant"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEliminar(planta.id);
            }}
            className="p-2.5 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl transition-all"
            type="button"
            title="Delete plant"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}