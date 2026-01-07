import { Module } from 'vuex';
import { UIState } from './types';
import { RootState } from '@/store/types';
import { state } from './state';
import { mutations } from './mutations';
import { actions } from './actions';
import { getters } from './getters';

export const uiModule: Module<UIState, RootState> = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
