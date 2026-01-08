import { createStore } from "vuex";
import { semanticSearchModule } from "./modules/semanticSearch/SemanticSearchIndex";
import { datasetMetadataModule } from "./modules/datasetMetadata/DatasetMetadataIndex";
import { uiShellModule } from "./modules/uiShell/UIShellIndex";
import { chatAssistantModule } from "./modules/chatAssistant/ChatAssistantIndex";

export const store = createStore({
	modules: {
		semanticSearch: semanticSearchModule,
		datasetMetadata: datasetMetadataModule,
		uiShell: uiShellModule,
		chatAssistant: chatAssistantModule,
	},
	strict: process.env.NODE_ENV !== "production",
});

export default store;

export * from "./StoreTypes";
export * from "./modules/semanticSearch/SemanticSearchTypes";
export * from "./modules/datasetMetadata/DatasetMetadataTypes";
export * from "./modules/uiShell/UIShellTypes";
export * from "./modules/chatAssistant/ChatAssistantTypes";
