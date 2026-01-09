<template>
	<div class="chat-assistant" :class="{ 'is-open': isOpen }" data-cy="chat-assistant">
		<!-- Chat Bubble (Toggle) -->
		<button
			v-if="!isOpen"
			class="chat-bubble"
			@click="toggleChat"
			data-cy="chat-toggle-open"
			title="Open Dataset Discovery Assistant"
		>
			<span class="bubble-icon">💬</span>
		</button>

		<!-- Chat Window -->
		<div v-else class="chat-window" data-cy="chat-window">
			<!-- Header -->
			<div class="chat-header">
				<div class="header-info">
					<span class="header-icon">🤖</span>
					<h3 class="header-title">Discovery Assistant</h3>
				</div>
				<button class="close-btn" @click="toggleChat" data-cy="chat-toggle-close">×</button>
			</div>

			<!-- Messages Area -->
			<div class="chat-messages" ref="messageContainer">
				<div
					v-for="msg in messages"
					:key="msg.id"
					class="message-row"
					:class="msg.role"
					data-cy="chat-message"
				>
					<div class="message-content">
						<span v-for="(part, index) in parseMessage(msg.content)" :key="index">
							<template v-if="part.type === 'text'">{{ part.value }}</template>
							<router-link
								v-else
								:to="'/dataset/' + part.value"
								class="dataset-link"
								title="View Dataset Details"
							>
								[Dataset: {{ part.value.substring(0, 8) }}...]
							</router-link>
						</span>
						<span class="message-time">{{ formatTime(msg.timestamp) }}</span>
					</div>
				</div>

				<!-- Loading / Thinking State -->
				<div v-if="isLoading" class="message-row assistant" data-cy="chat-loading">
					<div class="message-content thinking">
						<span class="dot">.</span><span class="dot">.</span><span class="dot">.</span>
					</div>
				</div>
			</div>

			<!-- Input Area -->
			<div class="chat-input-area">
				<input
					v-model="userInput"
					type="text"
					placeholder="Ask me anything about datasets..."
					@keyup.enter="handleSend"
					:disabled="isLoading"
					data-cy="chat-input"
				/>
				<button
					class="send-btn"
					@click="handleSend"
					:disabled="!userInput.trim() || isLoading"
					data-cy="chat-send"
				>
					<span class="send-icon">➤</span>
				</button>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-facing-decorator";
import { namespace } from "@/store/StoreDecorators";
import { Modules } from "@/store/StoreModuleTypes";
import {
	ChatActionTypes,
	ChatMutationTypes,
	ChatMessage,
} from "@/store/modules/chatAssistant/ChatAssistantTypes";

const ChatStore = namespace(Modules.ChatAssistant);

@Component({
	name: "ChatAssistant",
})
export default class ChatAssistant extends Vue {
	private userInput: string = "";

	declare $refs: {
		messageContainer: HTMLElement;
	};

	@ChatStore.State((s: any) => s.isOpen) public readonly isOpen!: boolean;
	@ChatStore.State((s: any) => s.messages) public readonly messages!: ChatMessage[];
	@ChatStore.State((s: any) => s.isLoading) public readonly isLoading!: boolean;

	@ChatStore.Mutation(ChatMutationTypes.TOGGLE_CHAT) public toggleChat!: () => void;
	@ChatStore.Action(ChatActionTypes.SEND_MESSAGE) public sendMessage!: (
		text: string
	) => Promise<void>;
	@ChatStore.Action(ChatActionTypes.INITIALIZE_CHAT) public initializeChat!: () => Promise<void>;

	public mounted(): void {
		this.initializeChat();
	}

	@Watch("messages", { deep: true })
	public onMessagesChange(): void {
		this.$nextTick(() => {
			this.scrollToBottom();
		});
	}

	private handleSend(): void {
		if (this.userInput.trim() && !this.isLoading) {
			this.sendMessage(this.userInput.trim());
			this.userInput = "";
		}
	}

	private parseMessage(content: string): { type: "text" | "link"; value: string }[] {
		const parts: { type: "text" | "link"; value: string }[] = [];
		const regex = /\[ID:\s*([^\]]+)\]/g;
		let lastIndex = 0;
		let match;

		while ((match = regex.exec(content)) !== null) {
			if (match.index > lastIndex) {
				parts.push({ type: "text", value: content.substring(lastIndex, match.index) });
			}

			parts.push({ type: "link", value: match[1].trim() });
			lastIndex = regex.lastIndex;
		}

		if (lastIndex < content.length) {
			parts.push({ type: "text", value: content.substring(lastIndex) });
		}

		return parts.length > 0 ? parts : [{ type: "text", value: content }];
	}

	private scrollToBottom(): void {
		const container = this.$refs.messageContainer;
		if (container) {
			container.scrollTop = container.scrollHeight;
		}
	}

	private formatTime(date: Date): string {
		return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
	}
}
</script>

<style scoped>
.chat-assistant {
	position: fixed;
	bottom: 2rem;
	right: 2rem;
	z-index: 1000;
	font-family: inherit;
}

/* Bubble Icon */
.chat-bubble {
	width: 60px;
	height: 60px;
	border-radius: 50%;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	border: none;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: transform 0.2s;
}

.chat-bubble:hover {
	transform: scale(1.1);
}

.bubble-icon {
	font-size: 1.5rem;
	color: white;
}

/* Chat Window */
.chat-window {
	width: 350px;
	height: 500px;
	background: white;
	border-radius: 16px;
	box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
	display: flex;
	flex-direction: column;
	overflow: hidden;
	border: 1px solid #e2e8f0;
}

/* Header */
.chat-header {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	padding: 1rem;
	color: white;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.header-info {
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

.header-icon {
	font-size: 1.25rem;
}

.header-title {
	font-size: 1rem;
	font-weight: 600;
	margin: 0;
}

.close-btn {
	background: transparent;
	border: none;
	color: white;
	font-size: 1.5rem;
	cursor: pointer;
	line-height: 1;
}

/* Messages Area */
.chat-messages {
	flex: 1;
	overflow-y: auto;
	padding: 1rem;
	background: #f8fafc;
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

.message-row {
	display: flex;
	max-width: 85%;
}

.message-row.user {
	align-self: flex-end;
}

.message-row.assistant {
	align-self: flex-start;
}

.message-content {
	padding: 0.75rem 1rem;
	border-radius: 12px;
	font-size: 0.9rem;
	line-height: 1.4;
	position: relative;
	display: flex;
	flex-direction: column;
}

.user .message-content {
	background: #667eea;
	color: white;
	border-bottom-right-radius: 2px;
}

.assistant .message-content {
	background: white;
	color: #2d3748;
	border: 1px solid #e2e8f0;
	border-bottom-left-radius: 2px;
}

.message-time {
	font-size: 0.7rem;
	opacity: 0.7;
	margin-top: 0.25rem;
	align-self: flex-end;
}

/* Thinking Dots */
.thinking .dot {
	animation: blink 1.4s infinite both;
}

.thinking .dot:nth-child(2) {
	animation-delay: 0.2s;
}
.thinking .dot:nth-child(3) {
	animation-delay: 0.4s;
}

@keyframes blink {
	0% {
		opacity: 0.2;
	}
	20% {
		opacity: 1;
	}
	100% {
		opacity: 0.2;
	}
}

/* Input Area */
.chat-input-area {
	padding: 1rem;
	background: white;
	border-top: 1px solid #e2e8f0;
	display: flex;
	gap: 0.5rem;
}

.chat-input-area input {
	flex: 1;
	padding: 0.6rem 1rem;
	border: 1px solid #cbd5e0;
	border-radius: 20px;
	font-size: 0.9rem;
	outline: none;
}

.chat-input-area input:focus {
	border-color: #667eea;
}

.send-btn {
	width: 36px;
	height: 36px;
	border-radius: 50%;
	background: #667eea;
	color: white;
	border: none;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	transition: opacity 0.2s;
}

.send-btn:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

.send-icon {
	font-size: 1rem;
}

.dataset-link {
	color: #667eea;
	text-decoration: underline;
	font-weight: 500;
	cursor: pointer;
}

.dataset-link:hover {
	color: #764ba2;
}
</style>
