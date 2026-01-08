import { AppStore } from "@/store/StoreTypes";

declare module "@vue/runtime-core" {
	interface ComponentCustomProperties {
		$store: AppStore;
	}
}

