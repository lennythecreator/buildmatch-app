import { CreateBillingMethodInput } from '@/lib/api/services';
import { useCreateBillingMethod } from '@/hooks/useBilling';
import { IconCircleCheck, IconX } from '@tabler/icons-react-native';
import { useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface PaymentDetailsModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const SCREEN_HEIGHT = Dimensions.get('window').height;

export function PaymentDetailsModal({ isVisible, onClose, onSuccess }: PaymentDetailsModalProps) {
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const createBilling = useCreateBillingMethod();

  const [holderName, setHolderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');

  useMemo(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          damping: 28,
          stiffness: 300,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: SCREEN_HEIGHT,
          useNativeDriver: true,
          damping: 28,
          stiffness: 300,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible, translateY, backdropOpacity]);

  function handleClose() {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: SCREEN_HEIGHT,
        useNativeDriver: true,
        damping: 28,
        stiffness: 300,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  }

  function formatCardNumber(text: string) {
    const digits = text.replace(/\D/g, '').slice(0, 16);
    const groups = digits.match(/.{1,4}/g);
    return groups ? groups.join('  ') : digits;
  }

  function formatExpiry(text: string) {
    const digits = text.replace(/\D/g, '').slice(0, 4);
    if (digits.length > 2) {
      return `${digits.slice(0, 2)} / ${digits.slice(2)}`;
    }
    return digits;
  }

  function handleSubmit() {
    const digits = cardNumber.replace(/\D/g, '');
    const expParts = expiry.replace(/\s/g, '').split('/');
    const expMonth = parseInt(expParts[0], 10);
    const expYear = parseInt(expParts[1], 10);

    const input: CreateBillingMethodInput = {
      type: 'CARD',
      cardNumber: digits,
      holderName: holderName.trim(),
      expMonth: isNaN(expMonth) ? undefined : expMonth,
      expYear: isNaN(expYear) ? undefined : 2000 + expYear,
      addressLine1: addressLine1.trim() || undefined,
      city: city.trim() || undefined,
      state: state.trim() || undefined,
      zipCode: zipCode.trim() || undefined,
    };

    createBilling.mutate(input, {
      onSuccess: () => {
        setHolderName('');
        setCardNumber('');
        setExpiry('');
        setCvv('');
        setAddressLine1('');
        setCity('');
        setState('');
        setZipCode('');
        handleClose();
        onSuccess?.();
      },
    });
  }

  if (!isVisible) return null;

  return (
    <View className="absolute inset-0 z-50">
      <Animated.View
        className="absolute inset-0 bg-black/40"
        style={{ opacity: backdropOpacity }}
      >
        <Pressable className="flex-1" onPress={handleClose} />
      </Animated.View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="absolute bottom-0 left-0 right-0"
        keyboardVerticalOffset={Platform.OS === 'ios' ? -insets.bottom : 0}
      >
        <Animated.View
          className="bg-white rounded-t-[2rem] shadow-2xl max-h-[90%]"
          style={{ transform: [{ translateY }], paddingBottom: insets.bottom }}
        >
          <ScrollView
            className="px-6 pt-4"
            contentContainerStyle={{ paddingBottom: 32 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View className="flex-row items-center justify-between mb-6">
              <View className="flex-row items-center gap-2">
                <View className="w-6 h-0.5 bg-emerald-500 rounded-full" />
                <Text className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">
                  New Protocol
                </Text>
              </View>
              <Pressable
                onPress={handleClose}
                className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center"
              >
                <IconX size={18} color="#0f172a" />
              </Pressable>
            </View>

            <Text className="text-3xl font-extrabold text-gray-900 leading-none uppercase tracking-tighter mb-8">
              SPEAK YOUR{'\n'}TRUTH
            </Text>

            <View className="gap-6">
              <View className="gap-1.5">
                <Text className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em] opacity-40">
                  Identity on Card
                </Text>
                <TextInput
                  className="w-full border-0 border-b border-gray-200 px-0 py-3 text-lg font-bold italic tracking-tight"
                  placeholder="ALEXANDER VANGUARD"
                  placeholderTextColor="#94a3b8"
                  value={holderName}
                  onChangeText={setHolderName}
                  autoCapitalize="characters"
                />
              </View>

              <View className="gap-1.5">
                <Text className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em] opacity-40">
                  Financial Token
                </Text>
                <View className="relative">
                  <TextInput
                    className="w-full border-0 border-b border-gray-200 px-0 py-3 text-lg font-bold tracking-[0.2em]"
                    placeholder="••••  ••••  ••••  4242"
                    placeholderTextColor="#94a3b8"
                    value={formatCardNumber(cardNumber)}
                    onChangeText={(t) => setCardNumber(t.replace(/\s/g, ''))}
                    keyboardType="number-pad"
                    maxLength={25}
                  />
                </View>
              </View>

              <View className="flex-row gap-6">
                <View className="flex-1 gap-1.5">
                  <Text className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em] opacity-40">
                    Horizon
                  </Text>
                  <TextInput
                    className="w-full border-0 border-b border-gray-200 px-0 py-3 text-lg font-bold tracking-widest"
                    placeholder="MM / YY"
                    placeholderTextColor="#94a3b8"
                    value={formatExpiry(expiry)}
                    onChangeText={(t) => setExpiry(t)}
                    keyboardType="number-pad"
                    maxLength={7}
                  />
                </View>
                <View className="flex-1 gap-1.5">
                  <Text className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em] opacity-40">
                    Signature Code
                  </Text>
                  <TextInput
                    className="w-full border-0 border-b border-gray-200 px-0 py-3 text-lg font-bold tracking-[0.5em]"
                    placeholder="•••"
                    placeholderTextColor="#94a3b8"
                    value={cvv}
                    onChangeText={(t) => setCvv(t.replace(/\D/g, '').slice(0, 4))}
                    keyboardType="number-pad"
                    secureTextEntry
                    maxLength={4}
                  />
                </View>
              </View>

              <View className="gap-4 pt-2">
                <View className="flex-row items-center gap-3">
                  <Text className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em]">
                    Domicile
                  </Text>
                  <View className="flex-1 h-px bg-gray-100" />
                </View>

                <View className="gap-1.5">
                  <Text className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                    Street Address
                  </Text>
                  <TextInput
                    className="w-full border-0 border-b border-gray-200 px-0 py-2 text-lg font-medium italic"
                    placeholder="1200 Architect Boulevard"
                    placeholderTextColor="#94a3b8"
                    value={addressLine1}
                    onChangeText={setAddressLine1}
                  />
                </View>

                <View className="flex-row gap-4">
                  <View className="flex-1 gap-1.5">
                    <Text className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                      City
                    </Text>
                    <TextInput
                      className="w-full border-0 border-b border-gray-200 px-0 py-2 text-lg font-medium italic"
                      placeholder="Chicago"
                      placeholderTextColor="#94a3b8"
                      value={city}
                      onChangeText={setCity}
                    />
                  </View>
                  <View className="flex-1 gap-1.5">
                    <Text className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                      State
                    </Text>
                    <TextInput
                      className="w-full border-0 border-b border-gray-200 px-0 py-2 text-lg font-medium italic"
                      placeholder="IL"
                      placeholderTextColor="#94a3b8"
                      value={state}
                      onChangeText={setState}
                      maxLength={2}
                      autoCapitalize="characters"
                    />
                  </View>
                  <View className="flex-1 gap-1.5">
                    <Text className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                      Postal
                    </Text>
                    <TextInput
                      className="w-full border-0 border-b border-gray-200 px-0 py-2 text-lg font-medium italic"
                      placeholder="60601"
                      placeholderTextColor="#94a3b8"
                      value={zipCode}
                      onChangeText={(t) => setZipCode(t.replace(/\D/g, '').slice(0, 10))}
                      keyboardType="number-pad"
                      maxLength={10}
                    />
                  </View>
                </View>
              </View>

              <Pressable
                onPress={handleSubmit}
                disabled={createBilling.isPending}
                className="w-full bg-gray-900 py-5 rounded-2xl items-center justify-center mt-4 active:opacity-80"
              >
                {createBilling.isPending ? (
                  <Text className="text-white text-[10px] font-black uppercase tracking-[0.4em]">
                    Processing...
                  </Text>
                ) : (
                  <Text className="text-white text-[10px] font-black uppercase tracking-[0.4em]">
                    Authorize & Authenticate
                  </Text>
                )}
              </Pressable>

              {createBilling.isSuccess && (
                <View className="flex-row items-center justify-center gap-2">
                  <IconCircleCheck size={16} color="#10b981" />
                  <Text className="text-sm font-semibold text-emerald-600">
                    Payment method saved
                  </Text>
                </View>
              )}

              {createBilling.isError && (
                <Text className="text-sm font-medium text-red-500 text-center">
                  {createBilling.error?.message || 'Failed to save payment method'}
                </Text>
              )}
            </View>
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
}
