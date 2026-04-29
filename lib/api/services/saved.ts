import { apiClient } from '../client';
import type { SavedList, SavedIdsResponse, ContractorProfile } from '../types';

export interface SavedListResponse {
  lists: SavedList[];
  total: number;
}

export interface SavedContractorsResponse {
  contractors: ContractorProfile[];
  total: number;
  page: number;
  limit: number;
}

export const savedService = {
  toggle: (contractorProfileId: string, listId?: string) =>
    apiClient.post<{ saved: boolean; savedId?: string }>('/api/saved/toggle', {
      contractorProfileId,
      listId,
    }),

  getIds: () =>
    apiClient.get<SavedIdsResponse>('/api/saved/ids'),

  getLists: () =>
    apiClient.get<SavedListResponse>('/api/saved/lists'),

  createList: (name: string) =>
    apiClient.post<SavedList>('/api/saved/lists', { name }),

  updateList: (id: string, name: string) =>
    apiClient.put<SavedList>(`/api/saved/lists/${id}`, { name }),

  deleteList: (id: string) =>
    apiClient.delete<void>(`/api/saved/lists/${id}`),

  getListContractors: (id: string) =>
    apiClient.get<SavedContractorsResponse>(`/api/saved/lists/${id}/contractors`),

  removeFromList: (listId: string, savedId: string) =>
    apiClient.delete<void>(`/api/saved/lists/${listId}/contractors/${savedId}`),

  moveContractor: (savedId: string, targetListId: string) =>
    apiClient.put<{ success: boolean }>(`/api/saved/contractors/${savedId}/move`, {
      targetListId,
    }),

  updateNote: (savedId: string, note: string) =>
    apiClient.put<{ success: boolean }>(`/api/saved/contractors/${savedId}/note`, {
      note,
    }),
};
