import { GetterTree } from 'vuex';
import { UIState } from './types';
import { RootState } from '@/store/types';

export const getters: GetterTree<UIState, RootState> = {
  activeNotifications: (state) => state.notifications,
  hasNotifications: (state): boolean => state.notifications.length > 0
};
