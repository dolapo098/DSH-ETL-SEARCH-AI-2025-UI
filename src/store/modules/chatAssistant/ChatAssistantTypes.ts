export interface ChatMessage {
	id: string;
	role: "user" | "assistant";
	content: string;
	timestamp: Date;
}

export interface ChatState {
	isOpen: boolean;
	messages: ChatMessage[];
	isLoading: boolean;
}

export enum ChatMutationTypes {
	TOGGLE_CHAT = "TOGGLE_CHAT",
	ADD_MESSAGE = "ADD_MESSAGE",
	SET_LOADING = "SET_LOADING",
	CLEAR_MESSAGES = "CLEAR_MESSAGES",
}

export enum ChatActionTypes {
	SEND_MESSAGE = "SEND_MESSAGE",
	INITIALIZE_CHAT = "INITIALIZE_CHAT",
}
