/**
 * Core chat message interface.
 */
export interface ChatMessage {
	id: string;
	role: "user" | "assistant";
	content: string;
	timestamp: Date;
}

/**
 * Request payload for the Discovery Agent.
 */
export interface AgentRequest {
	message: string;
	history: ChatHistoryItem[];
}

/**
 * Simple history item interface for API communication.
 */
export interface ChatHistoryItem {
	role: string;
	content: string;
}

/**
 * Response payload from the Discovery Agent.
 */
export interface AgentResponse {
	answer: string;
	suggested_query?: string;
	related_identifiers: string[];
}

/**
 * Vuex module state interface.
 */
export interface ChatState {
	isOpen: boolean;
	messages: ChatMessage[];
	isLoading: boolean;
}
