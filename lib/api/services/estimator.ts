import { apiClient } from '../client';
import type {
  Property,
  Estimate,
  EstimateSummary,
  PropertyPhoto,
  EstimateStatus,
} from '../types';

export interface CreatePropertyInput {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  propertyType: string;
  yearBuilt?: number;
  sqftEstimate?: number;
  bedrooms: number;
  bathrooms: number;
  hasBasement?: boolean;
  hasGarage?: boolean;
  stories?: number;
}

export interface CreateEstimateInput {
  propertyId: string;
  renovationPurpose: string;
  primaryIssue: string;
  questionnaireAnswers: Record<string, string>;
  photoIds: string[];
}

export interface EstimatePollResponse {
  status: EstimateStatus;
  totalLow?: number;
  totalHigh?: number;
  updatedAt: string;
}

export interface PropertyListResponse {
  properties: Property[];
  total: number;
  page: number;
  limit: number;
}

export const estimatorService = {
  createProperty: (input: CreatePropertyInput) =>
    apiClient.post<Property>('/api/estimator/properties', input),

  getProperties: () =>
    apiClient.get<PropertyListResponse>('/api/estimator/properties'),

  getProperty: (id: string) =>
    apiClient.get<Property>(`/api/estimator/properties/${id}`),

  createEstimate: (input: CreateEstimateInput) =>
    apiClient.post<{ estimateId: string; status: EstimateStatus }>(
      '/api/estimator/estimates',
      input
    ),

  pollEstimate: (id: string) =>
    apiClient.get<EstimatePollResponse>(`/api/estimator/estimates/${id}/poll`),

  getEstimate: (id: string) =>
    apiClient.get<Estimate>(`/api/estimator/estimates/${id}`),

  getPropertyEstimates: (propertyId: string) =>
    apiClient.get<Estimate[]>(`/api/estimator/properties/${propertyId}/estimates`),

  uploadPhoto: (
    propertyId: string,
    photo: {
      areaKey: string;
      areaLabel: string;
      url: string;
      storagePath: string;
      caption?: string;
      sortOrder?: number;
    }
  ) =>
    apiClient.post<PropertyPhoto>('/api/estimator/photos', {
      propertyId,
      ...photo,
    }),

  deletePhoto: (photoId: string) =>
    apiClient.delete<void>(`/api/estimator/photos/${photoId}`),
};
