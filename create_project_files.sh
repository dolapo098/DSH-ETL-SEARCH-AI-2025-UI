#!/bin/bash

PROJECT_ROOT="/tmp/cc-agent/62072718/project/src"

# Create SearchQuery.ts
cat > "$PROJECT_ROOT/models/SearchQuery.ts" << 'EOF'
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
EOF

# Create SearchResult.ts
cat > "$PROJECT_ROOT/models/SearchResult.ts" << 'EOF'
import { Dataset } from './Dataset';

export interface SearchResult {
  results: SearchResultItem[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  queryMetadata: QueryMetadata;
  facets?: SearchFacets;
}

export interface SearchResultItem {
  dataset: Dataset;
  score: number;
  matchType: MatchType;
  highlights?: SearchHighlight[];
  explanation?: string;
}

export type MatchType = 'exact' | 'partial' | 'semantic' | 'fuzzy';

export interface SearchHighlight {
  field: string;
  snippets: string[];
}

export interface QueryMetadata {
  executionTimeMs: number;
  searchType: string;
  expandedQuery?: string;
  suggestedQueries?: string[];
}

export interface SearchFacets {
  topicCategories: FacetItem[];
  resourceTypes: FacetItem[];
  organizations: FacetItem[];
  years: FacetItem[];
}

export interface FacetItem {
  value: string;
  count: number;
  selected: boolean;
}

export interface ConversationalResponse {
  answer: string;
  relatedDatasets: Dataset[];
  sources: string[];
  followUpQuestions?: string[];
  conversationId: string;
}
EOF

# Create models index.ts
cat > "$PROJECT_ROOT/models/index.ts" << 'EOF'
export * from './Dataset';
export * from './SearchQuery';
export * from './SearchResult';
EOF

echo "Models created successfully!"

