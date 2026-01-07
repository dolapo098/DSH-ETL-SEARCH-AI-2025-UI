import { ActionTree } from 'vuex';
import { SearchState, SearchActionTypes, SearchMutationTypes } from './types';
import { RootState } from '@/store/types';
import { datasetService } from '@/services/datasetService';

export const actions: ActionTree<SearchState, RootState> = {
  async [SearchActionTypes.PERFORM_SEARCH]({ commit, state }, payload?: { query?: string }) {
    commit(SearchMutationTypes.SET_LOADING, true);
    commit(SearchMutationTypes.SET_ERROR, null);

    const queryToUse = payload?.query || state.query;

    try {
      const results = await datasetService.searchDatasets(queryToUse);

      commit(SearchMutationTypes.SET_RESULTS, {
        results,
        totalCount: results.length,
        totalPages: 1
      });
    } catch (error: any) {
      commit(SearchMutationTypes.SET_ERROR, error.message || 'Failed to perform search');
    } finally {
      commit(SearchMutationTypes.SET_LOADING, false);
    }
  },

  async [SearchActionTypes.SELECT_DATASET]({ commit }, identifier: string) {
    commit(SearchMutationTypes.SET_SELECTED_DATASET, identifier);
  }
};
