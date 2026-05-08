import { create } from "zustand";
import type { ContractorSpecialty } from "@/lib/api/types";

export interface ContractorExploreFiltersValue {
  searchQuery: string;
  specialty: ContractorSpecialty | "ALL";
  city: string;
  state: string;
  ratingMin: number | null;
  availableOnly: boolean;
}

export const DEFAULT_CONTRACTOR_EXPLORE_FILTERS: ContractorExploreFiltersValue = {
  searchQuery: "",
  specialty: "ALL",
  city: "",
  state: "",
  ratingMin: null,
  availableOnly: false,
};

export interface ContractorExploreState {
  filters: ContractorExploreFiltersValue;
  page: number;
  isFiltersExpanded: boolean;
  setFilters: (filters: ContractorExploreFiltersValue) => void;
  setPage: (page: number) => void;
  setIsFiltersExpanded: (isExpanded: boolean) => void;
  resetFilters: () => void;
}

export const useContractorExploreStore = create<ContractorExploreState>((set) => ({
  filters: DEFAULT_CONTRACTOR_EXPLORE_FILTERS,
  page: 1,
  isFiltersExpanded: false,
  setFilters: (filters) => set({ filters }),
  setPage: (page) => set({ page }),
  setIsFiltersExpanded: (isExpanded) => set({ isFiltersExpanded: isExpanded }),
  resetFilters: () =>
    set({
      filters: DEFAULT_CONTRACTOR_EXPLORE_FILTERS,
      page: 1,
      isFiltersExpanded: false,
    }),
}));