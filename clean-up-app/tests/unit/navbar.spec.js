import { shallowMount } from '@vue/test-utils';
import Navbar from '@/components/Navbar.vue';

describe('Botón Inicio', () => {
	it('No se muestra si no se ha iniciado sesión', () => {
		const component = shallowMount(Navbar, {
			computed: {
				isLoggedIn() {
					return false;
				}
			}
		});
		expect(component.text()).not.toContain('Inicio');
	});
	it('Se muestra si se ha iniciado sesión como usuario', () => {
		const component = shallowMount(Navbar, {
			computed: {
				isUser() {
					return true;
				},
				isLoggedIn() {
					return true;
				}
			}
		});
		expect(component.text()).toContain('Inicio');
	});
	it('Se muestra si se ha iniciado sesión como agente', () => {
		const component = shallowMount(Navbar, {
			computed: {
				isUser() {
					return false;
				},
				isLoggedIn() {
					return true;
				}
			}
		});
		expect(component.text()).toContain('Inicio');
	});
});

describe('Botón Crear incidencia', () => {
	it('No se muestra si no se ha iniciado sesión', () => {
		const component = shallowMount(Navbar, {
			stubs: ['router-link'],
			computed: {
				isLoggedIn() {
					return false;
				}
			}
		});
		expect(component.text()).not.toContain('Crear incidencia');
	});
	it('No se muestra si no se ha iniciado sesión como usuario', () => {
		const component = shallowMount(Navbar, {
			stubs: ['router-link'],
			computed: {
				isUser() {
					return false;
				},
				isLoggedIn() {
					return true;
				}
			}
		});
		expect(component.text()).not.toContain('Crear incidencia');
	});

	it('Se muestra si se ha iniciado sesión como usuario', () => {
		const component = shallowMount(Navbar, {
			stubs: ['router-link'],
			computed: {
				isUser() {
					return true;
				},
				isLoggedIn() {
					return true;
				}
			}
		});
		expect(component.text()).toContain('Crear incidencia');
	});
});

describe('Botón Mi perfil', () => {
	it('No se muestra si no se ha iniciado sesión', () => {
		const component = shallowMount(Navbar, {
			stubs: ['router-link'],
			computed: {
				isLoggedIn() {
					return false;
				}
			}
		});
		expect(component.text()).not.toContain('Mi perfil');
	});
	it('Se muestra si se ha iniciado sesión como usuario', () => {
		const component = shallowMount(Navbar, {
			stubs: ['router-link'],
			computed: {
				isUser() {
					return false;
				},
				isLoggedIn() {
					return true;
				}
			}
		});
		expect(component.text()).toContain('Mi perfil');
	});
	it('Se muestra si se ha iniciado sesión como agente', () => {
		const component = shallowMount(Navbar, {
			stubs: ['router-link'],
			computed: {
				isUser() {
					return false;
				},
				isLoggedIn() {
					return true;
				}
			}
		});
		expect(component.text()).toContain('Mi perfil');
	});
});

describe('Botón Cerrar sesión', () => {
	it('No se muestra si no se ha iniciado sesión', () => {
		const component = shallowMount(Navbar, {
			stubs: ['router-link'],
			computed: {
				isLoggedIn() {
					return false;
				}
			}
		});
		expect(component.text()).not.toContain('Cerrar sesión');
	});
	it('Se muestra si se ha iniciado sesión como usuario', () => {
		const component = shallowMount(Navbar, {
			stubs: ['router-link'],
			computed: {
				isUser() {
					return false;
				},
				isLoggedIn() {
					return true;
				}
			}
		});
		expect(component.text()).toContain('Cerrar sesión');
	});
	it('Se muestra si se ha iniciado sesión como agente', () => {
		const component = shallowMount(Navbar, {
			stubs: ['router-link'],
			computed: {
				isUser() {
					return false;
				},
				isLoggedIn() {
					return true;
				}
			}
		});
		expect(component.text()).toContain('Cerrar sesión');
	});
});
