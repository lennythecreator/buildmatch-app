import React from 'react';
import { Text, View, ViewProps } from 'react-native';
import { tv, type VariantProps } from 'tailwind-variants';

const badgeStyles = tv({
  slots: {
    base: 'flex-row items-center justify-center px-2 py-0.5 self-start',
    text: 'text-xs font-medium',
  },
  variants: {
    color: {
      default: { base: 'bg-gray-100', text: 'text-gray-800' },
      primary: { base: 'bg-blue-100', text: 'text-blue-800' },
      secondary: { base: 'bg-purple-100', text: 'text-purple-800' },
      success: { base: 'bg-green-100', text: 'text-green-800' },
      warning: { base: 'bg-yellow-100', text: 'text-yellow-800' },
      danger: { base: 'bg-red-100', text: 'text-red-800' },
      slate: { base: 'bg-slate-200', text: 'text-slate-600' },
      vibrant: { base: 'bg-[#5eead4]', text: 'text-slate-900' },
    },
    size: {
      sm: { base: 'px-1.5 py-0.5', text: 'text-[10px]' },
      md: { base: 'px-2 py-0.5', text: 'text-xs' },
      lg: { base: 'px-3 py-1', text: 'text-sm' },
    },
    shape: {
      pill: { base: 'rounded-full' },
      block: { base: 'rounded-md' },
    },
    variant: {
      solid: {},
      flat: {},
      outline: { base: 'border bg-transparent' },
    },
  },
  compoundVariants: [
    // Outline variants
    { variant: 'outline', color: 'default', class: { base: 'border-gray-200', text: 'text-gray-800' } },
    { variant: 'outline', color: 'primary', class: { base: 'border-blue-200', text: 'text-blue-800' } },
    { variant: 'outline', color: 'secondary', class: { base: 'border-purple-200', text: 'text-purple-800' } },
    { variant: 'outline', color: 'success', class: { base: 'border-green-200', text: 'text-green-800' } },
    { variant: 'outline', color: 'warning', class: { base: 'border-yellow-200', text: 'text-yellow-800' } },
    { variant: 'outline', color: 'danger', class: { base: 'border-red-200', text: 'text-red-800' } },
    { variant: 'outline', color: 'slate', class: { base: 'border-slate-200', text: 'text-slate-600' } },
    { variant: 'outline', color: 'vibrant', class: { base: 'border-[#5eead4]', text: 'text-slate-900' } },
    // Solid variants
    { variant: 'solid', color: 'default', class: { base: 'bg-gray-800', text: 'text-white' } },
    { variant: 'solid', color: 'primary', class: { base: 'bg-blue-600', text: 'text-white' } },
    { variant: 'solid', color: 'secondary', class: { base: 'bg-purple-600', text: 'text-white' } },
    { variant: 'solid', color: 'success', class: { base: 'bg-green-600', text: 'text-white' } },
    { variant: 'solid', color: 'warning', class: { base: 'bg-yellow-600', text: 'text-white' } },
    { variant: 'solid', color: 'danger', class: { base: 'bg-red-600', text: 'text-white' } },
    { variant: 'solid', color: 'slate', class: { base: 'bg-slate-700', text: 'text-white' } },
    { variant: 'solid', color: 'vibrant', class: { base: 'bg-[#5eead4]', text: 'text-slate-900' } },
  ],
  defaultVariants: {
    color: 'default',
    size: 'md',
    shape: 'pill',
    variant: 'flat',
  },
});

export interface BadgeProps extends ViewProps, VariantProps<typeof badgeStyles> {
  children: React.ReactNode;
  classNames?: {
    base?: string;
    text?: string;
  };
}

export function Badge({ 
  children, 
  color, 
  size, 
  shape,
  variant, 
  classNames, 
  className, 
  ...props 
}: BadgeProps) {
  const { base, text } = badgeStyles({ color, size, shape, variant });

  return (
    <View className={base({ class: [className, classNames?.base] })} {...props}>
      <Text className={text({ class: classNames?.text })}>
        {children}
      </Text>
    </View>
  );
}
