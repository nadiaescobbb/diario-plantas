import { useState, useEffect } from 'react';
import { Planta } from '../lib/types';
import {
  cargarPlantas,
  guardarPlantas,
  determinarEstadoSalud,
  generarId
} from '../lib/utils';

export function usePlants() {
  const [plantas, setPlantas] = useState<Planta[]>([]);
  const [cargando, setCargando] = useState(true);

  // Cargar plantas al inicio
  useEffect(() => {
    const plantasGuardadas = cargarPlantas();
    setPlantas(plantasGuardadas);
    setCargando(false);
  }, []);

  // Guardar plantas cuando cambien
  useEffect(() => {
    if (!cargando && plantas.length > 0) {
      guardarPlantas(plantas);
    }
  }, [plantas, cargando]);

  // Regar planta
  const regarPlanta = (id: number) => {
    setPlantas(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          ultimoRiego: new Date().toISOString(),
          estadoSalud: 'healthy' as const
        };
      }
      return p;
    }));
  };

  // Eliminar planta
  const eliminarPlanta = (id: number) => {
    setPlantas(prev => prev.filter(p => p.id !== id));
  };

  // Agregar planta
  const agregarPlanta = (plantaData: Omit<Planta, 'id'>) => {
    const nuevaPlanta: Planta = {
      ...plantaData,
      id: generarId(),
      estadoSalud: determinarEstadoSalud({ ...plantaData, id: 0 } as Planta)
    };
    setPlantas(prev => [...prev, nuevaPlanta]);
  };

  // Editar planta
  const editarPlanta = (id: number, plantaData: Omit<Planta, 'id'>) => {
    setPlantas(prev => prev.map(p =>
      p.id === id ? { ...plantaData, id } : p
    ));
  };

  return {
    plantas,
    cargando,
    regarPlanta,
    eliminarPlanta,
    agregarPlanta,
    editarPlanta
  };
}