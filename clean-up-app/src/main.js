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
		app = createApp(App);
		app.use(store);
		app.use(router);
		app.use(Oruga, {
			iconPack: 'mdi'
		});
		app.use(BuefyCompat); // Add Buefy compatibility layer
		app.use(VueFire, {
			firebaseApp,
			modules: [VueFireAuth()]
		});
		
		// Handle errors globally
		app.config.errorHandler = (err, instance, info) => {
			console.error('Vue Error:', err);
			console.error('Component:', instance);
			console.error('Info:', info);
		};
		
		app.mount('#app');
	}
}

// Initialize app immediately
initApp();

// Listen for auth changes after app is mounted
onAuthStateChanged(auth, (user) => {
	console.log('Auth state changed:', user ? 'logged in' : 'logged out');
});
