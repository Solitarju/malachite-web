import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
		  pages: 'build',
		  assets: 'build',
		  fallback: '200.html'
		}),
		csp: {
		  directives: {
			'script-src': ['self']
		  },
		  reportOnly: {
			'script-src': ['self'],
			'report-to': ['/']
		  }
		},
	  },
};

export default config;
