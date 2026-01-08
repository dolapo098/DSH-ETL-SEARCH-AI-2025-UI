import { shallowMount, VueWrapper } from "@vue/test-utils";
import { describe, it, expect, beforeEach, afterEach } from "vitest";

// Component under test
import DocumentList from "@/components/DocumentList.vue";

// --- Test data ---
const mockDocs = [
	{ supportingDocumentID: 1, title: "Doc 1", documentType: "Report", downloadUrl: "http://test.com/d1" },
	{ supportingDocumentID: 2, title: "Doc 2", documentType: "Guide", downloadUrl: null },
];

describe("DocumentList.vue", () => {
	let wrapper: VueWrapper<any> | null = null;

	afterEach(() => {
		wrapper?.unmount();
	});

	it("Mounts", () => {
		wrapper = shallowMount(DocumentList, {
			props: { supportingDocuments: [] },
		});
		expect(wrapper.exists()).toBeTruthy();
	});

	it("shows empty state when no documents", () => {
		wrapper = shallowMount(DocumentList, {
			props: { supportingDocuments: [] },
		});
		expect(wrapper.find("[data-cy='document-empty']").exists()).toBeTruthy();
		expect(wrapper.findAll("[data-cy='document-card']").length).toBe(0);
	});

	it("renders document cards", () => {
		wrapper = shallowMount(DocumentList, {
			props: { supportingDocuments: mockDocs },
		});
		expect(wrapper.findAll("[data-cy='document-card']").length).toBe(2);
		expect(wrapper.text()).toContain("Doc 1");
	});

	it("shows view button when url is present", () => {
		wrapper = shallowMount(DocumentList, {
			props: { supportingDocuments: mockDocs },
		});
		const firstCard = wrapper.findAll("[data-cy='document-card']")[0];
		expect(firstCard.find("[data-cy='document-view']").exists()).toBeTruthy();
		expect(firstCard.find("[data-cy='document-unavailable']").exists()).toBeFalsy();
	});

	it("shows unavailable message when url is missing", () => {
		wrapper = shallowMount(DocumentList, {
			props: { supportingDocuments: mockDocs },
		});
		const secondCard = wrapper.findAll("[data-cy='document-card']")[1];
		expect(secondCard.find("[data-cy='document-view']").exists()).toBeFalsy();
		expect(secondCard.find("[data-cy='document-unavailable']").exists()).toBeTruthy();
	});
});
