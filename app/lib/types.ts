// ============================================
// TIPOS CONSOLIDADOS - DIARIO DE PLANTAS
// ============================================

// ===== PLANTA =====
export interface Planta {
  id: number;
  nombre: string;
  nombreCientifico?: string;
  tipo: TipoPlanta;
  fechaAdquisicion: string;
  ubicacion: string;
  foto: string;
  notas: string;
  
  // Configuración de cuidados
  frecuenciaRiego: number; // días
  frecuenciaFertilizacion?: number; // días
  necesidadLuz: NivelLuz;
  temperaturaMin?: number;
  temperaturaMax?: number;
  humedad?: NivelHumedad;
  
  // Estado actual
  estadoSalud: EstadoSalud;
  ultimoRiego: string;
  ultimaFertilizacion?: string;
  ultimaRevision?: string;
}

// ===== HISTORIAL DE ACCIONES =====
export interface AccionCuidado {
  id: number;
  plantaId: number;
  tipo: TipoAccion;
  fecha: string;
  notas?: string;
  cantidad?: string; // ej: "2 cups of water"
}

export type TipoAccion = 
  | 'riego' 
  | 'fertilizacion' 
  | 'poda' 
  | 'trasplante' 
  | 'tratamiento' 
  | 'movimiento'
  | 'revision';

// ===== TIPOS DE PLANTA =====
export type TipoPlanta = 
  | 'Monstera'
  | 'Ficus'
  | 'Pothos'
  | 'Snake Plant'
  | 'ZZ Plant'
  | 'Philodendron'
  | 'Calathea'
  | 'Succulent'
  | 'Cactus'
  | 'Orchid'
  | 'Fern'
  | 'Palm'
  | 'Other';

export const TIPOS_PLANTA: TipoPlanta[] = [
  'Monstera',
  'Ficus',
  'Pothos',
  'Snake Plant',
  'ZZ Plant',
  'Philodendron',
  'Calathea',
  'Succulent',
  'Cactus',
  'Orchid',
  'Fern',
  'Palm',
  'Other'
];

// ===== ESTADOS =====
export type EstadoSalud = 
  | 'healthy' 
  | 'needs-attention' 
  | 'critical';

export type NivelLuz = 
  | 'low' 
  | 'medium' 
  | 'bright-indirect' 
  | 'direct';

export type NivelHumedad = 
  | 'low' 
  | 'medium' 
  | 'high';

// ===== ENFERMEDADES Y PLAGAS =====
export interface Enfermedad {
  id: string;
  nombre: string;
  tipo: 'fungal' | 'bacterial' | 'viral' | 'pest';
  descripcion: string;
  sintomas: string[];
  tratamiento: string[];
  prevencion: string[];
  imagenes: string[];
  severidad: 'low' | 'medium' | 'high';
}

// ===== RECORDATORIOS =====
export interface Recordatorio {
  id: number;
  plantaId: number;
  tipo: TipoAccion;
  fechaProgramada: string;
  completado: boolean;
  notas?: string;
}

// ===== CONFIGURACIÓN =====
export interface ConfigNotificaciones {
  habilitadas: boolean;
  tipo: 'email' | 'push' | 'sms';
  frecuencia: 'daily' | 'weekly';
  diasAntes: number;
}

export type Vista = 
  | 'landing'
  | 'dashboard' 
  | 'mis-plantas' 
  | 'calendario' 
  | 'base-datos'
  | 'configuracion';

// ===== CONFIGURACIÓN DE LA APP =====
export const CONFIG = {
  appName: "Plant Diary",
  version: "2.0.0",
  colors: {
    primary: "#2d5016",
    primaryLight: "#4a7c2b",
    secondary: "#22c55e",
    accent: "#86efac",
    warning: "#f59e0b",
    danger: "#ef4444",
  }
};

// ===== BASE DE DATOS DE ENFERMEDADES =====
export const ENFERMEDADES_COMUNES: Enfermedad[] = [
  {
    id: 'powdery-mildew',
    nombre: 'Powdery Mildew',
    tipo: 'fungal',
    descripcion: 'A common fungal disease affecting a wide variety of plants.',
    sintomas: [
      'White, powdery patches on leaves and stems',
      'Yellowing or drying of leaves',
      'Distorted or stunted growth of new shoots',
      'In severe cases, leaves may turn brown and drop off'
    ],
    tratamiento: [
      'Remove affected leaves immediately',
      'Apply neem oil or sulfur-based fungicide',
      'Improve air circulation around plants',
      'Water at base, avoid wetting leaves'
    ],
    prevencion: [
      'Ensure good air circulation',
      'Avoid overhead watering',
      'Don\'t overcrowd plants',
      'Remove debris regularly'
    ],
    imagenes: ['https://images.unsplash.com/photo-1585320806297-9794b3e4eeae'],
    severidad: 'medium'
  },
  {
    id: 'aphids',
    nombre: 'Aphids',
    tipo: 'pest',
    descripcion: 'Small sap-sucking insects and members of the superfamily Aphidoidea.',
    sintomas: [
      'Clusters of small insects on stems and leaves',
      'Sticky honeydew on leaves',
      'Yellowing or curling leaves',
      'Stunted growth'
    ],
    tratamiento: [
      'Spray with water to dislodge',
      'Use insecticidal soap',
      'Apply neem oil',
      'Introduce beneficial insects'
    ],
    prevencion: [
      'Regular inspection',
      'Keep plants healthy',
      'Remove weeds',
      'Use reflective mulch'
    ],
    imagenes: ['https://images.unsplash.com/photo-1580411857460-e1b28b5e45ce'],
    severidad: 'low'
  },
  {
    id: 'spider-mites',
    nombre: 'Spider Mites',
    tipo: 'pest',
    descripcion: 'Tiny arachnids that are a common pest of houseplants and garden plants.',
    sintomas: [
      'Fine webbing on undersides of leaves',
      'Yellow or bronze speckling on leaves',
      'Leaf drop',
      'Overall plant decline'
    ],
    tratamiento: [
      'Increase humidity',
      'Spray with water regularly',
      'Use miticide or neem oil',
      'Isolate affected plants'
    ],
    prevencion: [
      'Maintain humidity',
      'Regular misting',
      'Keep plants clean',
      'Quarantine new plants'
    ],
    imagenes: ['https://images.unsplash.com/photo-1523348837708-15d4a09cfac2'],
    severidad: 'medium'
  },
  
  {
    id: 'root-rot',
    nombre: 'Root Rot',
    tipo: 'fungal',
    descripcion: 'Fungal diseases that get their name from the dusty, rust-colored pustules.',
    sintomas: [
      'Wilting despite adequate watering',
      'Yellowing leaves',
      'Mushy, black roots',
      'Foul odor from soil'
    ],
    tratamiento: [
      'Remove plant from soil',
      'Cut away rotted roots',
      'Repot in fresh, well-draining soil',
      'Reduce watering frequency'
    ],
    prevencion: [
      'Use well-draining soil',
      'Don\'t overwater',
      'Ensure proper drainage',
      'Use appropriate pot size'
    ],
    imagenes: ['https://images.unsplash.com/photo-1466692476868-aef1dfb1e735'],
    severidad: 'high'
  }
];