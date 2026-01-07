import { GetterTree } from 'vuex';
import { DatasetsState } from './types';
import { RootState } from '@/store/types';

export const getters: GetterTree<DatasetsState, RootState> = {
  getDatasetById: (state) => (id: string) => {
    return state.datasets[id] || null;
  }
};
