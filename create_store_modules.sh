#!/bin/bash

SR="/tmp/cc-agent/62072718/project/src"

# Search module types
cat > "$SR/store/modules/search/types.ts" << 'EOF'
import {
  SearchResultItem,
  SearchSuggestion,
  SearchFilters
} from '@/models/index';

export interface SearchState {
  query: string;
  searchType: 'keyword' | 'semantic' | 'conversational' | 'hybrid';
  results: SearchResultItem[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
  suggestions: SearchSuggestion[];
  recentSearches: string[];
  filters: SearchFilters | null;
  selectedDatasetId: string | null;
}

export enum SearchMutationTypes {
  SET_QUERY = 'SET_QUERY',
  SET_SEARCH_TYPE = 'SET_SEARCH_TYPE',
  SET_RESULTS = 'SET_RESULTS',
  SET_LOADING = 'SET_LOADING',
  SET_ERROR = 'SET_ERROR',
  SET_SUGGESTIONS = 'SET_SUGGESTIONS',
  ADD_RECENT_SEARCH = 'ADD_RECENT_SEARCH',
  SET_FILTERS = 'SET_FILTERS',
  SET_PAGINATION = 'SET_PAGINATION',
  SET_SELECTED_DATASET = 'SET_SELECTED_DATASET',
  CLEAR_RESULTS = 'CLEAR_RESULTS'
}

export enum SearchActionTypes {
  PERFORM_SEARCH = 'PERFORM_SEARCH',
  LOAD_MORE_RESULTS = 'LOAD_MORE_RESULTS',
  FETCH_SUGGESTIONS = 'FETCH_SUGGESTIONS',
  APPLY_FILTERS = 'APPLY_FILTERS',
  CLEAR_FILTERS = 'CLEAR_FILTERS',
  SELECT_DATASET = 'SELECT_DATASET'
}
EOF

# Search state
cat > "$SR/store/modules/search/state.ts" << 'EOF'
import { SearchState } from './types';

export const state: SearchState = {
  query: '',
  searchType: 'semantic',
  results: [],
  totalCount: 0,
  currentPage: 1,
  pageSize: 20,
  totalPages: 0,
  isLoading: false,
  error: null,
  suggestions: [],
  recentSearches: [],
  filters: null,
  selectedDatasetId: null
};
EOF

# Search mutations
cat > "$SR/store/modules/search/mutations.ts" << 'EOF'
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
  }) {
    state.results = payload.results;
    state.totalCount = payload.totalCount;
    state.totalPages = payload.totalPages;
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
EOF

# Search getters
cat > "$SR/store/modules/search/getters.ts" << 'EOF'
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
    return state.results.find(r => r.dataset.id === state.selectedDatasetId)?.dataset || null;
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
EOF

# Search actions - simplified
cat > "$SR/store/modules/search/actions.ts" << 'EOF'
import { ActionTree } from 'vuex';
import { SearchState, SearchActionTypes, SearchMutationTypes } from './types';
import { RootState } from '@/store/types';

export const actions: ActionTree<SearchState, RootState> = {
  async [SearchActionTypes.PERFORM_SEARCH]({ commit }, payload?: { query?: string; resetPage?: boolean }) {
    commit(SearchMutationTypes.SET_LOADING, true);
    commit(SearchMutationTypes.SET_ERROR, null);
    
    setTimeout(() => {
      commit(SearchMutationTypes.SET_RESULTS, {
        results: [],
        totalCount: 0,
        totalPages: 0
      });
      commit(SearchMutationTypes.SET_LOADING, false);
    }, 500);
  }
};
EOF

# Search index
cat > "$SR/store/modules/search/index.ts" << 'EOF'
import { Module } from 'vuex';
import { SearchState } from './types';
import { RootState } from '@/store/types';
import { state } from './state';
import { mutations } from './mutations';
import { actions } from './actions';
import { getters } from './getters';

export const searchModule: Module<SearchState, RootState> = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
EOF

# Datasets module
cat > "$SR/store/modules/datasets/types.ts" << 'EOF'
import { Dataset } from '@/models/index';

export interface DatasetsState {
  datasets: Record<string, Dataset>;
  isLoading: boolean;
  error: string | null;
}

export enum DatasetMutationTypes {
  SET_DATASET = 'SET_DATASET'
}

export enum DatasetActionTypes {
  FETCH_DATASET = 'FETCH_DATASET'
}
EOF

cat > "$SR/store/modules/datasets/state.ts" << 'EOF'
import { DatasetsState } from './types';

export const state: DatasetsState = {
  datasets: {},
  isLoading: false,
  error: null
};
EOF

cat > "$SR/store/modules/datasets/mutations.ts" << 'EOF'
import { MutationTree } from 'vuex';
import { DatasetsState } from './types';

export const mutations: MutationTree<DatasetsState> = {};
EOF

cat > "$SR/store/modules/datasets/actions.ts" << 'EOF'
import { ActionTree } from 'vuex';
import { DatasetsState } from './types';
import { RootState } from '@/store/types';

export const actions: ActionTree<DatasetsState, RootState> = {};
EOF

cat > "$SR/store/modules/datasets/getters.ts" << 'EOF'
import { GetterTree } from 'vuex';
import { DatasetsState } from './types';
import { RootState } from '@/store/types';

export const getters: GetterTree<DatasetsState, RootState> = {
  getDatasetById: (state) => (id: string) => {
    return state.datasets[id] || null;
  }
};
EOF

cat > "$SR/store/modules/datasets/index.ts" << 'EOF'
import { Module } from 'vuex';
import { DatasetsState } from './types';
import { RootState } from '@/store/types';
import { state } from './state';
import { mutations } from './mutations';
import { actions } from './actions';
import { getters } from './getters';

export const datasetsModule: Module<DatasetsState, RootState> = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
EOF

# UI module
cat > "$SR/store/modules/ui/types.ts" << 'EOF'
export interface UIState {
  notifications: Notification[];
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  timestamp: Date;
}

export enum UIMutationTypes {
  ADD_NOTIFICATION = 'ADD_NOTIFICATION'
}

export enum UIActionTypes {
  SHOW_NOTIFICATION = 'SHOW_NOTIFICATION',
  DISMISS_NOTIFICATION = 'DISMISS_NOTIFICATION'
}
EOF

cat > "$SR/store/modules/ui/state.ts" << 'EOF'
import { UIState } from './types';

export const state: UIState = {
  notifications: []
};
EOF

cat > "$SR/store/modules/ui/mutations.ts" << 'EOF'
import { MutationTree } from 'vuex';
import { UIState } from './types';

export const mutations: MutationTree<UIState> = {};
EOF

cat > "$SR/store/modules/ui/actions.ts" << 'EOF'
import { ActionTree } from 'vuex';
import { UIState } from './types';
import { RootState } from '@/store/types';

export const actions: ActionTree<UIState, RootState> = {};
EOF

cat > "$SR/store/modules/ui/getters.ts" << 'EOF'
import { GetterTree } from 'vuex';
import { UIState } from './types';
import { RootState } from '@/store/types';

export const getters: GetterTree<UIState, RootState> = {
  activeNotifications: (state) => state.notifications,
  hasNotifications: (state): boolean => state.notifications.length > 0
};
EOF

cat > "$SR/store/modules/ui/index.ts" << 'EOF'
import { Module } from 'vuex';
import { UIState } from './types';
import { RootState } from '@/store/types';
import { state } from './state';
import { mutations } from './mutations';
import { actions } from './actions';
import { getters } from './getters';

export const uiModule: Module<UIState, RootState> = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
EOF

echo "Store modules created successfully!"

