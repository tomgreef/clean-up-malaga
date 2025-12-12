import ProfileDangerZone from '@/components/ProfileDangerZone.vue';
import { shallowMount } from '@vue/test-utils';

jest.mock('../../src/firebase.js', () => ({
	auth: {
		currentUser: {
			delete: jest.fn().mockResolvedValueOnce()
		}
	}
}));

describe('Función eliminar cuenta', () => {
	let component;

	const $router = {
		replace: jest.fn()
	};

	const $buefy = {
		dialog: {
			confirm: jest.fn()
		},
		toast: {
			open: jest.fn()
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
		const confirmCustomDelete = jest.spyOn(
			component.vm,
			'confirmCustomDelete'
		);
		confirmCustomDelete();
		await component.vm.$nextTick();
		expect($buefy.dialog.confirm).toBeCalled();
	});

	it('deleteAccount funciona correctamente', async () => {
		const deleteAccount = jest.spyOn(component.vm, 'deleteAccount');
		deleteAccount();
		await component.vm.$nextTick();
		expect($router.replace).toHaveBeenCalledWith({ path: '/' });
	});
});
