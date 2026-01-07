import { Store } from 'vuex';
import { SearchState } from './modules/semanticSearch/SemanticSearchTypes';
import { DatasetsState } from './modules/datasetMetadata/DatasetMetadataTypes';
import { UIState } from './modules/uiShell/UIShellTypes';

export interface RootState {
  semanticSearch: SearchState;
  datasetMetadata: DatasetsState;
  uiShell: UIState;
}

export type AppStore = Store<RootState>;

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: AppStore;
  }
}
