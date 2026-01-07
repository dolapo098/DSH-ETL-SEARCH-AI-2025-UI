import { ActionTree } from 'vuex';
import { DatasetsState, DatasetActionTypes, DatasetMutationTypes } from './DatasetMetadataTypes';
import { RootState } from '@/store/StoreTypes';
import { datasetService } from '@/services/datasetService';
import { ProcessResultDto } from '@/models/dto.types';

export const actions: ActionTree<DatasetsState, RootState> = {
  async [DatasetActionTypes.FETCH_DATASET]({ commit, state }, identifier: string) {
    if ( state.datasets[identifier] )
    {
      commit(DatasetMutationTypes.SET_SELECTED_DATASET, state.datasets[identifier]);
      return state.datasets[identifier];
    }

    commit(DatasetMutationTypes.SET_LOADING, true);
    commit(DatasetMutationTypes.SET_ERROR, null);

    try {
      const dataset = await datasetService.getDatasetByIdentifier(identifier);

      if ( dataset )
      {
        commit(DatasetMutationTypes.SET_DATASET, dataset);
        commit(DatasetMutationTypes.SET_SELECTED_DATASET, dataset);
        return dataset;
      }
      else
      {
        commit(DatasetMutationTypes.SET_ERROR, 'Dataset not found');
        return null;
      }
    } catch (error: any) {
      commit(DatasetMutationTypes.SET_ERROR, error.message || 'Failed to fetch dataset');
      return null;
    } finally {
      commit(DatasetMutationTypes.SET_LOADING, false);
    }
  },

  async [DatasetActionTypes.FETCH_STATS]({ commit }) {
    try {
      const stats = await datasetService.getStats();
      commit(DatasetMutationTypes.SET_STATS, stats);
    } catch (error: any) {
      console.error('Failed to fetch stats:', error);
    }
  },

  async [DatasetActionTypes.PROCESS_ALL]({ commit }) {
    commit(DatasetMutationTypes.SET_VALIDATION_MESSAGE, null);
    commit(DatasetMutationTypes.SET_PROCESS_MESSAGE, null);
    commit(DatasetMutationTypes.SET_PROCESSING_ALL, true);

    try {
      const result: ProcessResultDto = await datasetService.processAllDatasets();
      commit(DatasetMutationTypes.SET_PROCESS_MESSAGE, result.message || 'Processing all datasets started.');
    } catch (error: any) {
      commit(DatasetMutationTypes.SET_PROCESS_MESSAGE, error.response?.data || error.message || 'Failed to start processing all datasets');
    } finally {
      commit(DatasetMutationTypes.SET_PROCESSING_ALL, false);
    }
  },

  async [DatasetActionTypes.PROCESS_IDENTIFIER]({ commit }, identifier: string) {
    if ( !identifier )
    {
      commit(DatasetMutationTypes.SET_VALIDATION_MESSAGE, 'Identifier is required.');
      return;
    }

    commit(DatasetMutationTypes.SET_VALIDATION_MESSAGE, null);
    commit(DatasetMutationTypes.SET_PROCESS_MESSAGE, null);
    commit(DatasetMutationTypes.SET_PROCESSING_ONE, true);

    try {
      const result: ProcessResultDto = await datasetService.processDataset(identifier);
      commit(DatasetMutationTypes.SET_PROCESS_MESSAGE, result.message || `Processing started for ${identifier}.`);
    } catch (error: any) {
      commit(DatasetMutationTypes.SET_PROCESS_MESSAGE, error.response?.data || error.message || 'Failed to start processing this dataset');
    } finally {
      commit(DatasetMutationTypes.SET_PROCESSING_ONE, false);
    }
  }
};
