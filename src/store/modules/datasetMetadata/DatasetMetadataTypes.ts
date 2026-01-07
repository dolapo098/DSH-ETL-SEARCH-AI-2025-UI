import { DatasetFullDetailsDto } from '@/models/index';

export interface DiscoveryStats {
  totalDatasets: number;
  totalProviders: number;
}

export interface DatasetsState {
  datasets: Record<string, DatasetFullDetailsDto>;
  selectedDataset: DatasetFullDetailsDto | null;
  isLoading: boolean;
  error: string | null;
  stats: DiscoveryStats | null;
  isProcessingAll: boolean;
  isProcessingOne: boolean;
  processMessage: string | null;
  validationMessage: string | null;
}

export enum DatasetMutationTypes {
  SET_DATASET = 'SET_DATASET',
  SET_SELECTED_DATASET = 'SET_SELECTED_DATASET',
  SET_LOADING = 'SET_LOADING',
  SET_ERROR = 'SET_ERROR',
  SET_STATS = 'SET_STATS',
  SET_PROCESSING_ALL = 'SET_PROCESSING_ALL',
  SET_PROCESSING_ONE = 'SET_PROCESSING_ONE',
  SET_PROCESS_MESSAGE = 'SET_PROCESS_MESSAGE',
  SET_VALIDATION_MESSAGE = 'SET_VALIDATION_MESSAGE'
}

export enum DatasetActionTypes {
  FETCH_DATASET = 'FETCH_DATASET',
  FETCH_STATS = 'FETCH_STATS',
  PROCESS_ALL = 'PROCESS_ALL',
  PROCESS_IDENTIFIER = 'PROCESS_IDENTIFIER'
}
