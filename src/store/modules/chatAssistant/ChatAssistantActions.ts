import { ActionTree } from "vuex";
import { RootState } from "../../StoreTypes";
import {
	ChatState,
	ChatActionTypes,
	ChatMutationTypes,
	ChatMessage,
} from "./ChatAssistantTypes";
import { pythonAxiosClient } from "@/services/axiosClient";

export interface AgentRequest {
	message: string;
	history: { role: string; content: string }[];
}

export interface AgentResponse {
	answer: string;
	suggested_query?: string;
	related_identifiers: string[];
}

export const actions: ActionTree<ChatState, RootState> = {
	async [ChatActionTypes.SEND_MESSAGE]({ state, commit }, text: string) {

		const userMsg: ChatMessage = {
			id: Date.now().toString(),
			role: "user",
			content: text,
			timestamp: new Date(),
		};

		commit(ChatMutationTypes.ADD_MESSAGE, userMsg);

		commit(ChatMutationTypes.SET_LOADING, true);

		try {

			const history = state.messages.map((m) => ({
				role: m.role,
				content: m.content,
			}));

			const response = await pythonAxiosClient.post<AgentResponse>("/agent/chat", {
				message: text,
				history: history,
			});

			const assistantMsg: ChatMessage = {
				id: Date.now().toString(),
				role: "assistant",
				content: response.data.answer,
				timestamp: new Date(),
			};

			commit(ChatMutationTypes.ADD_MESSAGE, assistantMsg);

		} catch (error: any) {

			const errorMsg: ChatMessage = {
				id: Date.now().toString(),
				role: "assistant",
				content:
					"I'm sorry, I encountered an error while processing your request. Please ensure the AI service is running.",
				timestamp: new Date(),
			};

			commit(ChatMutationTypes.ADD_MESSAGE, errorMsg);

		} finally {

			commit(ChatMutationTypes.SET_LOADING, false);

		}
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
