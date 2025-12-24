import { config } from '@vue/test-utils';
import BuefyCompat from '@/plugins/buefy-compat';

// Register Buefy compatibility plugin globally for all tests
config.global.plugins = [BuefyCompat];

// Mock Firebase to avoid initialization issues in tests
vi.mock('@/firebase', () => ({
	auth: {
		currentUser: null,
		onAuthStateChanged: vi.fn()
	},
	db: {},
	storage: {},
	firebaseApp: {}
}));
