import { ActionTree } from 'vuex';
import { SearchState, SearchActionTypes, SearchMutationTypes } from './SemanticSearchTypes';
import { RootState } from '@/store/StoreTypes';
import { datasetService } from '@/services/datasetService';

export const actions: ActionTree<SearchState, RootState> = {
  async [SearchActionTypes.PERFORM_SEARCH]({ commit, state }, payload?: { query?: string; page?: number }) {
    commit(SearchMutationTypes.SET_LOADING, true);
    commit(SearchMutationTypes.SET_ERROR, null);

    const queryToUse = payload?.query !== undefined ? payload.query : state.query;
    const pageToUse = payload?.page !== undefined ? payload.page : state.currentPage;

    try {
      const { results, totalCount } = await datasetService.searchDatasets(queryToUse, pageToUse, state.pageSize);

      commit(SearchMutationTypes.SET_RESULTS, {
        results,
        totalCount,
        totalPages: Math.ceil(totalCount / state.pageSize),
        currentPage: pageToUse
      });
      
      if (queryToUse) {
        commit(SearchMutationTypes.ADD_RECENT_SEARCH, queryToUse);
      }
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
