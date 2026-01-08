import { createStore, StoreOptions } from "vuex";
import { shallowMount, VueWrapper } from "@vue/test-utils";
import flushPromises from "flush-promises";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// Component under test
import SearchView from "@/views/SearchView.vue";

// Store/types
import { Modules } from "@/store/StoreModuleTypes";
import { RootState } from "@/store/StoreTypes";
import {
	SearchActionTypes,
	SearchMutationTypes,
} from "@/store/modules/semanticSearch/SemanticSearchTypes";
import { SearchResultItem } from "@/models/dto.types";

// --- Test data ---
const propsData = {};
const mockResults: SearchResultItem[] = [
	new SearchResultItem({
		identifier: "ds1",
		title: "Dataset 1",
		description: "Desc 1",
		score: 0.9,
	}),
	new SearchResultItem({
		identifier: "ds2",
		title: "Dataset 2",
		description: "Desc 2",
		score: 0.8,
	}),
];

// --- Factory: fresh store per test ---
function createDefaultStore(): StoreOptions<RootState> {
	return {
		state: {
			semanticSearch: {
				query: "",
				results: [],
				isLoading: false,
				error: null,
				totalCount: 0,
				currentPage: 1,
				pageSize: 10,
				totalPages: 0,
				searchType: "semantic",
				suggestions: [],
				recentSearches: [],
				filters: null,
				selectedDatasetId: null,
			},
			datasetMetadata: {} as any,
			uiShell: {} as any,
		} as RootState,
		modules: {
			[Modules.SemanticSearch]: {
				namespaced: true,
				state: {
					query: "",
					results: [],
					isLoading: false,
					error: null,
					totalCount: 0,
					currentPage: 1,
					pageSize: 10,
					totalPages: 0,
				},
				actions: {
					[SearchActionTypes.PERFORM_SEARCH]: vi.fn().mockResolvedValue(null),
				},
				mutations: {
					[SearchMutationTypes.SET_QUERY]: vi.fn(),
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
	return shallowMount(SearchView, {
		global: {
			plugins: [store],
			stubs: ["router-link"],
		},
		propsData: props,
	});
}

// --- Tests ---
describe("SearchView.vue", () => {
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

	it("calls PERFORM_SEARCH when search button is clicked", async () => {
		wrapper = shallowMountComponent(storeOptions);
		const input = wrapper.find("[data-cy='search-input']");
		const button = wrapper.find("[data-cy='search-button']");

		await wrapper.setData({ localQuery: "climate" });
		await button.trigger("click");

		expect(
			storeOptions.modules[Modules.SemanticSearch].mutations[SearchMutationTypes.SET_QUERY]
		).toHaveBeenCalledWith(expect.anything(), "climate");
		expect(
			storeOptions.modules[Modules.SemanticSearch].actions[SearchActionTypes.PERFORM_SEARCH]
		).toHaveBeenCalledWith(expect.anything(), { query: "climate", page: 1 });
	});

	it("renders results from store state", async () => {
		storeOptions.modules[Modules.SemanticSearch].state.results = mockResults;
		storeOptions.modules[Modules.SemanticSearch].state.totalCount = 2;

		wrapper = shallowMountComponent(storeOptions);
		await wrapper.vm.$nextTick();

		const resultsContainer = wrapper.find("[data-cy='search-results']");
		expect(resultsContainer.exists()).toBeTruthy();

		const cards = wrapper.findAll("[data-cy='search-result-card']");
		expect(cards.length).toBe(2);
		expect(cards[0].text()).toContain("Dataset 1");
	});

	it("shows empty state when no results", async () => {
		storeOptions.modules[Modules.SemanticSearch].state.results = [];
		storeOptions.modules[Modules.SemanticSearch].state.query = "nothing";

		wrapper = shallowMountComponent(storeOptions);
		await wrapper.vm.$nextTick();

		expect(wrapper.find("[data-cy='search-empty-with-query']").exists()).toBeTruthy();
	});

	it("handles pagination next button click", async () => {
		storeOptions.modules[Modules.SemanticSearch].state.results = mockResults;
		storeOptions.modules[Modules.SemanticSearch].state.currentPage = 1;
		storeOptions.modules[Modules.SemanticSearch].state.totalPages = 2;

		wrapper = shallowMountComponent(storeOptions);
		await wrapper.vm.$nextTick();

		const nextButton = wrapper.find("[data-cy='search-next-page']");
		await nextButton.trigger("click");

		expect(
			storeOptions.modules[Modules.SemanticSearch].actions[SearchActionTypes.PERFORM_SEARCH]
		).toHaveBeenCalledWith(expect.anything(), { page: 2 });
	});

	it("disables previous button on first page", async () => {
		storeOptions.modules[Modules.SemanticSearch].state.results = mockResults;
		storeOptions.modules[Modules.SemanticSearch].state.currentPage = 1;
		storeOptions.modules[Modules.SemanticSearch].state.totalPages = 2;

		wrapper = shallowMountComponent(storeOptions);
		await wrapper.vm.$nextTick();

		const prevButton = wrapper.find("[data-cy='search-prev-page']");
		expect(prevButton.attributes("disabled")).toBeDefined();
	});
});
