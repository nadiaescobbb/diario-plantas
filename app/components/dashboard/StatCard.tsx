'use client';

import React from 'react';

type ColorKey = 'green' | 'red' | 'yellow' | 'blue';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  color: ColorKey;
  positive?: boolean;
}

const colorClasses: Record<ColorKey, string> = {
  green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
  red: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
  yellow: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
  blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
};

export default function StatCard({ 
  title, 
  value, 
  change, 
  icon, 
  color, 
  positive 
}: StatCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
          {title}
        </p>
        <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
      <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        {value}
      </h3>
      <p className={`text-sm ${
        positive 
          ? 'text-green-600 dark:text-green-400' 
          : 'text-gray-500 dark:text-gray-400'
      }`}>
        {change}
      </p>
    </div>
  );
}