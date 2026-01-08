import { shallowMount, VueWrapper } from "@vue/test-utils";
import { describe, it, expect, beforeEach, afterEach } from "vitest";

// Component under test
import ConnectivityWeb from "@/components/ConnectivityWeb.vue";

// --- Test data ---
const mockRels = [
	{ datasetRelationshipID: 1, datasetID: "rel-1", relationshipType: "Parent", relationshipUri: "http://rel.com/1" },
	{ datasetRelationshipID: 2, datasetID: "rel-2", relationshipType: "See Also", relationshipUri: null },
];

describe("ConnectivityWeb.vue", () => {
	let wrapper: VueWrapper<any> | null = null;

	afterEach(() => {
		wrapper?.unmount();
	});

	it("Mounts", () => {
		wrapper = shallowMount(ConnectivityWeb, {
			props: { relationships: [] },
		});
		expect(wrapper.exists()).toBeTruthy();
	});

	it("shows empty state when no relationships", () => {
		wrapper = shallowMount(ConnectivityWeb, {
			props: { relationships: [] },
		});
		expect(wrapper.find("[data-cy='connectivity-empty']").exists()).toBeTruthy();
		expect(wrapper.find("[data-cy='connectivity-container']").exists()).toBeFalsy();
	});

	it("renders relationship list", () => {
		wrapper = shallowMount(ConnectivityWeb, {
			props: { relationships: mockRels },
		});
		expect(wrapper.find("[data-cy='connectivity-container']").exists()).toBeTruthy();
		expect(wrapper.findAll("[data-cy='relationship-card']").length).toBe(2);
	});

	it("shows relationship link when URI is present", () => {
		wrapper = shallowMount(ConnectivityWeb, {
			props: { relationships: mockRels },
		});
		const cards = wrapper.findAll("[data-cy='relationship-card']");
		expect(cards[0].find(".relationship-link").exists()).toBeTruthy();
		expect(cards[0].find("[data-cy='relationship-unavailable']").exists()).toBeFalsy();
	});

	it("shows unavailable message when URI is missing", () => {
		wrapper = shallowMount(ConnectivityWeb, {
			props: { relationships: mockRels },
		});
		const cards = wrapper.findAll("[data-cy='relationship-card']");
		expect(cards[1].find(".relationship-link").exists()).toBeFalsy();
		expect(cards[1].find("[data-cy='relationship-unavailable']").exists()).toBeTruthy();
	});
});
