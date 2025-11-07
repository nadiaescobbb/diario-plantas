'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import { Planta } from '@/app/lib/types';
import CardPlanta from '../CardPlanta';

interface MyPlantsViewProps {
  plantasFiltradas: Planta[];
  onRegar: (id: number) => void;
  onEditar: (planta: Planta) => void;
  onEliminar: (id: number) => void;
  onAbrirDetalle: (planta: Planta) => void;
}

export default function MyPlantsView({
  plantasFiltradas,
  onRegar,
  onEditar,
  onEliminar,
  onAbrirDetalle
}: MyPlantsViewProps) {
  const { t } = useTranslation();

  if (plantasFiltradas.length === 0) {
    return <EmptySearchState t={t} />;
  }

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {plantasFiltradas.map(planta => (
          <CardPlanta
            key={planta.id}
            planta={planta}
            onRegar={onRegar}
            onEditar={onEditar}
            onEliminar={onEliminar}
            onClick={onAbrirDetalle}
          />
        ))}
      </div>
    </div>
  );
}

function EmptySearchState({ t }: { t: any }) {
  return (
    <div className="text-center py-12">
      <Search className="w-16 h-16 mx-auto text-gray-400 mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {t('plant.noPlantsFound')}
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        {t('plant.adjustSearch')}
      </p>
    </div>
  );
}