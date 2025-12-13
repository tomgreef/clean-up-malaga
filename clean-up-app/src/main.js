import { createApp } from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import Oruga from '@oruga-ui/oruga-next';
import { auth, firebaseApp } from '@/firebase';
import store from '@/store/store';
import { VueFire, VueFireAuth } from 'vuefire';
import './assets/scss/app.scss';
import { onAuthStateChanged } from 'firebase/auth';
import BuefyCompat from '@/plugins/buefy-compat';

let app;

// Initialize app immediately, don't wait for auth
function initApp() {
	if (!app) {
		console.log('Initializing Vue app...');
		try {
			app = createApp(App);
			console.log('Created app instance');
			
			app.use(store);
			console.log('Added store');
			
			app.use(router);
			console.log('Added router');
			
			app.use(Oruga, {
				iconPack: 'mdi'
			});
			console.log('Added Oruga');
			
			app.use(BuefyCompat); // Add Buefy compatibility layer
			console.log('Added Buefy compatibility');
			
			app.use(VueFire, {
				firebaseApp,
				modules: [VueFireAuth()]
			});
			console.log('Added VueFire');
			
			// Handle errors globally
			app.config.errorHandler = (err, instance, info) => {
				console.error('Vue Error:', err);
				console.error('Component:', instance);
				console.error('Info:', info);
			};
			
			// Add warning handler
			app.config.warnHandler = (msg, instance, trace) => {
				console.warn('Vue Warning:', msg);
				console.warn('Trace:', trace);
			};
			
			app.mount('#app');
			console.log('App mounted successfully!');
		} catch (error) {
			console.error('Error initializing app:', error);
		}
	}
}

// Initialize app immediately
console.log('main.js loaded');
initApp();

// Listen for auth changes after app is mounted
onAuthStateChanged(auth, (user) => {
	console.log('Auth state changed:', user ? 'logged in' : 'logged out');
});
