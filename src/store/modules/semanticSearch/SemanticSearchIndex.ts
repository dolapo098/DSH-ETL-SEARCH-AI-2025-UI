import { Module } from 'vuex';
import { SearchState } from './SemanticSearchTypes';
import { RootState } from '@/store/StoreTypes';
import { state } from './SemanticSearchState';
import { mutations } from './SemanticSearchMutations';
import { actions } from './SemanticSearchActions';
import { getters } from './SemanticSearchGetters';

export const semanticSearchModule: Module<SearchState, RootState> = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
