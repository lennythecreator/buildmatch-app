import { apiClient } from '../client';
import type { BillingMethod } from '../types';

export interface CreateBillingMethodInput {
  type: 'CARD' | 'PAYPAL' | 'VENMO';
  cardNumber?: string;
  holderName?: string;
  expMonth?: number;
  expYear?: number;
  country?: string;
  addressLine1?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  accountEmail?: string;
}

export const billingService = {
  list: () =>
    apiClient.get<BillingMethod[]>('/api/billing-methods'),

  create: (input: CreateBillingMethodInput) =>
    apiClient.post<BillingMethod>('/api/billing-methods', input),

  remove: (id: string) =>
    apiClient.delete<void>(`/api/billing-methods/${id}`),

  setDefault: (id: string) =>
    apiClient.put<BillingMethod>(`/api/billing-methods/${id}/default`, {}),
};
