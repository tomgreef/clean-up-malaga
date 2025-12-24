import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		vue({
			template: {
				compilerOptions: {
					// Enable runtime compilation for template strings
					isCustomElement: (tag) => false
				}
			}
		})
	],
	base: './', // Use relative paths for assets
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
			// Enable Vue runtime compiler for template option
			'vue': 'vue/dist/vue.esm-bundler.js'
		}
	},
	css: {
		preprocessorOptions: {
			scss: {
				// Suppress Sass deprecation warnings from Bulma
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
