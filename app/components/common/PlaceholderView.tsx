'use client';

import React from 'react';

interface PlaceholderViewProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}

export default function PlaceholderView({ 
  icon, 
  title, 
  subtitle 
}: PlaceholderViewProps) {
  return (
    <div className="text-center py-20 animate-fade-in">
      <div className="text-gray-400 mb-4 flex justify-center">
        {icon}
      </div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {title}
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        {subtitle}
      </p>
    </div>
  );
}