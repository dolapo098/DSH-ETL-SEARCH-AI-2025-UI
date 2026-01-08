import { createStore, StoreOptions } from "vuex";
import { shallowMount, VueWrapper } from "@vue/test-utils";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// Component under test
import HomeView from "@/views/HomeView.vue";

// Store/types
import { Modules } from "@/store/StoreModuleTypes";
import { RootState } from "@/store/StoreTypes";
import { SearchMutationTypes } from "@/store/modules/semanticSearch/SemanticSearchTypes";
import { DatasetActionTypes } from "@/store/modules/datasetMetadata/DatasetMetadataTypes";

// --- Factory: fresh store per test ---
function createDefaultStore(): StoreOptions<RootState> {
	return {
		state: {
			semanticSearch: {} as any,
			datasetMetadata: {
				stats: { totalDatasets: 100, totalProviders: 10 },
			} as any,
			uiShell: {} as any,
		} as RootState,
		modules: {
			[Modules.SemanticSearch]: {
				namespaced: true,
				mutations: {
					[SearchMutationTypes.SET_QUERY]: vi.fn(),
				},
			},
			[Modules.DatasetMetadata]: {
				namespaced: true,
				state: {
					stats: { totalDatasets: 100, totalProviders: 10 },
				},
				actions: {
					[DatasetActionTypes.FETCH_STATS]: vi.fn().mockResolvedValue(null),
				},
			},
		},
	} as any;
}

// --- Reusable mount helper ---
function shallowMountComponent(
	mockStoreOptions: StoreOptions<RootState>,
	props = {}
): VueWrapper<any> {
	const store = createStore(mockStoreOptions);
	return shallowMount(HomeView, {
		global: {
			plugins: [store],
			stubs: ["router-link", "EtlControls"],
		},
		propsData: props,
	});
}

describe("HomeView.vue", () => {
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

	it("calls FETCH_STATS on mount", () => {
		wrapper = shallowMountComponent(storeOptions);
		expect(
			storeOptions.modules[Modules.DatasetMetadata].actions[DatasetActionTypes.FETCH_STATS]
		).toHaveBeenCalled();
	});

	it("renders stats from store", async () => {
		wrapper = shallowMountComponent(storeOptions);
		await wrapper.vm.$nextTick();

		const datasetsStat = wrapper.find("[data-cy='home-stat-datasets']");
		const providersStat = wrapper.find("[data-cy='home-stat-providers']");

		expect(datasetsStat.text()).toContain("100");
		expect(providersStat.text()).toContain("10");
	});

	it("navigates to search when handleSearch is called with query", async () => {
		const mockRouter = { push: vi.fn() };
		const store = createStore(storeOptions);
		wrapper = shallowMount(HomeView, {
			global: {
				plugins: [store],
				stubs: ["router-link", "EtlControls"],
				mocks: { $router: mockRouter },
			},
		});

		await wrapper.setData({ searchQuery: "water" });
		await wrapper.vm.handleSearch();

		expect(
			storeOptions.modules[Modules.SemanticSearch].mutations[SearchMutationTypes.SET_QUERY]
		).toHaveBeenCalledWith(expect.anything(), "water");
		expect(mockRouter.push).toHaveBeenCalledWith("/search");
	});

	it("triggers search when example chip is clicked", async () => {
		const mockRouter = { push: vi.fn() };
		const store = createStore(storeOptions);
		wrapper = shallowMount(HomeView, {
			global: {
				plugins: [store],
				stubs: ["router-link", "EtlControls"],
				mocks: { $router: mockRouter },
			},
		});

		const exampleChip = wrapper.find("[data-cy='home-search-example']");
		await exampleChip.trigger("click");

		expect(
			storeOptions.modules[Modules.SemanticSearch].mutations[SearchMutationTypes.SET_QUERY]
		).toHaveBeenCalled();
		expect(mockRouter.push).toHaveBeenCalledWith("/search");
	});
});
