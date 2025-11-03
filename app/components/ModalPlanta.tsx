'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { Planta, TIPOS_PLANTA, TipoPlanta, NivelLuz, NivelHumedad } from '../lib/types';

interface ModalPlantaProps {
  planta: Planta | null;
  onGuardar: (planta: Omit<Planta, 'id'>) => void;
  onCerrar: () => void;
}

export default function ModalPlanta({ planta, onGuardar, onCerrar }: ModalPlantaProps) {
  const { t } = useTranslation();
  
  const [form, setForm] = useState({
    nombre: planta?.nombre || '',
    nombreCientifico: planta?.nombreCientifico || '',
    tipo: planta?.tipo || ('Monstera' as TipoPlanta),
    fechaAdquisicion: planta?.fechaAdquisicion || new Date().toISOString().split('T')[0],
    ubicacion: planta?.ubicacion || '',
    foto: planta?.foto || '',
    notas: planta?.notas || '',
    frecuenciaRiego: planta?.frecuenciaRiego || 7,
    ultimoRiego: planta?.ultimoRiego || new Date().toISOString(),
    necesidadLuz: planta?.necesidadLuz || ('medium' as NivelLuz),
    estadoSalud: planta?.estadoSalud || ('healthy' as const),
    temperaturaMin: planta?.temperaturaMin || undefined,
    temperaturaMax: planta?.temperaturaMax || undefined,
    humedad: planta?.humedad || ('medium' as NivelHumedad),
  });

  const handleSubmit = () => {
    if (!form.nombre.trim()) {
      alert(t('validation.nameRequired'));
      return;
    }
    onGuardar(form);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({...form, foto: reader.result as string});
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {planta ? t('plant.editPlant') : t('plant.addPlant')}
          </h2>
          <button 
            onClick={onCerrar} 
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Formulario */}
        <div className="p-6 space-y-5">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('plant.name')} *
            </label>
            <input
              type="text"
              value={form.nombre}
              onChange={(e) => setForm({...form, nombre: e.target.value})}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
              placeholder={t('plant.name')}
            />
          </div>

          {/* Nombre Científico */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('plant.scientificName')} ({t('plant.optional')})
            </label>
            <input
              type="text"
              value={form.nombreCientifico}
              onChange={(e) => setForm({...form, nombreCientifico: e.target.value})}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
              placeholder={t('plant.scientificName')}
            />
          </div>

          {/* Tipo y Ubicación */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('plant.type')}
              </label>
              <select
                value={form.tipo}
                onChange={(e) => setForm({...form, tipo: e.target.value as TipoPlanta})}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
              >
                {TIPOS_PLANTA.map(tipo => (
                  <option key={tipo} value={tipo}>{t(`plantTypes.${tipo}`)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('plant.location')}
              </label>
              <input
                type="text"
                value={form.ubicacion}
                onChange={(e) => setForm({...form, ubicacion: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
                placeholder={t('plant.location')}
              />
            </div>
          </div>

          {/* Fecha de Adquisición y Frecuencia de Riego */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('plant.acquisitionDate')}
              </label>
              <input
                type="date"
                value={form.fechaAdquisicion}
                onChange={(e) => setForm({...form, fechaAdquisicion: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('plant.waterEveryDays')}
              </label>
              <input
                type="number"
                value={form.frecuenciaRiego}
                onChange={(e) => setForm({...form, frecuenciaRiego: parseInt(e.target.value) || 1})}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
                min="1"
              />
            </div>
          </div>

          {/* Necesidades de Luz y Humedad */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('plant.lightNeeds')}
              </label>
              <select
                value={form.necesidadLuz}
                onChange={(e) => setForm({...form, necesidadLuz: e.target.value as NivelLuz})}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
              >
                <option value="low">{t('light.low')}</option>
                <option value="medium">{t('light.medium')}</option>
                <option value="bright-indirect">{t('light.brightIndirect')}</option>
                <option value="direct">{t('light.direct')}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('plant.humidity')}
              </label>
              <select
                value={form.humedad}
                onChange={(e) => setForm({...form, humedad: e.target.value as NivelHumedad})}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
              >
                <option value="low">{t('humidityLevels.low')}</option>
                <option value="medium">{t('humidityLevels.medium')}</option>
                <option value="high">{t('humidityLevels.high')}</option>
              </select>
            </div>
          </div>

          {/* Temperatura (opcional) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('plant.minTemp')}
              </label>
              <input
                type="number"
                value={form.temperaturaMin || ''}
                onChange={(e) => setForm({...form, temperaturaMin: e.target.value ? parseInt(e.target.value) : undefined})}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
                placeholder={t('plant.optional')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('plant.maxTemp')}
              </label>
              <input
                type="number"
                value={form.temperaturaMax || ''}
                onChange={(e) => setForm({...form, temperaturaMax: e.target.value ? parseInt(e.target.value) : undefined})}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
                placeholder={t('plant.optional')}
              />
            </div>
          </div>

          {/* Foto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('plant.photo')}
            </label>
            
            {/* Preview de la imagen */}
            {form.foto && (
              <div className="mb-3 relative">
                <img 
                  src={form.foto} 
                  alt="Preview" 
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setForm({...form, foto: ''})}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Botón para subir imagen */}
            <div className="flex gap-2">
              <label className="flex-1 cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center hover:border-green-500 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <div className="text-gray-600 dark:text-gray-400">
                    📷 {t('plant.uploadPhoto')}
                  </div>
                </div>
              </label>
            </div>

            {/* Input de URL alternativo */}
            <div className="mt-2">
              <input
                type="url"
                value={form.foto.startsWith('data:') ? '' : form.foto}
                onChange={(e) => setForm({...form, foto: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
                placeholder={t('plant.pasteUrl')}
              />
            </div>
          </div>

          {/* Notas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('plant.notes')}
            </label>
            <textarea
              value={form.notas}
              onChange={(e) => setForm({...form, notas: e.target.value})}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-green-500 outline-none resize-none"
              rows={3}
              placeholder={t('plant.notesPlaceholder')}
            />
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onCerrar}
              className="flex-1 px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
              type="button"
            >
              {t('actions.cancel')}
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-6 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition-all transform hover:scale-105 shadow-lg shadow-green-600/30"
              type="button"
            >
              {planta ? t('actions.saveChanges') : t('plant.addPlant')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}