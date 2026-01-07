import { MutationTree } from 'vuex';
import { SearchState, SearchMutationTypes } from './types';
import { SearchResultItem, SearchSuggestion, SearchFilters } from '@/models/index';

export const mutations: MutationTree<SearchState> = {
  [SearchMutationTypes.SET_QUERY](state, query: string) {
    state.query = query;
  },

  [SearchMutationTypes.SET_SEARCH_TYPE](state, searchType: SearchState['searchType']) {
    state.searchType = searchType;
  },

  [SearchMutationTypes.SET_RESULTS](state, payload: {
    results: SearchResultItem[];
    totalCount: number;
    totalPages: number;
    currentPage?: number;
  }) {
    state.results = payload.results;
    state.totalCount = payload.totalCount;
    state.totalPages = payload.totalPages;
    if (payload.currentPage !== undefined) {
      state.currentPage = payload.currentPage;
    }
  },

  [SearchMutationTypes.SET_LOADING](state, isLoading: boolean) {
    state.isLoading = isLoading;
  },

  [SearchMutationTypes.SET_ERROR](state, error: string | null) {
    state.error = error;
  },

  [SearchMutationTypes.SET_SUGGESTIONS](state, suggestions: SearchSuggestion[]) {
    state.suggestions = suggestions;
  },

  [SearchMutationTypes.ADD_RECENT_SEARCH](state, query: string) {
    if (!state.recentSearches.includes(query)) {
      state.recentSearches = [query, ...state.recentSearches].slice(0, 10);
    }
  },

  [SearchMutationTypes.SET_FILTERS](state, filters: SearchFilters | null) {
    state.filters = filters;
  },

  [SearchMutationTypes.SET_PAGINATION](state, payload: { page: number; pageSize?: number }) {
    state.currentPage = payload.page;
    if (payload.pageSize) {
      state.pageSize = payload.pageSize;
    }
  },

  [SearchMutationTypes.SET_SELECTED_DATASET](state, datasetId: string | null) {
    state.selectedDatasetId = datasetId;
  },

  [SearchMutationTypes.CLEAR_RESULTS](state) {
    state.results = [];
    state.totalCount = 0;
    state.totalPages = 0;
    state.error = null;
  }
};
