import { MutationTree } from 'vuex';
import { DatasetsState, DatasetMutationTypes, DiscoveryStats } from './DatasetMetadataTypes';
import { DatasetFullDetailsDto } from '@/models/index';

export const mutations: MutationTree<DatasetsState> = {
  [DatasetMutationTypes.SET_DATASET](state, dataset: DatasetFullDetailsDto) {
    state.datasets[dataset.datasetMetadata.fileIdentifier] = dataset;
  },

  [DatasetMutationTypes.SET_SELECTED_DATASET](state, dataset: DatasetFullDetailsDto | null) {
    state.selectedDataset = dataset;
  },

  [DatasetMutationTypes.SET_LOADING](state, isLoading: boolean) {
    state.isLoading = isLoading;
  },

  [DatasetMutationTypes.SET_ERROR](state, error: string | null) {
    state.error = error;
  },

  [DatasetMutationTypes.SET_STATS](state, stats: DiscoveryStats) {
    state.stats = stats;
  },

  [DatasetMutationTypes.SET_PROCESSING_ALL](state, isProcessing: boolean) {
    state.isProcessingAll = isProcessing;
  },

  [DatasetMutationTypes.SET_PROCESSING_ONE](state, isProcessing: boolean) {
    state.isProcessingOne = isProcessing;
  },

  [DatasetMutationTypes.SET_PROCESS_MESSAGE](state, message: string | null) {
    state.processMessage = message;
  },

  [DatasetMutationTypes.SET_VALIDATION_MESSAGE](state, message: string | null) {
    state.validationMessage = message;
  }
};
