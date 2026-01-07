import { Module } from 'vuex';
import { UIState } from './UIShellTypes';
import { RootState } from '@/store/StoreTypes';
import { state } from './UIShellState';
import { mutations } from './UIShellMutations';
import { actions } from './UIShellActions';
import { getters } from './UIShellGetters';

export const uiShellModule: Module<UIState, RootState> = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
