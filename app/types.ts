export interface Planta {
  id: number;
  nombre: string;
  tipo: string;
  fechaSiembra: string;
  foto: string;
  notas: string;
  frecuenciaRiego: number;
  ultimoRiego: string;
}

export type Vista = 'galeria' | 'calendario';

export const TIPOS_PLANTA = [
  "Flor", 
  "Cactus", 
  "Suculenta", 
  "Árbol", 
  "Hierba", 
  "Arbusto"
] as const;

export const CONFIG = {
  appName: "Diario de Plantas",
  colors: {
    primary: "#4ade80",
    secondary: "#86efac",
    accent: "#22c55e"
  }
};