import React from 'react';
import { Sprout, Droplet, Calendar } from 'lucide-react';

interface LandingProps {
  onEntrar: () => void;
}

export default function Landing({ onEntrar }: LandingProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center animate-fade-in">
        <Sprout className="w-20 h-20 mx-auto text-green-600 mb-6" />
        
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Diario de Plantas
        </h1>
        
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          La forma más sencilla de cuidar tus plantas. Registra, monitorea y recibe 
          recordatorios para mantener tu jardín siempre saludable.
        </p>
        
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="p-6 bg-green-50 rounded-xl transform hover:scale-105 transition-transform">
            <Sprout className="w-12 h-12 mx-auto text-green-600 mb-3" />
            <h3 className="font-semibold text-lg mb-2">Organiza</h3>
            <p className="text-gray-600 text-sm">
              Gestiona todas tus plantas en un solo lugar
            </p>
          </div>
          
          <div className="p-6 bg-blue-50 rounded-xl transform hover:scale-105 transition-transform">
            <Droplet className="w-12 h-12 mx-auto text-blue-600 mb-3" />
            <h3 className="font-semibold text-lg mb-2">Recordatorios</h3>
            <p className="text-gray-600 text-sm">
              Nunca olvides cuándo regar o fertilizar
            </p>
          </div>
          
          <div className="p-6 bg-purple-50 rounded-xl transform hover:scale-105 transition-transform">
            <Calendar className="w-12 h-12 mx-auto text-purple-600 mb-3" />
            <h3 className="font-semibold text-lg mb-2">Calendario</h3>
            <p className="text-gray-600 text-sm">
              Visualiza todos los cuidados programados
            </p>
          </div>
        </div>

        <button
          onClick={onEntrar}
          className="bg-green-600 hover:bg-green-700 text-white text-xl px-12 py-4 rounded-full font-semibold transition-all transform hover:scale-105 shadow-lg shadow-green-600/50"
        >
          Comenzar Ahora
        </button>
        
        <p className="mt-6 text-gray-500 text-sm">
          ✨ Gratis • Sin registro • Datos locales
        </p>
      </div>
    </div>
  );
}