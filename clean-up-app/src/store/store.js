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
		type: ''
	},
	mutations: {
		change(state, type) {
			state.type = type;
		}
	},
	getters: {
		type: state => state.type
	},
	plugins: [local.plugin]
});

export default store;
