import { createStore, StoreOptions } from "vuex";
import { shallowMount, VueWrapper } from "@vue/test-utils";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// Mock ArcGIS - Before importing component that imports it
vi.mock("@arcgis/core/Map", () => ({ default: class {} }));
vi.mock("@arcgis/core/WebMap", () => ({ default: class { add = vi.fn(); } }));
vi.mock("@arcgis/core/views/MapView", () => ({ default: class { on = vi.fn(); destroy = vi.fn(); ui = { add: vi.fn() }; when = vi.fn().mockResolvedValue({}); goTo = vi.fn().mockResolvedValue({}); } }));
vi.mock("@arcgis/core/layers/GraphicsLayer", () => ({ default: class { add = vi.fn(); removeAll = vi.fn(); } }));
vi.mock("@arcgis/core/Graphic", () => ({ default: class {} }));
vi.mock("@arcgis/core/geometry/Polygon", () => ({ default: class {} }));

// Component under test
import DatasetDetailView from "@/views/DatasetDetailView.vue";

// Store/types
import { Modules } from "@/store/StoreModuleTypes";
import { RootState } from "@/store/StoreTypes";
import { DatasetFullDetailsDto } from "@/models/dto.types";

// --- Test data ---
const mockDataset = new DatasetFullDetailsDto({
	datasetMetadata: {
		fileIdentifier: "test-id",
		title: "Test Dataset",
		description: "Test Description",
		publicationDate: "2024-01-01",
	} as any,
	dataFiles: [],
	supportingDocuments: [],
	relationships: [],
});

// --- Factory: fresh store per test ---
function createDefaultStore(): StoreOptions<RootState> {
	return {
		state: {
			semanticSearch: {} as any,
			datasetMetadata: {
				selectedDataset: null,
				isLoading: false,
				error: null,
			},
			uiShell: {} as any,
		} as RootState,
		modules: {
			[Modules.DatasetMetadata]: {
				namespaced: true,
				state: {
					selectedDataset: null,
					isLoading: false,
					error: null,
				},
				actions: {
					FETCH_DATASET: vi.fn().mockResolvedValue(mockDataset),
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
	const mockRoute = { params: { id: "test-id" } };
	return shallowMount(DatasetDetailView, {
		global: {
			plugins: [store],
			stubs: ["router-link", "GeospatialMapper", "ResourceManager", "DocumentList", "ConnectivityWeb"],
			mocks: { $route: mockRoute },
		},
		propsData: props,
	});
}

describe("DatasetDetailView.vue", () => {
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

	it("calls FETCH_DATASET on mount with route id", () => {
		wrapper = shallowMountComponent(storeOptions);
		expect(
			storeOptions.modules[Modules.DatasetMetadata].actions.FETCH_DATASET
		).toHaveBeenCalledWith(expect.anything(), "test-id");
	});

	it("renders dataset content when dataset is present", async () => {
		storeOptions.modules[Modules.DatasetMetadata].state.selectedDataset = mockDataset;
		wrapper = shallowMountComponent(storeOptions);
		await wrapper.vm.$nextTick();

		expect(wrapper.find("[data-cy='dataset-content']").exists()).toBeTruthy();
		expect(wrapper.find(".dataset-title").text()).toBe("Test Dataset");
	});

	it("shows loading state when isLoading is true", async () => {
		storeOptions.modules[Modules.DatasetMetadata].state.isLoading = true;
		wrapper = shallowMountComponent(storeOptions);
		await wrapper.vm.$nextTick();

		expect(wrapper.find(".loading-container").exists()).toBeTruthy();
		expect(wrapper.find("[data-cy='dataset-content']").exists()).toBeFalsy();
	});

	it("switches tabs when tab button is clicked", async () => {
		storeOptions.modules[Modules.DatasetMetadata].state.selectedDataset = mockDataset;
		wrapper = shallowMountComponent(storeOptions);
		await wrapper.vm.$nextTick();

		const resourcesTab = wrapper.find("[data-cy='dataset-tab-resources']");
		await resourcesTab.trigger("click");

		expect(wrapper.vm.activeTab).toBe("resources");
		expect(wrapper.find("[data-cy='dataset-tab-resources']").classes()).toContain("active");
	});
});
