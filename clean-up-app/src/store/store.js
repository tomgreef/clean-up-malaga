import { createStore } from 'vuex';
import VuexPersist from 'vuex-persist';

const local = new VuexPersist({
	key: 'local-trip-malager-storage',
	storage: window.localStorage,
	reducer: state => ({
		type: state.type
	})
});

const store = createStore({
	state: {
		type: '',
		isLoggedIn: false
	},
	mutations: {
		change(state, type) {
			state.type = type;
		},
		setAuthState(state, isLoggedIn) {
			state.isLoggedIn = isLoggedIn;
		}
	},
	getters: {
		type: state => state.type,
		isLoggedIn: state => state.isLoggedIn
	},
	plugins: [local.plugin]
});

export default store;
