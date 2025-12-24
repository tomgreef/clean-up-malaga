import { createApp, configureCompat } from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import Oruga from '@oruga-ui/oruga-next';
import { bulmaConfig } from '@oruga-ui/theme-bulma';
import { auth } from '@/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import store from '@/store/store';
import './assets/scss/app.scss';

// Configure Vue 3 compat mode
configureCompat({
	MODE: 2
});

let app = null;

onAuthStateChanged(auth, () => {
	if (!app) {
		app = createApp(App);
		app.use(store);
		app.use(router);
		app.use(Oruga, bulmaConfig);
		app.config.productionTip = false;
		app.mount('#app');
	}
});
