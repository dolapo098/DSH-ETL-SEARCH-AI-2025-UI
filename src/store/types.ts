import { Store } from 'vuex';
import { SearchState } from './modules/search/types';
import { DatasetsState } from './modules/datasets/types';
import { UIState } from './modules/ui/types';

export interface RootState {
  search: SearchState;
  datasets: DatasetsState;
  ui: UIState;
}

export type AppStore = Store<RootState>;

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: AppStore;
  }
}
