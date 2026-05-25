import React from 'react';
import { Pressable, Text, View, type PressableProps } from 'react-native';

interface FilterChipProps extends PressableProps {
  isActive: boolean;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  textClassName?: string;
}

export function FilterChip({
  isActive,
  children,
  className = '',
  contentClassName = 'flex-row items-center gap-1.5',
  textClassName = 'text-[13px] font-semibold tracking-wide',
  ...props
}: FilterChipProps) {
  return (
    <Pressable
      className={['rounded-full border px-4 py-2.5', isActive ? 'border-accent bg-accent' : 'border-border bg-background', className]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      <View className={contentClassName}>
        {typeof children === 'string' ? (
          <Text className={[textClassName, isActive ? 'text-accent-foreground' : 'text-foreground/70'].join(' ')}>{children}</Text>
        ) : (
          children
        )}
      </View>
    </Pressable>
  );
}
