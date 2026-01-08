import { ActionTree } from "vuex";
import { RootState } from "../../StoreTypes";
import { ChatState, ChatActionTypes, ChatMutationTypes, ChatMessage } from "./ChatAssistantTypes";

export const actions: ActionTree<ChatState, RootState> = {
	async [ChatActionTypes.SEND_MESSAGE]({ commit }, text: string) {
		// 1. Add user message
		const userMsg: ChatMessage = {
			id: Date.now().toString(),
			role: "user",
			content: text,
			timestamp: new Date(),
		};
		commit(ChatMutationTypes.ADD_MESSAGE, userMsg);

		// 2. Mock AI response for now (to test UI)
		commit(ChatMutationTypes.SET_LOADING, true);

		// Simulate network delay
		setTimeout(() => {
			const assistantMsg: ChatMessage = {
				id: (Date.now() + 1).toString(),
				role: "assistant",
				content: `I received your message: "${text}". I'm currently being integrated with the Discovery Agent backend to help you explore environmental datasets. Stay tuned!`,
				timestamp: new Date(),
			};
			commit(ChatMutationTypes.ADD_MESSAGE, assistantMsg);
			commit(ChatMutationTypes.SET_LOADING, false);
		}, 1500);
	},

	[ChatActionTypes.INITIALIZE_CHAT]({ state, commit }) {
		if (state.messages.length === 0) {
			const welcomeMsg: ChatMessage = {
				id: "welcome",
				role: "assistant",
				content:
					"Hello! I am your Dataset Discovery Assistant. How can I help you find environmental data today?",
				timestamp: new Date(),
			};
			commit(ChatMutationTypes.ADD_MESSAGE, welcomeMsg);
		}
	},
};
