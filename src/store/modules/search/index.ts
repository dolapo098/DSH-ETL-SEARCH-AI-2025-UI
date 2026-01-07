import { Module } from 'vuex';
import { SearchState } from './types';
import { RootState } from '@/store/types';
import { state } from './state';
import { mutations } from './mutations';
import { actions } from './actions';
import { getters } from './getters';

export const searchModule: Module<SearchState, RootState> = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
