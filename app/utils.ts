export const calcularDiasParaRiego = (
  ultimoRiego: string, 
  frecuencia: number
): number => {
  if (!ultimoRiego) return 0;
  const ultimo = new Date(ultimoRiego);
  const hoy = new Date();
  const diff = Math.floor(
    (hoy.getTime() - ultimo.getTime()) / (1000 * 60 * 60 * 24)
  );
  return Math.max(0, frecuencia - diff);
};

export const obtenerEstadoRiego = (dias: number) => {
  if (dias === 0) {
    return { 
      texto: "¡Regar hoy!", 
      color: "text-red-500", 
      bg: "bg-red-50 dark:bg-red-900/20" 
    };
  }
  if (dias === 1) {
    return { 
      texto: "Regar mañana", 
      color: "text-orange-500", 
      bg: "bg-orange-50 dark:bg-orange-900/20" 
    };
  }
  return { 
    texto: `En ${dias} días`, 
    color: "text-green-600 dark:text-green-400", 
    bg: "bg-green-50 dark:bg-green-900/20" 
  };
};