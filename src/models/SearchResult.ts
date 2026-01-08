import { Dataset } from './dataset.model';

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

export enum MatchType {
  Exact = 'exact',
  Partial = 'partial',
  Semantic = 'semantic',
  Fuzzy = 'fuzzy'
}

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
