import { Module } from 'vuex';
import { DatasetsState } from './DatasetMetadataTypes';
import { RootState } from '@/store/StoreTypes';
import { state } from './DatasetMetadataState';
import { mutations } from './DatasetMetadataMutations';
import { actions } from './DatasetMetadataActions';
import { getters } from './DatasetMetadataGetters';

export const datasetMetadataModule: Module<DatasetsState, RootState> = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
