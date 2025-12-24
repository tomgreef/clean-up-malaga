import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vite.dev/config/
export default defineConfig({
	plugins: [vue()],
	base: './', // Use relative paths for assets
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
			// Enable Vue runtime compiler for Buefy compatibility layer
			// The compatibility components use template strings which require runtime compilation
			// This adds ~10KB to bundle but enables legacy component support
			'vue': 'vue/dist/vue.esm-bundler.js'
		}
	},
	css: {
		preprocessorOptions: {
			scss: {
				// Suppress Sass deprecation warnings from Bulma's internal code
				// Bulma 1.0.4 uses deprecated @import and if() syntax that will be removed in Dart Sass 3.0
				// These warnings are from third-party code we can't control
				quietDeps: true,
				silenceDeprecations: ['import', 'if-function']
			}
		}
	},
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: ['./tests/setup.js']
	},
	build: {
		outDir: 'dist',
		assetsDir: 'assets',
		rollupOptions: {
			output: {
				manualChunks: undefined
			}
		}
	}
});
