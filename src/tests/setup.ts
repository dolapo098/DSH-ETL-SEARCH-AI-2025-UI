import { vi } from "vitest";

// Mock ArcGIS globals if needed
global.ResizeObserver = vi.fn().mockImplementation(() => ({
	observe: vi.fn(),
	unobserve: vi.fn(),
	disconnect: vi.fn(),
}));

// Mock DOMParser if needed (though JSDOM has it)
if (typeof window !== "undefined" && !window.DOMParser) {
	const dom = require("jsdom");
	window.DOMParser = new dom.JSDOM().window.DOMParser;
}

