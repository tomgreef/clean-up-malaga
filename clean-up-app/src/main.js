import { createApp } from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import Oruga from '@oruga-ui/oruga-next';
import '@oruga-ui/oruga-next/dist/oruga.css';
import { auth } from '@/firebase';
import store from '@/store/store';
import { VueFire, VueFireAuth } from 'vuefire';
import './assets/scss/app.scss';

let app;

auth.onAuthStateChanged(() => {
	if (!app) {
		app = createApp(App);
		app.use(store);
		app.use(router);
		app.use(Oruga);
		app.use(VueFire, {
			firebaseApp: auth.app,
			modules: [VueFireAuth()]
		});
		app.mount('#app');
	}
});
