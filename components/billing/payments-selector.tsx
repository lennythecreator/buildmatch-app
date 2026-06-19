import type { BillingMethod } from '@/lib/api/types';
import { IconChevronDown, IconCircleCheck, IconPlus } from '@tabler/icons-react-native';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

interface PaymentsSelectorProps {
  methods: BillingMethod[];
  selectedId?: string;
  onSelect: (method: BillingMethod | 'new') => void;
  onAddNew: () => void;
}

function formatCardLabel(method: BillingMethod) {
  if (method.type !== 'CARD') return method.type;
  const brand = method.brand || 'CARD';
  return `${brand.toUpperCase()} •••• ${method.last4 || '0000'}`;
}

function formatExpiry(method: BillingMethod) {
  if (!method.expMonth || !method.expYear) return null;
  const m = String(method.expMonth).padStart(2, '0');
  const y = String(method.expYear).slice(-2);
  return `Valid thru ${m}/${y}`;
}

export function PaymentsSelector({
  methods,
  selectedId,
  onSelect,
  onAddNew,
}: PaymentsSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selected = methods.find((m) => m.id === selectedId);

  function handleSelect(method: BillingMethod | 'new') {
    onSelect(method);
    setIsOpen(false);
  }

  function getBrandBadge(method: BillingMethod) {
    if (method.type !== 'CARD') return null;
    return method.brand || 'CARD';
  }

  return (
    <View className="relative" id="payment-selector">
      <Pressable
        onPress={() => setIsOpen(!isOpen)}
        className="bg-white/70 rounded-2xl border border-white/40 p-4 flex-row items-center justify-between shadow-xl active:scale-[0.97]"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
        }}
      >
        <View className="flex-row items-center gap-4">
          {selected ? (
            <>
              <View className="w-14 h-9 bg-gray-900 items-center justify-center rounded-md">
                <Text className="text-[8px] text-white font-black tracking-widest">
                  {getBrandBadge(selected)}
                </Text>
              </View>
              <View>
                <Text className="text-lg font-bold text-gray-900 tracking-tight italic">
                  Ending in {selected.last4 || '0000'}
                </Text>
                {formatExpiry(selected) && (
                  <Text className="text-[10px] font-medium text-gray-500 tracking-widest uppercase">
                    {formatExpiry(selected)}
                  </Text>
                )}
              </View>
            </>
          ) : (
            <Text className="text-base font-semibold text-gray-500">
              Select payment method
            </Text>
          )}
        </View>
        <IconChevronDown size={24} color="#0f172a" />
      </Pressable>

      {isOpen && (
        <View className="mt-2 bg-white/70 rounded-2xl overflow-hidden border border-white/40 shadow-2xl">
          {methods.map((method) => (
            <Pressable
              key={method.id}
              onPress={() => handleSelect(method)}
              className="p-4 flex-row items-center justify-between hover:bg-white/50 active:bg-white/50"
            >
              <View className="flex-row items-center gap-4">
                <View className="w-10 h-6 bg-gray-100 rounded items-center justify-center">
                  <Text className="text-[6px] font-black tracking-widest text-gray-900">
                    {method.brand || method.type}
                  </Text>
                </View>
                <Text className="text-sm font-semibold tracking-tight italic text-gray-900">
                  {formatCardLabel(method)}
                </Text>
              </View>
              {method.isDefault && (
                <IconCircleCheck size={18} color="#14A800" />
              )}
            </Pressable>
          ))}

          <Pressable
            onPress={() => {
              handleSelect('new');
              onAddNew();
            }}
            className="w-full p-4 flex-row items-center gap-3 bg-emerald-500/5 active:bg-emerald-500/10"
          >
            <IconPlus size={18} color="#14A800" />
            <Text className="text-xs font-black uppercase tracking-widest text-emerald-600">
              Enroll New Asset
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
