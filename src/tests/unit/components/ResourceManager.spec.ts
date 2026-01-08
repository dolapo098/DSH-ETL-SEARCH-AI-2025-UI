import { shallowMount, VueWrapper } from "@vue/test-utils";
import { describe, it, expect, beforeEach, afterEach } from "vitest";

// Component under test
import ResourceManager from "@/components/ResourceManager.vue";

// --- Test data ---
const mockFiles = [
	{ dataFileID: 1, title: "File 1", description: "Desc 1", fileType: "CSV", downloadUrl: "http://test.com/1" },
	{ dataFileID: 2, title: "File 2", description: "Desc 2", fileType: "PDF", downloadUrl: null },
];

describe("ResourceManager.vue", () => {
	let wrapper: VueWrapper<any> | null = null;

	afterEach(() => {
		wrapper?.unmount();
	});

	it("Mounts", () => {
		wrapper = shallowMount(ResourceManager, {
			props: { dataFiles: [] },
		});
		expect(wrapper.exists()).toBeTruthy();
	});

	it("shows empty state when no dataFiles", () => {
		wrapper = shallowMount(ResourceManager, {
			props: { dataFiles: [] },
		});
		expect(wrapper.find("[data-cy='resource-empty']").exists()).toBeTruthy();
		expect(wrapper.find("[data-cy='resource-card']").exists()).toBeFalsy();
	});

	it("renders list of resource cards", () => {
		wrapper = shallowMount(ResourceManager, {
			props: { dataFiles: mockFiles },
		});
		const cards = wrapper.findAll("[data-cy='resource-card']");
		expect(cards.length).toBe(2);
		expect(cards[0].text()).toContain("File 1");
	});

	it("shows download button when url is present", () => {
		wrapper = shallowMount(ResourceManager, {
			props: { dataFiles: mockFiles },
		});
		const cards = wrapper.findAll("[data-cy='resource-card']");
		expect(cards[0].find("[data-cy='resource-download']").exists()).toBeTruthy();
		expect(cards[0].find("[data-cy='resource-no-download']").exists()).toBeFalsy();
	});

	it("shows unavailable message when url is missing", () => {
		wrapper = shallowMount(ResourceManager, {
			props: { dataFiles: mockFiles },
		});
		const cards = wrapper.findAll("[data-cy='resource-card']");
		expect(cards[1].find("[data-cy='resource-download']").exists()).toBeFalsy();
		expect(cards[1].find("[data-cy='resource-no-download']").exists()).toBeTruthy();
	});
});
