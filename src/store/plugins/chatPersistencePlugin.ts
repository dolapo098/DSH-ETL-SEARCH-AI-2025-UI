import { Store, MutationPayload } from "vuex";
import { RootState } from "../StoreTypes";
import { ChatPersistenceService } from "@/services/ChatPersistenceService";
import { ChatMutationTypes } from "../modules/chatAssistant/ChatAssistantTypes";

export const chatPersistencePlugin = (store: Store<RootState>) => {
	const savedHistory = ChatPersistenceService.loadHistory();

	if (savedHistory.length > 0) {
		store.commit(`chatAssistant/${ChatMutationTypes.SET_HISTORY}`, savedHistory);
	}

	store.subscribe((mutation: MutationPayload, state: RootState) => {
		if (
			mutation.type === `chatAssistant/${ChatMutationTypes.ADD_MESSAGE}` ||
			mutation.type === `chatAssistant/${ChatMutationTypes.CLEAR_MESSAGES}`
		) {
			ChatPersistenceService.saveHistory(state.chatAssistant.messages);
		}
	});
};

