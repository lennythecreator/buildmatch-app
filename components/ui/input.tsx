import React from 'react';
import { TextInput, TextInputProps, View, Text } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  className?: string;
  inputClassName?: string;
}

export const Input = React.forwardRef<TextInput, InputProps>(
  ({ label, error, className = '', inputClassName = '', ...props }, ref) => {
    return (
      <View className={['w-full', className].filter(Boolean).join(' ')}>
        {label && <Text className="text-foreground font-medium mb-1.5">{label}</Text>}
        <TextInput
          ref={ref}
          className={['w-full px-4 py-3 bg-surface border rounded-xl text-foreground text-base', error ? 'border-danger' : 'border-border', inputClassName].filter(Boolean).join(' ')}
          placeholderTextColor="#66707a"
          {...props}
        />
        {error && <Text className="text-danger text-sm mt-1">{error}</Text>}
      </View>
    );
  }
);

Input.displayName = 'Input';
