import { GetterTree } from 'vuex';
import { DatasetsState } from './DatasetMetadataTypes';
import { RootState } from '@/store/StoreTypes';

export const getters: GetterTree<DatasetsState, RootState> = {
  getDatasetById: (state) => (id: string) => {
    return state.datasets[id] || null;
  }
};
