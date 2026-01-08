import { createStore, StoreOptions } from "vuex";
import { shallowMount, VueWrapper } from "@vue/test-utils";
import flushPromises from "flush-promises";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// Component under test
import EtlControls from "@/components/EtlControls.vue";

// Store/types
import { Modules } from "@/store/StoreModuleTypes";
import { RootState } from "@/store/StoreTypes";
import {
	DatasetActionTypes,
	DatasetMutationTypes,
} from "@/store/modules/datasetMetadata/DatasetMetadataTypes";

// --- Test data ---
const propsData = {};

// --- Factory: fresh store per test ---
function createDefaultStore(): StoreOptions<RootState> {
	return {
		state: {
			semanticSearch: {} as any,
			datasetMetadata: {
				isProcessingAll: false,
				isProcessingOne: false,
				processMessage: null,
				validationMessage: null,
				datasets: {},
				selectedDataset: null,
				isLoading: false,
				error: null,
				stats: null,
			},
			uiShell: {} as any,
		} as RootState,
		getters: {
			getFeature: () => vi.fn().mockReturnValue(true),
		},
		modules: {
			[Modules.DatasetMetadata]: {
				namespaced: true,
				state: {
					isProcessingAll: false,
					isProcessingOne: false,
					processMessage: null,
					validationMessage: null,
				},
				actions: {
					[DatasetActionTypes.PROCESS_ALL]: vi.fn().mockResolvedValue(null),
					[DatasetActionTypes.PROCESS_IDENTIFIER]: vi.fn().mockResolvedValue(null),
				},
				mutations: {
					[DatasetMutationTypes.SET_VALIDATION_MESSAGE]: vi.fn(),
				},
			},
		},
	} as any;
}

// --- Reusable mount helper ---
function shallowMountComponent(
	mockStoreOptions: StoreOptions<RootState>,
	props = propsData
): VueWrapper<any> {
	const store = createStore(mockStoreOptions);
	return shallowMount(EtlControls, {
		global: {
			plugins: [store],
		},
		propsData: props,
	});
}

// --- Tests ---
describe("EtlControls.vue", () => {
	let wrapper: VueWrapper<any> | null = null;
	let storeOptions: any = null;

	beforeEach(() => {
		storeOptions = createDefaultStore();
	});

	afterEach(() => {
		wrapper?.unmount();
		vi.restoreAllMocks();
	});

	it("Mounts", () => {
		wrapper = shallowMountComponent(storeOptions);
		expect(wrapper.exists()).toBeTruthy();
	});

	it('calls PROCESS_ALL when "Process All" button is clicked', async () => {
		wrapper = shallowMountComponent(storeOptions);
		const button = wrapper.find("[data-cy='etl-process-all']");

		await button.trigger("click");

		expect(
			storeOptions.modules[Modules.DatasetMetadata].actions[DatasetActionTypes.PROCESS_ALL]
		).toHaveBeenCalledTimes(1);
	});

	it('calls PROCESS_IDENTIFIER when "Process Identifier" button is clicked with input', async () => {
		wrapper = shallowMountComponent(storeOptions);
		const input = wrapper.find("[data-cy='etl-identifier-input']");
		const button = wrapper.find("[data-cy='etl-process-one']");

		await wrapper.setData({ identifier: "test-id" });
		await button.trigger("click");

		expect(
			storeOptions.modules[Modules.DatasetMetadata].actions[DatasetActionTypes.PROCESS_IDENTIFIER]
		).toHaveBeenCalledWith(expect.anything(), "test-id");
	});

	it('disables "Process Identifier" button when identifier is empty', async () => {
		wrapper = shallowMountComponent(storeOptions);
		await wrapper.setData({ identifier: "" });
		await wrapper.vm.$nextTick();

		const button = wrapper.find("[data-cy='etl-process-one']");
		expect(button.attributes("disabled")).toBeDefined();
	});

	it("calls setValidationMessage when processOne is called with empty identifier", async () => {
		wrapper = shallowMountComponent(storeOptions);
		await wrapper.setData({ identifier: "" });

		// Call the method directly since the button is disabled in the template
		await wrapper.vm.processOne();

		expect(
			storeOptions.modules[Modules.DatasetMetadata].mutations[
				DatasetMutationTypes.SET_VALIDATION_MESSAGE
			]
		).toHaveBeenCalledWith(expect.anything(), "Identifier is required.");
	});

	it("displays process message from store when present", async () => {
		const message = "Started processing...";
		storeOptions.modules[Modules.DatasetMetadata].state.processMessage = message;

		wrapper = shallowMountComponent(storeOptions);
		await wrapper.vm.$nextTick();

		const messageElement = wrapper.find("[data-cy='etl-process-message']");
		expect(messageElement.exists()).toBeTruthy();
		expect(messageElement.text()).toContain(message);
	});

	it('disables "Process All" button when isProcessingAll is true', async () => {
		storeOptions.modules[Modules.DatasetMetadata].state.isProcessingAll = true;

		wrapper = shallowMountComponent(storeOptions);
		await wrapper.vm.$nextTick();

		const button = wrapper.find("[data-cy='etl-process-all']");
		expect(button.attributes("disabled")).toBeDefined();
	});
});
