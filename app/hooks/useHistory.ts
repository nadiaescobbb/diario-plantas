import { useState, useEffect } from 'react';
import { AccionCuidado } from '../lib/types';
import { cargarHistorial, guardarHistorial, generarId } from '../lib/utils';

export function useHistory() {
  const [historial, setHistorial] = useState<AccionCuidado[]>([]);
  const [cargando, setCargando] = useState(true);

  // Cargar historial al inicio
  useEffect(() => {
    const historialGuardado = cargarHistorial();
    setHistorial(historialGuardado);
    setCargando(false);
  }, []);

  // Guardar historial cuando cambie
  useEffect(() => {
    if (!cargando) {
      guardarHistorial(historial);
    }
  }, [historial, cargando]);

  // Agregar acción
  const agregarAccion = (accion: Omit<AccionCuidado, 'id'>) => {
    const nuevaAccion: AccionCuidado = {
      ...accion,
      id: generarId()
    };
    setHistorial(prev => [...prev, nuevaAccion]);
  };

  // Eliminar acción
  const eliminarAccion = (id: number) => {
    setHistorial(prev => prev.filter(h => h.id !== id));
  };

  // Limpiar historial de una planta
  const limpiarHistorialPlanta = (plantaId: number) => {
    setHistorial(prev => prev.filter(h => h.plantaId !== plantaId));
  };

  return {
    historial,
    cargando,
    agregarAccion,
    eliminarAccion,
    limpiarHistorialPlanta
  };
}