import { shallowMount, VueWrapper } from "@vue/test-utils";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// Component under test
import MapView from "@/views/MapView.vue";

// Mock ArcGIS - Since it's heavy and needs DOM
vi.mock("@arcgis/core/Map", () => {
	return {
		default: class {
			add = vi.fn();
		},
	};
});

vi.mock("@arcgis/core/WebMap", () => {
	return {
		default: class {
			add = vi.fn();
		},
	};
});

vi.mock("@arcgis/core/views/MapView", () => {
	return {
		default: class {
			container = null;
			on = vi.fn();
			destroy = vi.fn();
			ui = { add: vi.fn() };
			when = vi.fn().mockResolvedValue({});
			goTo = vi.fn().mockResolvedValue({});
		},
	};
});

vi.mock("@arcgis/core/layers/GraphicsLayer", () => {
	return {
		default: class {
			add = vi.fn();
			removeAll = vi.fn();
		},
	};
});

vi.mock("@arcgis/core/Graphic", () => ({
	default: class {},
}));

vi.mock("@arcgis/core/geometry/Polygon", () => ({
	default: class {},
}));

vi.mock("@arcgis/core/symbols/SimpleFillSymbol", () => ({
	default: class {},
}));

vi.mock("@arcgis/core/symbols/SimpleLineSymbol", () => ({
	default: class {},
}));

vi.mock("@arcgis/core/PopupTemplate", () => ({
	default: class {},
}));

describe("MapView.vue", () => {
	let wrapper: VueWrapper<any> | null = null;

	afterEach(() => {
		wrapper?.unmount();
		vi.restoreAllMocks();
	});

	it("Mounts", () => {
		wrapper = shallowMount(MapView);
		expect(wrapper.exists()).toBeTruthy();
	});

	it("renders map container components", () => {
		wrapper = shallowMount(MapView);
		expect(wrapper.find("[data-cy='map-view']").exists()).toBeTruthy();
		expect(wrapper.find("[data-cy='map-container']").exists()).toBeTruthy();
		expect(wrapper.find("[data-cy='map-canvas']").exists()).toBeTruthy();
	});

	it("renders legend and filters", () => {
		wrapper = shallowMount(MapView);
		expect(wrapper.find("[data-cy='map-legend']").exists()).toBeTruthy();
		expect(wrapper.find("[data-cy='map-filter-all']").exists()).toBeTruthy();
		expect(wrapper.find("[data-cy='map-filter-ongoing']").exists()).toBeTruthy();
		expect(wrapper.find("[data-cy='map-filter-completed']").exists()).toBeTruthy();
	});

	it("updates statusFilter when filter button is clicked", async () => {
		wrapper = shallowMount(MapView);
		const ongoingBtn = wrapper.find("[data-cy='map-filter-ongoing']");
		await ongoingBtn.trigger("click");
		expect(wrapper.vm.statusFilter).toBe("onGoing");
	});

	it("shows dataset info counts", async () => {
		wrapper = shallowMount(MapView);
		await wrapper.vm.$nextTick();
		const info = wrapper.find("[data-cy='map-dataset-info']");
		expect(info.exists()).toBeTruthy();
		expect(info.text()).toContain("Showing");
	});
});

