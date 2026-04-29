import React from 'react';
import { Pressable, Text, PressableProps, ActivityIndicator } from 'react-native';

interface ButtonProps extends PressableProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  className?: string;
  textClassName?: string;
  children?: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading,
  className = '',
  textClassName = '',
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = 'flex-row items-center justify-center rounded-xl font-medium';
  
  const variantClasses = {
    primary: 'bg-accent',
    secondary: 'bg-surface border border-border',
    outline: 'bg-transparent border-2 border-accent',
    ghost: 'bg-transparent',
    danger: 'bg-danger',
  };
  
  const textVariantClasses = {
    primary: 'text-accent-foreground font-semibold',
    secondary: 'text-foreground font-semibold',
    outline: 'text-accent font-semibold',
    ghost: 'text-foreground font-semibold',
    danger: 'text-danger-foreground font-semibold',
  };

  const sizeClasses = {
    sm: 'px-3 py-2 min-h-[32px]',
    md: 'px-4 py-3 min-h-[48px]',
    lg: 'px-6 py-4 min-h-[56px]',
  };
  
  const isDisabled = disabled || isLoading;
  const disabledClasses = isDisabled ? 'opacity-50' : 'active:opacity-80';

  const rootClass = [baseClasses, variantClasses[variant], sizeClasses[size], disabledClasses, className].filter(Boolean).join(' ');
  const textClass = [textVariantClasses[variant], 'text-center', textClassName].filter(Boolean).join(' ');

  return (
    <Pressable disabled={isDisabled} className={rootClass} {...props}>
      {isLoading ? (
        <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? '#002743' : '#ffffff'} />
      ) : typeof children === 'string' ? (
        <Text className={textClass}>{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
}
