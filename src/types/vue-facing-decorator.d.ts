import { Store } from 'vuex';
import { Router, RouteLocationNormalizedLoaded } from 'vue-router';
import { RootState } from '@/store/types';

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $store: Store<RootState>;
    $router: Router;
    $route: RouteLocationNormalizedLoaded;
  }
}
