import { ChatMessage } from "@/store/modules/chatAssistant/ChatAssistantTypes";

export class ChatPersistenceService {
	private static readonly STORAGE_KEY = "dsh_chat_history";

	public static saveHistory(history: ChatMessage[]): void {
		try {
			const serialized = JSON.stringify(history);
			localStorage.setItem(this.STORAGE_KEY, serialized);
		} catch (error) {
			console.error("Failed to persist chat history:", error);
		}
	}

	public static loadHistory(): ChatMessage[] {
		const data = localStorage.getItem(this.STORAGE_KEY);

		if (!data) {
			return [];
		}

		try {
			return JSON.parse(data);
		} catch {
			return [];
		}
	}

	public static clear(): void {
		localStorage.removeItem(this.STORAGE_KEY);
	}
}

