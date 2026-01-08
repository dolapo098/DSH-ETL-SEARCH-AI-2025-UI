import { Store } from "vuex";
import { SearchState } from "./modules/semanticSearch/SemanticSearchTypes";
import { DatasetsState } from "./modules/datasetMetadata/DatasetMetadataTypes";
import { UIState } from "./modules/uiShell/UIShellTypes";
import { ChatState } from "./modules/chatAssistant/ChatAssistantTypes";

export interface RootState {
	semanticSearch: SearchState;
	datasetMetadata: DatasetsState;
	uiShell: UIState;
	chatAssistant: ChatState;
}

export interface AppStore extends Store<RootState> {}
