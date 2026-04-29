import React from 'react';
import { View, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  className?: string;
}

export function Card({ className = '', children, ...props }: CardProps) {
  return (
    <View className={['bg-surface rounded-2xl border border-border p-4 shadow-sm', className].filter(Boolean).join(' ')} {...props}>
      {children}
    </View>
  );
}
