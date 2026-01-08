import { shallowMount, VueWrapper } from "@vue/test-utils";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// Mock ArcGIS - Before importing component
vi.mock("@arcgis/core/Map", () => ({
	default: class {
		add = vi.fn();
	},
}));

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

// Component under test
import GeospatialMapper from "@/components/GeospatialMapper.vue";

// --- Test data ---
const mockGeoData = {
	boundingBox: "<westBoundLongitude>10</westBoundLongitude><eastBoundLongitude>20</eastBoundLongitude><southBoundLatitude>30</southBoundLatitude><northBoundLatitude>40</northBoundLatitude>",
	abstract: "Test Abstract",
	temporalExtentStart: "2020-01-01",
	temporalExtentEnd: "2021-01-01",
};

describe("GeospatialMapper.vue", () => {
	let wrapper: VueWrapper<any> | null = null;

	afterEach(() => {
		wrapper?.unmount();
	});

	it("Mounts", () => {
		wrapper = shallowMount(GeospatialMapper, {
			props: { geospatialData: null },
		});
		expect(wrapper.exists()).toBeTruthy();
	});

	it("renders no-data message when no boundingBox", () => {
		wrapper = shallowMount(GeospatialMapper, {
			props: { geospatialData: null },
		});
		expect(wrapper.find(".no-data").exists()).toBeTruthy();
		expect(wrapper.find("[data-cy='geospatial-map-container']").exists()).toBeFalsy();
	});

	it("parses XML bounding box correctly", () => {
		wrapper = shallowMount(GeospatialMapper, {
			props: { geospatialData: mockGeoData },
		});
		
		expect(wrapper.vm.parsedBox).toEqual({
			west: 10,
			east: 20,
			south: 30,
			north: 40,
		});
	});

	it("renders coordinate info when boundingBox is present", async () => {
		wrapper = shallowMount(GeospatialMapper, {
			props: { geospatialData: mockGeoData },
		});
		await wrapper.vm.$nextTick();

		expect(wrapper.find("[data-cy='geospatial-map-container']").exists()).toBeTruthy();
		const coordValues = wrapper.findAll(".coord-value");
		expect(coordValues[0].text()).toContain("10");
		expect(coordValues[1].text()).toContain("20");
	});

	it("renders abstract when present", () => {
		wrapper = shallowMount(GeospatialMapper, {
			props: { geospatialData: mockGeoData },
		});
		expect(wrapper.find(".abstract-section").text()).toContain("Test Abstract");
	});
});
