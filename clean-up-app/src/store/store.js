import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';

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
	plugins: [
		createPersistedState({
			key: 'local-trip-malager-storage',
			storage: window.localStorage,
			paths: ['type']
		})
	]
});

export default store;
