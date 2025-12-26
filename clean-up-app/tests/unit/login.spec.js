import { vi } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import LoginForm from '@/components/LoginForm.vue';
import firebase from '@/firebase';
import getUserType from '@/helpers/sessionHelper';
import notificaciones from '@/helpers/notificaciones';
import authErrors from '@/helpers/authErrors';

vi.mock('../../src/helpers/authErrors.js', () =>
	vi.fn(() => {
		return 'authError';
	})
);

vi.mock('../../src/helpers/notificaciones.js', () => ({
	warning: vi.fn()
}));

vi.mock('../../src/helpers/sessionHelper.js', () => vi.fn());

vi.mock('../../src/firebase.js', () => ({
	auth: {
		signInWithEmailAndPassword: vi.fn(),
		signOut: vi.fn()
	}
}));

describe('Estado del botón de inicio de sesión', () => {
	const correoInvalido = 'abc',
		correoValido = 'correoValido@gmail.com',
		passwordInvalida = 'abc',
		passwordValida = 'passwordValida';

	it('Deshabilitado si no hay datos', () => {
		const component = shallowMount(LoginForm);
		expect(
			component.get('b-button-stub').attributes('disabled')
		).toBeTruthy();
	});

	it('Deshabilitado si los datos son inválidos', () => {
		const component = shallowMount(LoginForm, {
			data() {
				return {
					email: correoInvalido,
					pass: passwordInvalida
				};
			}
		});
		expect(
			component.get('b-button-stub').attributes('disabled')
		).toBeTruthy();
	});

	it('Deshabilitado si el correo es invalido', () => {
		const component = shallowMount(LoginForm, {
			data() {
				return {
					email: correoInvalido,
					pass: passwordValida
				};
			}
		});
		expect(
			component.get('b-button-stub').attributes('disabled')
		).toBeTruthy();
	});

	it('Deshabilitado si la contraseña es inválida', () => {
		const component = shallowMount(LoginForm, {
			data() {
				return {
					email: correoValido,
					pass: passwordInvalida
				};
			}
		});
		expect(
			component.get('b-button-stub').attributes('disabled')
		).toBeTruthy();
	});

	it('Habilitado si los datos son válidos', () => {
		const component = shallowMount(LoginForm, {
			data() {
				return {
					email: correoValido,
					pass: passwordValida
				};
			}
		});
		expect(
			component.get('b-button-stub').attributes('disabled')
		).toBeUndefined();
	});
});

describe('Función de inicio', () => {
	let component;
	const $router = {
			replace: vi.fn()
		},
		$store = {
			commit: vi.fn()
		};

	beforeEach(() => {
		$router.replace.mockClear();
		$store.commit.mockClear();
		notificaciones.warning.mockClear();
		authErrors.mockClear();
		getUserType.mockClear();
		firebase.auth.signInWithEmailAndPassword.mockClear();
		firebase.auth.signOut.mockClear();
		component = shallowMount(LoginForm, {
			mocks: {
				$router,
				$store
			}
		});
	});

	it('Procede si es agente', async () => {
		getUserType.mockResolvedValueOnce('agent');
		firebase.auth.signInWithEmailAndPassword.mockResolvedValueOnce({
			user: {
				emailVerified: false
			}
		});
		const inicio = jest.spyOn(component.vm, 'inicio');
		inicio();
		await component.vm.$nextTick();
		expect($router.replace).toHaveBeenCalledWith({ path: '/home' });
		expect($store.commit).toHaveBeenCalledWith('change', 'agent');
	});

	it('Procede si es usuario con correo válido', async () => {
		getUserType.mockResolvedValueOnce('user');
		firebase.auth.signInWithEmailAndPassword.mockResolvedValueOnce({
			user: {
				emailVerified: true
			}
		});
		const inicio = jest.spyOn(component.vm, 'inicio');
		inicio();
		await component.vm.$nextTick();
		expect($router.replace).toHaveBeenCalledWith({ path: '/home' });
		expect($store.commit).toHaveBeenCalledWith('change', 'user');
	});

	it('No procede si es usuario con correo no verificado', async () => {
		getUserType.mockResolvedValueOnce('user');
		firebase.auth.signInWithEmailAndPassword.mockResolvedValueOnce({
			user: {
				emailVerified: false
			}
		});
		const inicio = jest.spyOn(component.vm, 'inicio');
		inicio();
		await component.vm.$nextTick();
		expect($router.replace).not.toHaveBeenCalled();
		expect($store.commit).not.toHaveBeenCalled();
		expect(notificaciones.warning).toHaveBeenCalledWith(
			'Verifica tu correo para iniciar sesión'
		);
		expect(firebase.auth.signOut).toHaveBeenCalled();
	});

	it('Cierra la sesión y muestra un aviso si se produce un error', async () => {
		const error = new Error();
		firebase.auth.signInWithEmailAndPassword.mockRejectedValue(error);
		const inicio = jest.spyOn(component.vm, 'inicio');
		inicio();
		await component.vm.$nextTick();
		expect(authErrors).toHaveBeenCalledWith(error);
		expect(notificaciones.warning).toHaveBeenCalledWith('authError');
		expect(firebase.auth.signOut).toHaveBeenCalled();
	});
});
