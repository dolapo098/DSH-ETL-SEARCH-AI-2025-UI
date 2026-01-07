import { GetterTree } from 'vuex';
import { UIState } from './UIShellTypes';
import { RootState } from '@/store/StoreTypes';

export const getters: GetterTree<UIState, RootState> = {
  activeNotifications: (state) => state.notifications,
  hasNotifications: (state): boolean => state.notifications.length > 0
};
