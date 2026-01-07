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
