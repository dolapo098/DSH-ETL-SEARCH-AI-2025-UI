import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue()],
	test: {
		globals: true,
		environment: "jsdom",
		setupFiles: ["./src/tests/setup.ts"],
		css: false,
		coverage: {
			reporter: ["text", "json", "html"],
		},
	},
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},
	server: {
		port: 5173,
		open: true,
	},
	esbuild: {
		tsconfigRaw: {
			compilerOptions: {
				experimentalDecorators: true,
				useDefineForClassFields: false,
			},
		},
	},
} as any);
