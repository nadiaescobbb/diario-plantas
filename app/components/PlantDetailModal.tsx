'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, Droplet, Edit2, Trash2, Plus, MapPin, Calendar,
  Sun, Thermometer, Wind, Check
} from 'lucide-react';
import { Planta, AccionCuidado, TipoAccion } from '../lib/types';
import { 
  obtenerBadgeEstadoSalud, 
  formatearFecha, 
  obtenerIconoAccion,
  calcularDiasParaRiego,
  obtenerEstadoRiego
} from '../lib/utils';

interface PlantDetailModalProps {
  planta: Planta;
  historial: AccionCuidado[];
  onClose: () => void;
  onRegar: (id: number) => void;
  onAgregarAccion: (accion: Omit<AccionCuidado, 'id'>) => void;
  onEliminarAccion: (id: number) => void;
  onEditar: (planta: Planta) => void;
}

export default function PlantDetailModal({
  planta,
  historial,
  onClose,
  onRegar,
  onAgregarAccion,
  onEliminarAccion,
  onEditar
}: PlantDetailModalProps) {
  const [mostrarFormAccion, setMostrarFormAccion] = useState(false);
  const estadoSalud = obtenerBadgeEstadoSalud(planta.estadoSalud);
  const diasRiego = calcularDiasParaRiego(planta.ultimoRiego, planta.frecuenciaRiego);
  const estadoRiego = obtenerEstadoRiego(diasRiego);

  // Ordenar historial por fecha (más reciente primero)
  const historialOrdenado = [...historial]
    .filter(a => a.plantaId === planta.id)
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Panel */}
      <div className="absolute right-0 top-0 h-full w-full md:w-[600px] bg-white dark:bg-gray-800 shadow-2xl overflow-y-auto animate-slide-in">
        {/* Header con imagen */}
        <div className="relative h-64 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-gray-700 dark:to-gray-600">
          {planta.foto ? (
            <img 
              src={planta.foto} 
              alt={planta.nombre}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-8xl">🌿</div>
            </div>
          )}
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 rounded-full transition-all shadow-lg"
          >
            <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>

          {/* Plant name and status */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h2 className="text-3xl font-bold text-white mb-2">{planta.nombre}</h2>
            {planta.nombreCientifico && (
              <p className="text-white/80 italic mb-3">{planta.nombreCientifico}</p>
            )}
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${estadoSalud.bg} flex items-center gap-1.5`}>
                <span className={`w-2 h-2 rounded-full ${estadoSalud.dot}`}></span>
                <span className={estadoSalud.color}>{estadoSalud.texto}</span>
              </span>
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                {planta.tipo}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Quick Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => onRegar(planta.id)}
              disabled={diasRiego > 0}
              className={`flex-1 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                diasRiego === 0
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              }`}
            >
              <Droplet className="w-5 h-5" />
              {diasRiego === 0 ? 'Water Now' : `Watered (${estadoRiego.texto})`}
            </button>
            <button
              onClick={() => onEditar(planta)}
              className="px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl transition-all"
            >
              <Edit2 className="w-5 h-5" />
            </button>
          </div>

          {/* Plant Info */}
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-5 space-y-4">
            <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-4">Plant Information</h3>
            
            {planta.ubicacion && (
              <InfoRow icon={<MapPin />} label="Location" value={planta.ubicacion} />
            )}
            <InfoRow 
              icon={<Droplet />} 
              label="Watering" 
              value={`Every ${planta.frecuenciaRiego} days`} 
            />
            <InfoRow 
              icon={<Calendar />} 
              label="Acquired" 
              value={new Date(planta.fechaAdquisicion).toLocaleDateString()} 
            />
            {planta.necesidadLuz && (
              <InfoRow 
                icon={<Sun />} 
                label="Light" 
                value={planta.necesidadLuz.replace('-', ' ')} 
              />
            )}
            {(planta.temperaturaMin || planta.temperaturaMax) && (
              <InfoRow 
                icon={<Thermometer />} 
                label="Temperature" 
                value={`${planta.temperaturaMin || '?'}°C - ${planta.temperaturaMax || '?'}°C`} 
              />
            )}
            {planta.humedad && (
              <InfoRow 
                icon={<Wind />} 
                label="Humidity" 
                value={planta.humedad} 
              />
            )}
          </div>

          {/* Notes */}
          {planta.notas && (
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-3">Notes</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {planta.notas}
              </p>
            </div>
          )}

          {/* Care History */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 dark:text-white text-lg">Care History</h3>
              <button
                onClick={() => setMostrarFormAccion(!mostrarFormAccion)}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-all"
              >
                <Plus className="w-4 h-4" />
                Add Care Action
              </button>
            </div>

            {/* Form para agregar acción */}
            {mostrarFormAccion && (
              <FormAgregarAccion
                plantaId={planta.id}
                onAgregar={(accion) => {
                  onAgregarAccion(accion);
                  setMostrarFormAccion(false);
                }}
                onCancelar={() => setMostrarFormAccion(false)}
              />
            )}

            {/* Timeline */}
            {historialOrdenado.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-900/50 rounded-2xl">
                <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                <p className="text-gray-500 dark:text-gray-400">No care history yet</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">Start tracking your plant care actions</p>
              </div>
            ) : (
              <div className="space-y-3">
                {historialOrdenado.map((accion, index) => (
                  <TimelineItem
                    key={accion.id}
                    accion={accion}
                    isLast={index === historialOrdenado.length - 1}
                    onEliminar={onEliminarAccion}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

// Info Row Component
function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-gray-400 dark:text-gray-500 flex-shrink-0">
        {React.cloneElement(icon as React.ReactElement, { className: 'w-5 h-5' })}
      </div>
      <div className="flex-1">
        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</p>
        <p className="text-gray-900 dark:text-white font-medium capitalize">{value}</p>
      </div>
    </div>
  );
}

// Timeline Item Component
function TimelineItem({ 
  accion, 
  isLast, 
  onEliminar 
}: { 
  accion: AccionCuidado; 
  isLast: boolean;
  onEliminar: (id: number) => void;
}) {
  return (
    <div className="relative flex gap-4 group">
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-[19px] top-10 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
      )}

      {/* Icon */}
      <div className="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-xl relative z-10">
        {obtenerIconoAccion(accion.tipo)}
      </div>

      {/* Content */}
      <div className="flex-1 bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 group-hover:bg-gray-100 dark:group-hover:bg-gray-900/70 transition-colors">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="font-semibold text-gray-900 dark:text-white capitalize mb-1">
              {accion.tipo.replace('-', ' ')}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {formatearFecha(accion.fecha)}
            </p>
            {accion.cantidad && (
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                {accion.cantidad}
              </p>
            )}
            {accion.notas && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {accion.notas}
              </p>
            )}
          </div>
          <button
            onClick={() => {
              if (window.confirm('¿Eliminar esta acción del historial?')) {
                onEliminar(accion.id);
              }
            }}
            className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Form para agregar acción
function FormAgregarAccion({
  plantaId,
  onAgregar,
  onCancelar
}: {
  plantaId: number;
  onAgregar: (accion: Omit<AccionCuidado, 'id'>) => void;
  onCancelar: () => void;
}) {
  const [tipo, setTipo] = useState<TipoAccion>('riego');
  const [cantidad, setCantidad] = useState('');
  const [notas, setNotas] = useState('');

  const handleSubmit = () => {
    onAgregar({
      plantaId,
      tipo,
      fecha: new Date().toISOString(),
      cantidad: cantidad || undefined,
      notas: notas || undefined
    });
  };

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-4 space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Action Type
        </label>
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value as TipoAccion)}
          className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="riego">💧 Watered</option>
          <option value="fertilizacion">🌱 Fertilized</option>
          <option value="poda">✂️ Pruned</option>
          <option value="trasplante">🪴 Repotted</option>
          <option value="tratamiento">💊 Pest Control</option>
          <option value="movimiento">☀️ Moved</option>
          <option value="revision">🔍 Inspection</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Amount / Details (optional)
        </label>
        <input
          type="text"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
          placeholder="e.g., 2 cups of water"
          className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Notes (optional)
        </label>
        <textarea
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          placeholder="Any additional notes..."
          rows={2}
          className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={onCancelar}
          className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-all"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2"
        >
          <Check className="w-4 h-4" />
          Add Action
        </button>
      </div>
    </div>
  );
}