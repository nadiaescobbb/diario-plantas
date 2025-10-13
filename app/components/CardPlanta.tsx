import React from 'react';
import { Edit2, Trash2, Droplet, Sprout } from 'lucide-react';
import { Planta } from '../types';
import { calcularDiasParaRiego, obtenerEstadoRiego } from '../utils';

interface CardPlantaProps {
  planta: Planta;
  onEditar: (planta: Planta) => void;
  onEliminar: (id: number) => void;
  onRegar: (id: number) => void;
}

export default function CardPlanta({ 
  planta, 
  onEditar, 
  onEliminar, 
  onRegar 
}: CardPlantaProps) {
  const diasRiego = calcularDiasParaRiego(
    planta.ultimoRiego, 
    planta.frecuenciaRiego || 7
  );
  const estadoRiego = obtenerEstadoRiego(diasRiego);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden group border border-gray-100 dark:border-gray-700">
      {/* Imagen */}
      <div className="relative h-48 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-gray-700 dark:to-gray-600 overflow-hidden">
        {planta.foto ? (
          <img 
            src={planta.foto} 
            alt={planta.nombre} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Sprout className="w-20 h-20 text-green-400 dark:text-green-500 opacity-50" />
          </div>
        )}
        
        {/* Badge de riego */}
        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm ${estadoRiego.bg} ${estadoRiego.color}`}>
          <Droplet className="w-4 h-4 inline mr-1" />
          {estadoRiego.texto}
        </div>
      </div>

      {/* Contenido */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
              {planta.nombre}
            </h3>
            <span className="inline-block px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs rounded-full">
              {planta.tipo}
            </span>
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
          {planta.notas || "Sin notas"}
        </p>

        <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          <p>Plantada: {new Date(planta.fechaSiembra).toLocaleDateString()}</p>
          <p>Riego cada: {planta.frecuenciaRiego || 7} días</p>
        </div>

        {/* Acciones */}
        <div className="flex gap-2">
          <button
            onClick={() => onRegar(planta.id)}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
          >
            <Droplet className="w-4 h-4" />
            Regar
          </button>
          <button
            onClick={() => onEditar(planta)}
            className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEliminar(planta.id)}
            className="p-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}