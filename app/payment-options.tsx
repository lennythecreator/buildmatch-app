import { PaymentDetailsModal } from '@/components/billing/payment-details-modal';
import { PaymentsSelector } from '@/components/billing/payments-selector';
import { useBillingMethods } from '@/hooks/useBilling';
import type { BillingMethod } from '@/lib/api/types';
import { IconArrowLeft, IconReceipt, IconShield, IconArchive } from '@tabler/icons-react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PaymentOptionsScreen() {
  const insets = useSafeAreaInsets();
  const { data: methods, isLoading } = useBillingMethods();
  const [selectedId, setSelectedId] = useState<string | undefined>(
    methods?.find((m) => m.isDefault)?.id
  );
  const [showModal, setShowModal] = useState(false);

  function handleSelect(method: BillingMethod | 'new') {
    if (method !== 'new') {
      setSelectedId(method.id);
    }
  }

  return (
    <View className="flex-1 bg-[#f8fafc]" style={{ paddingTop: insets.top }}>
      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="py-4">
          <Pressable
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-white items-center justify-center border border-gray-100"
          >
            <IconArrowLeft size={20} color="#0f172a" />
          </Pressable>
        </View>

        <Text className="text-5xl font-extrabold text-gray-900 leading-none tracking-tighter uppercase mb-1">
          Payment{'\n'}Methods
        </Text>
        <Text className="text-sm text-gray-500/80 max-w-[280px] leading-relaxed mb-6">
          Manage your premium architectural project funding sources with clinical precision.
        </Text>

        <View className="mb-4">
          <View className="flex-row items-end justify-between mb-4">
            <Text className="text-[10px] font-black text-gray-900 uppercase tracking-widest opacity-40">
              Primary Gateway
            </Text>
            <View className="flex-1 h-px bg-gray-200 ml-3 mb-[6px]" />
          </View>

          {isLoading ? (
            <View className="py-8 items-center">
              <ActivityIndicator size="small" />
            </View>
          ) : (
            <PaymentsSelector
              methods={methods || []}
              selectedId={selectedId}
              onSelect={handleSelect}
              onAddNew={() => setShowModal(true)}
            />
          )}
        </View>

        <View className="flex-row flex-wrap gap-3 mt-2">
          <View className="w-full bg-gray-50 rounded-3xl p-4 space-y-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-900">
                Recent Transactions
              </Text>
              <IconReceipt size={20} color="rgba(100,116,139,0.4)" />
            </View>
            <View className="gap-3">
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-sm font-bold text-gray-900 italic">
                    Escrow Funding - Project X
                  </Text>
                  <Text className="text-[10px] font-medium text-gray-500/60 uppercase tracking-widest">
                    Oct 24, 2026
                  </Text>
                </View>
                <Text className="text-sm font-extrabold text-gray-900">
                  -$2,500.00
                </Text>
              </View>
              <View className="h-px bg-gray-100" />
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-sm font-bold text-gray-900 italic">
                    Material Procurement - Steel
                  </Text>
                  <Text className="text-[10px] font-medium text-gray-500/60 uppercase tracking-widest">
                    Oct 22, 2026
                  </Text>
                </View>
                <Text className="text-sm font-extrabold text-gray-900">
                  -$8,120.00
                </Text>
              </View>
              <View className="h-px bg-gray-100" />
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-sm font-bold text-gray-900 italic">
                    Consultancy Fee - Structural
                  </Text>
                  <Text className="text-[10px] font-medium text-gray-500/60 uppercase tracking-widest">
                    Oct 19, 2026
                  </Text>
                </View>
                <Text className="text-sm font-extrabold text-gray-900">
                  -$1,830.00
                </Text>
              </View>
            </View>
          </View>

          <View className="bg-white/70 rounded-3xl border border-white/40 p-4 space-y-3 flex-1 min-w-[45%]">
            <IconShield size={20} color="#14A800" />
            <View>
              <Text className="text-[9px] font-black text-gray-900 uppercase tracking-widest">
                Status
              </Text>
              <Text className="text-xs font-bold italic text-gray-900">
                Auto-pay active
              </Text>
            </View>
          </View>

          <View className="bg-gray-900 rounded-3xl p-4 space-y-3 flex-1 min-w-[45%]">
            <IconArchive size={20} color="#14A800" />
            <View>
              <Text className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">
                Archive
              </Text>
              <Text className="text-xs font-bold italic text-white">
                24 Invoices
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <PaymentDetailsModal
        isVisible={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => setShowModal(false)}
      />
    </View>
  );
}
