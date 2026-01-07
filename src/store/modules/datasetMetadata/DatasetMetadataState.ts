import { DatasetsState } from './DatasetMetadataTypes';

export const state: DatasetsState = {
  datasets: {},
  selectedDataset: null,
  isLoading: false,
  error: null,
  stats: null,
  isProcessingAll: false,
  isProcessingOne: false,
  processMessage: null,
  validationMessage: null
};
