import { Module } from 'vuex';
import { RootState } from '../../StoreTypes';
import { ChatState } from './ChatAssistantTypes';
import { state } from './ChatAssistantState';
import { mutations } from './ChatAssistantMutations';
import { actions } from './ChatAssistantActions';

export const chatAssistantModule: Module<ChatState, RootState> = {
  namespaced: true,
  state,
  mutations,
  actions
};

