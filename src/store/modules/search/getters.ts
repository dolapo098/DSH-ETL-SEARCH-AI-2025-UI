import { GetterTree } from 'vuex';
import { SearchState } from './types';
import { RootState } from '@/store/types';

export const getters: GetterTree<SearchState, RootState> = {
  hasResults: (state): boolean => {
    return state.results.length > 0;
  },

  hasMoreResults: (state): boolean => {
    return state.currentPage < state.totalPages;
  },

  isSearching: (state): boolean => {
    return state.isLoading;
  },

  selectedDataset: (state) => {
    if (!state.selectedDatasetId) return null;
    return state.results.find(r => r.identifier === state.selectedDatasetId) || null;
  },

  hasActiveFilters: (state): boolean => {
    if (!state.filters) return false;
    return !!(
      state.filters.dateRange ||
      state.filters.topicCategories?.length ||
      state.filters.keywords?.length ||
      state.filters.spatialExtent ||
      state.filters.resourceTypes?.length ||
      state.filters.organizations?.length
    );
  },

  resultCount: (state): string => {
    if (state.totalCount === 0) return 'No results';
    if (state.totalCount === 1) return '1 result';
    return `${state.totalCount.toLocaleString()} results`;
  }
};
