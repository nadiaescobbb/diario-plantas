// ============================================
// UTILIDADES COMPLETAS
// ============================================

import { Planta, EstadoSalud, AccionCuidado } from './types-completo';

// Calcular días hasta próximo riego
export const calcularDiasParaRiego = (
  ultimoRiego: string, 
  frecuencia: number
): number => {
  if (!ultimoRiego) return 0;
  const ultimo = new Date(ultimoRiego);
  const hoy = new Date();
  const diff = Math.floor((hoy.getTime() - ultimo.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, frecuencia - diff);
};

// Obtener estado de riego con colores
export const obtenerEstadoRiego = (dias: number) => {
  if (dias === 0) {
    return { 
      texto: "Water Today", 
      color: "text-red-600 dark:text-red-400", 
      bg: "bg-red-50 dark:bg-red-900/20",
      badge: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
    };
  }
  if (dias === 1) {
    return { 
      texto: "Water Tomorrow", 
      color: "text-orange-600 dark:text-orange-400", 
      bg: "bg-orange-50 dark:bg-orange-900/20",
      badge: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400"
    };
  }
  if (dias <= 3) {
    return { 
      texto: `Water in ${dias} days`, 
      color: "text-yellow-600 dark:text-yellow-400", 
      bg: "bg-yellow-50 dark:bg-yellow-900/20",
      badge: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
    };
  }
  return { 
    texto: `Water in ${dias} days`, 
    color: "text-green-600 dark:text-green-400", 
    bg: "bg-green-50 dark:bg-green-900/20",
    badge: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
  };
};

// Determinar estado de salud de la planta
export const determinarEstadoSalud = (
  planta: Planta
): EstadoSalud => {
  const diasParaRiego = calcularDiasParaRiego(planta.ultimoRiego, planta.frecuenciaRiego);
  
  // Si necesita riego urgente
  if (diasParaRiego === 0) {
    return 'needs-attention';
  }
  
  // Si está atrasado en riego (días negativos)
  if (diasParaRiego < 0) {
    return 'critical';
  }
  
  return 'healthy';
};

// Obtener badge de estado de salud
export const obtenerBadgeEstadoSalud = (estado: EstadoSalud) => {
  switch (estado) {
    case 'healthy':
      return {
        texto: 'Healthy',
        color: 'text-green-700 dark:text-green-400',
        bg: 'bg-green-100 dark:bg-green-900/30',
        dot: 'bg-green-500'
      };
    case 'needs-attention':
      return {
        texto: 'Needs Attention',
        color: 'text-yellow-700 dark:text-yellow-400',
        bg: 'bg-yellow-100 dark:bg-yellow-900/30',
        dot: 'bg-yellow-500'
      };
    case 'critical':
      return {
        texto: 'Critical',
        color: 'text-red-700 dark:text-red-400',
        bg: 'bg-red-100 dark:bg-red-900/30',
        dot: 'bg-red-500'
      };
  }
};

// Calcular estadísticas del dashboard
export const calcularEstadisticas = (plantas: Planta[]) => {
  const total = plantas.length;
  const necesitanRiego = plantas.filter(p => 
    calcularDiasParaRiego(p.ultimoRiego, p.frecuenciaRiego) === 0
  ).length;
  const saludables = plantas.filter(p => 
    determinarEstadoSalud(p) === 'healthy'
  ).length;
  const necesitanAtencion = plantas.filter(p => 
    determinarEstadoSalud(p) === 'needs-attention' || 
    determinarEstadoSalud(p) === 'critical'
  ).length;

  return {
    total,
    necesitanRiego,
    saludables,
    necesitanAtencion,
    porcentajeSaludables: total > 0 ? Math.round((saludables / total) * 100) : 0
  };
};

// Formatear fecha
export const formatearFecha = (fecha: string): string => {
  const date = new Date(fecha);
  const hoy = new Date();
  const ayer = new Date(hoy);
  ayer.setDate(ayer.getDate() - 1);

  // Si es hoy
  if (date.toDateString() === hoy.toDateString()) {
    return 'Today';
  }
  
  // Si es ayer
  if (date.toDateString() === ayer.toDateString()) {
    return 'Yesterday';
  }

  // Calcular días atrás
  const diffTime = Math.abs(hoy.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 7) {
    return `${diffDays} days ago`;
  }
  
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  }

  return date.toLocaleDateString();
};

// Obtener ícono según tipo de acción
export const obtenerIconoAccion = (tipo: string) => {
  const iconos: Record<string, string> = {
    riego: '💧',
    fertilizacion: '🌱',
    poda: '✂️',
    trasplante: '🪴',
    tratamiento: '💊',
    movimiento: '☀️',
    revision: '🔍'
  };
  return iconos[tipo] || '📝';
};

// Obtener plantas que necesitan riego hoy
export const obtenerPlantasParaRegarHoy = (plantas: Planta[]): Planta[] => {
  return plantas.filter(p => 
    calcularDiasParaRiego(p.ultimoRiego, p.frecuenciaRiego) === 0
  );
};

// Obtener próximos cuidados (ordenados por urgencia)
export const obtenerProximosCuidados = (plantas: Planta[]): Planta[] => {
  return [...plantas]
    .map(p => ({
      ...p,
      diasParaRiego: calcularDiasParaRiego(p.ultimoRiego, p.frecuenciaRiego)
    }))
    .sort((a, b) => a.diasParaRiego - b.diasParaRiego);
};

// Generar ID único
export const generarId = (): number => {
  return Date.now() + Math.floor(Math.random() * 1000);
};

// Validar URL de imagen
export const esUrlValida = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Plantas de ejemplo para demo
export const PLANTAS_EJEMPLO: Omit<Planta, 'id'>[] = [
  {
    nombre: 'Monstera Deliciosa',
    nombreCientifico: 'Monstera deliciosa',
    tipo: 'Monstera',
    fechaAdquisicion: '2024-01-15',
    ubicacion: 'Living Room',
    foto: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800',
    notas: 'Beautiful large leaves, needs indirect sunlight',
    frecuenciaRiego: 7,
    necesidadLuz: 'bright-indirect',
    estadoSalud: 'healthy',
    ultimoRiego: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    nombre: 'Ficus Lyrata',
    nombreCientifico: 'Ficus lyrata',
    tipo: 'Ficus',
    fechaAdquisicion: '2024-02-10',
    ubicacion: 'Bedroom',
    foto: 'https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=800',
    notas: 'Fiddle leaf fig, sensitive to overwatering',
    frecuenciaRiego: 10,
    necesidadLuz: 'bright-indirect',
    estadoSalud: 'healthy',
    ultimoRiego: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    nombre: 'Snake Plant',
    nombreCientifico: 'Sansevieria trifasciata',
    tipo: 'Snake Plant',
    fechaAdquisicion: '2023-11-20',
    ubicacion: 'Office',
    foto: 'https://images.unsplash.com/photo-1593482892290-f54927ae1bb6?w=800',
    notas: 'Very low maintenance, drought tolerant',
    frecuenciaRiego: 14,
    necesidadLuz: 'low',
    estadoSalud: 'healthy',
    ultimoRiego: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    nombre: 'Pothos',
    nombreCientifico: 'Epipremnum aureum',
    tipo: 'Pothos',
    fechaAdquisicion: '2024-03-01',
    ubicacion: 'Kitchen',
    foto: 'https://images.unsplash.com/photo-1632207691143-643e2a9a9361?w=800',
    notas: 'Easy care, trailing vine',
    frecuenciaRiego: 7,
    necesidadLuz: 'medium',
    estadoSalud: 'healthy',
    ultimoRiego: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  }
];