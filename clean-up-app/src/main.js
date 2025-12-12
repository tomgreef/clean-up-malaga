import { createApp } from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import Oruga from '@oruga-ui/oruga-next';
import { auth, firebaseApp } from '@/firebase';
import store from '@/store/store';
import { VueFire, VueFireAuth } from 'vuefire';
import './assets/scss/app.scss';

let app;

auth.onAuthStateChanged(() => {
	if (!app) {
		app = createApp(App);
		app.use(store);
		app.use(router);
		app.use(Oruga, {
			iconPack: 'mdi'
		});
		app.use(VueFire, {
			firebaseApp,
			modules: [VueFireAuth()]
		});
		app.mount('#app');
	}
});
