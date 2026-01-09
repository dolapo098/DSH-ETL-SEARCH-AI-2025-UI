import { MutationTree } from "vuex";
import { ChatState, ChatMutationTypes, ChatMessage } from "./ChatAssistantTypes";

export const mutations: MutationTree<ChatState> = {
	[ChatMutationTypes.TOGGLE_CHAT](state) {
		state.isOpen = !state.isOpen;
	},
	[ChatMutationTypes.ADD_MESSAGE](state, message: ChatMessage) {
		state.messages.push(message);
	},
	[ChatMutationTypes.SET_LOADING](state, isLoading: boolean) {
		state.isLoading = isLoading;
	},
	[ChatMutationTypes.CLEAR_MESSAGES](state) {
		state.messages = [];
	},
	[ChatMutationTypes.SET_HISTORY](state, history: ChatMessage[]) {
		state.messages = history;
	},
};
