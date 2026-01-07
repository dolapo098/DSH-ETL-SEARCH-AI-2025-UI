import { DatasetFullDetailsDto } from '@/models/index';

export interface DatasetsState {
  datasets: Record<string, DatasetFullDetailsDto>;
  isLoading: boolean;
  error: string | null;
}

export enum DatasetMutationTypes {
  SET_DATASET = 'SET_DATASET',
  SET_LOADING = 'SET_LOADING',
  SET_ERROR = 'SET_ERROR'
}

export enum DatasetActionTypes {
  FETCH_DATASET = 'FETCH_DATASET'
}
