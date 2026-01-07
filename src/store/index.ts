import { createStore } from 'vuex';
import { searchModule } from './modules/search';
import { datasetsModule } from './modules/datasets';
import { uiModule } from './modules/ui';

export const store = createStore({
  modules: {
    search: searchModule,
    datasets: datasetsModule,
    ui: uiModule
  },
  strict: process.env.NODE_ENV !== 'production'
});

export default store;

export * from './types';
export * from './modules/search/types';
export * from './modules/datasets/types';
export * from './modules/ui/types';
