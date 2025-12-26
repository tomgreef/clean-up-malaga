import { vi } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import CreateTicket from '@/components/CreateTicket.vue';
import notificaciones from '@/helpers/notificaciones';
import firebase from '@/firebase';

vi.mock('../../src/helpers/notificaciones.js', () => ({
	warning: vi.fn(),
	success: vi.fn()
}));

vi.mock('../../src/firebase.js', () => ({
	storage: {
		getUploadPromises: vi.fn(),
		getDownloadPromises: vi.fn(),
		ref: vi.fn(() => {
			return {
				child: vi.fn()
			};
		})
	},
	db: {
		collection: vi.fn(() => {
			return {
				doc: vi.fn(() => {
					return {
						set: vi.fn().mockResolvedValueOnce()
					};
				})
			};
		})
	},
	auth: {
		currentUser: {}
	}
}));

describe('Botón CrearTicket', () => {
	const WrongImagesNumber = ['0', '1', '2', '3'],
		RightImagesNumber = ['0', '1'];

	it('Deshabilitado si no hay datos', () => {
		const wrapper = shallowMount(CreateTicket);
		expect(
			wrapper.get('b-button-stub').attributes('disabled')
		).toBeTruthy();
	});

	it('Deshabilitado si los datos son inválidos', () => {
		const wrapper = shallowMount(CreateTicket, {
			computed: {
				invalid() {
					return true;
				}
			}
		});
		expect(
			wrapper.get('b-button-stub').attributes('disabled')
		).toBeTruthy();
	});

	it('Deshabilitado si hay demasiadas imágenes', () => {
		const wrapper = shallowMount(CreateTicket, {
			data() {
				return {
					images: WrongImagesNumber
				};
			},
			computed: {
				invalidSize() {
					return false;
				}
			}
		});
		expect(
			wrapper.get('b-button-stub').attributes('disabled')
		).toBeTruthy();
	});

	it('Deshabilitado si las imágenes son demasiado grandes', () => {
		const wrapper = shallowMount(CreateTicket, {
			data() {
				return {
					images: RightImagesNumber
				};
			},
			computed: {
				invalid() {
					return false;
				},
				invalidSize() {
					return true;
				}
			}
		});
		expect(
			wrapper.get('b-button-stub').attributes('disabled')
		).toBeTruthy();
	});

	it('Habilitado si los datos son correctos', () => {
		const wrapper = shallowMount(CreateTicket, {
			computed: {
				invalidSize() {
					return false;
				},
				invalid() {
					return false;
				}
			}
		});
		expect(wrapper.get('b-button-stub').attributes('disabled')).toBeFalsy();
	});
});

describe('Función crear ticket', () => {
	let component;

	beforeEach(() => {
		firebase.storage.getUploadPromises.mockClear();
		firebase.storage.getDownloadPromises.mockClear();
		firebase.storage.ref.mockClear();
		firebase.db.collection.mockClear();
		notificaciones.warning.mockClear();
		notificaciones.success.mockClear();
		component = shallowMount(CreateTicket, {
			stubs: ['router-link'],
			mocks: {
				$router: { replace: vi.fn() }
			}
		});
	});

	it('Lanza notificacion en caso de ticket completado', async () => {
		firebase.storage.getUploadPromises.mockResolvedValueOnce();
		const createTicket = jest.spyOn(component.vm, 'createTicket');
		createTicket();
		await component.vm.$nextTick();
		await component.vm.$nextTick();
		expect(notificaciones.success).toHaveBeenCalled();
	});
});
