import { MutationTree } from 'vuex';
import { DatasetsState, DatasetMutationTypes } from './types';
import { DatasetFullDetailsDto } from '@/models/index';

export const mutations: MutationTree<DatasetsState> = {
  [DatasetMutationTypes.SET_DATASET](state, dataset: DatasetFullDetailsDto) {
    state.datasets[dataset.datasetMetadata.fileIdentifier] = dataset;
  },

  [DatasetMutationTypes.SET_LOADING](state, isLoading: boolean) {
    state.isLoading = isLoading;
  },

  [DatasetMutationTypes.SET_ERROR](state, error: string | null) {
    state.error = error;
  }
};
