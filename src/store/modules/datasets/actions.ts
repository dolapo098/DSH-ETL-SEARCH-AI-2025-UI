import { ActionTree } from 'vuex';
import { DatasetsState, DatasetActionTypes, DatasetMutationTypes } from './types';
import { RootState } from '@/store/types';
import { datasetService } from '@/services/datasetService';

export const actions: ActionTree<DatasetsState, RootState> = {
  async [DatasetActionTypes.FETCH_DATASET]({ commit, state }, identifier: string) {
    if (state.datasets[identifier]) {
      return state.datasets[identifier];
    }

    commit(DatasetMutationTypes.SET_LOADING, true);
    commit(DatasetMutationTypes.SET_ERROR, null);

    try {
      const dataset = await datasetService.getDatasetByIdentifier(identifier);

      if (dataset) {
        commit(DatasetMutationTypes.SET_DATASET, dataset);
        return dataset;
      } else {
        commit(DatasetMutationTypes.SET_ERROR, 'Dataset not found');
        return null;
      }
    } catch (error: any) {
      commit(DatasetMutationTypes.SET_ERROR, error.message || 'Failed to fetch dataset');
      return null;
    } finally {
      commit(DatasetMutationTypes.SET_LOADING, false);
    }
  }
};
