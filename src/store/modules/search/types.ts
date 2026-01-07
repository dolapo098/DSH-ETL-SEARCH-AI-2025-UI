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
