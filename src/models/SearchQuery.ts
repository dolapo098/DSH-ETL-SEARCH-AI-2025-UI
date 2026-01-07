export interface SearchQuery {
  query: string;
  searchType: SearchType;
  filters?: SearchFilters;
  pagination?: PaginationParams;
  sortBy?: SortOptions;
}

export enum SearchType {
  KEYWORD = 'keyword',
  SEMANTIC = 'semantic',
  CONVERSATIONAL = 'conversational',
  HYBRID = 'hybrid'
}

export interface SearchFilters {
  dateRange?: DateRangeFilter;
  topicCategories?: string[];
  keywords?: string[];
  spatialExtent?: SpatialFilter;
  resourceTypes?: string[];
  organizations?: string[];
}

export interface DateRangeFilter {
  startDate?: Date;
  endDate?: Date;
}

export interface SpatialFilter {
  boundingBox?: {
    west: number;
    east: number;
    south: number;
    north: number;
  };
  withinRegion?: string;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface SortOptions {
  field: SortField;
  order: SortOrder;
}

export enum SortField {
  RELEVANCE = 'relevance',
  TITLE = 'title',
  DATE = 'date',
  POPULARITY = 'popularity'
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc'
}

export interface SearchSuggestion {
  text: string;
  type: 'keyword' | 'dataset' | 'topic' | 'organization';
  metadata?: any;
}
