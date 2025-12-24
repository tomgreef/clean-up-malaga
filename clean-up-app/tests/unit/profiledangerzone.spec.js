import ProfileDangerZone from '@/components/ProfileDangerZone.vue';
import { shallowMount } from '@vue/test-utils';

vi.mock('../../src/firebase.js', () => ({
	auth: {
		currentUser: {
			delete: vi.fn().mockResolvedValueOnce()
		}
	}
}));

describe('Función eliminar cuenta', () => {
	let component;

	const $router = {
		replace: vi.fn()
	};

	const $buefy = {
		dialog: {
			confirm: vi.fn()
		},
		toast: {
			open: vi.fn()
		}
	};

	beforeEach(() => {
		$router.replace.mockClear();
		$buefy.dialog.confirm.mockClear();
		component = shallowMount(ProfileDangerZone, {
			stubs: ['router-link'],
			mocks: {
				$router,
				$buefy
			}
		});
	});

	it('confirmCustomDelete funciona correctamente', async () => {
		const confirmCustomDelete = vi.spyOn(
			component.vm,
			'confirmCustomDelete'
		);
		confirmCustomDelete();
		await component.vm.$nextTick();
		expect($buefy.dialog.confirm).toBeCalled();
	});

	it('deleteAccount funciona correctamente', async () => {
		const deleteAccount = vi.spyOn(component.vm, 'deleteAccount');
		deleteAccount();
		await component.vm.$nextTick();
		expect($router.replace).toHaveBeenCalledWith({ path: '/' });
	});
});
