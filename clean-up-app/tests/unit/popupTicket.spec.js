import { shallowMount } from '@vue/test-utils';
import PopUpTicket from '@/components/PopUpTicket.vue';

describe('Controles de lanzamiento', () => {
	it('Debe ser un anchor si no es un ticket hijo', () => {
		const component = shallowMount(PopUpTicket, {
			computed: {
				currentUserUid() {
					return;
				}
			},
			propsData: {
				isAgent: false,
				isChild: false,
				ticket: {
					title: 'Titulo del ticket'
				}
			}
		});
		expect(component.get('a').text()).toMatch('Titulo del ticket');
	});
	it('Debe ser un botón si es un ticket hijo', () => {
		const component = shallowMount(PopUpTicket, {
			computed: {
				currentUserUid() {
					return;
				}
			},
			propsData: {
				isAgent: false,
				isChild: true,
				ticket: {
					title: 'Titulo del ticket'
				}
			}
		});
		expect(component.get('b-button-stub').text()).toMatch(
			'Titulo del ticket'
		);
	});
});

describe('Modal', () => {
	it('Muestra los datos del ticket ', () => {
		const ticket = {
			title: 'Título del ticket',
			description: 'Descripción del ticket',
			cp: 29007,
			street: 'Calle Unitaria',
			streetNumber: 2
		};
		const component = shallowMount(PopUpTicket, {
			computed: {
				currentUserUid() {
					return;
				}
			},
			propsData: {
				isTicketModalActive: true,
				isAgent: false,
				isChild: false,
				ticket: ticket
			}
		});
		const componentText = component.text();
		expect(componentText).toContain(ticket.title);
		expect(componentText).toContain(ticket.description);
		expect(componentText).toContain(String(ticket.cp));
		expect(componentText).toContain(ticket.street);
		expect(componentText).toContain(String(ticket.streetNumber));
	});

	describe('Modificar ticket', () => {
		it('No muestra la opción de editar si se es agente', () => {
			const component = shallowMount(PopUpTicket, {
				computed: {
					currentUserUid() {
						return;
					}
				},
				propsData: {
					isTicketModalActive: true,
					isAgent: true,
					isChild: false,
					ticket: { userUid: 'uid' }
				}
			});
			expect(component.html()).not.toContain('popupeditticket-stub');
		});
		it('No muestra la opción de editar si no se es el usuario creador', () => {
			const component = shallowMount(PopUpTicket, {
				computed: {
					currentUserUid() {
						return 'uid23';
					}
				},
				propsData: {
					isTicketModalActive: true,
					isAgent: false,
					isChild: false,
					ticket: { userUid: 'uid' }
				}
			});
			expect(component.html()).not.toContain('popupeditticket-stub');
		});
		it('Muestra la opción de editar si se es el usuario creador', () => {
			const component = shallowMount(PopUpTicket, {
				computed: {
					currentUserUid() {
						return 'uid';
					}
				},
				propsData: {
					isTicketModalActive: true,
					isAgent: false,
					isChild: false,
					ticket: { userUid: 'uid' }
				}
			});
			expect(component.html()).toContain('popupeditticket-stub');
		});
	});

	describe('Paginación de subtickets', () => {
		it('No se muestra si el ticket no tiene hijos', () => {
			const component = shallowMount(PopUpTicket, {
				computed: {
					currentUserUid() {
						return;
					}
				},
				propsData: {
					isTicketModalActive: true,
					isAgent: false,
					ticket: {
						hasChildren: false,
						id: 'id'
					}
				}
			});
			expect(component.html()).not.toContain('subticketpagination-stub');
		});
		it('Se muestra si el ticket tiene hijos', () => {
			const component = shallowMount(PopUpTicket, {
				computed: {
					currentUserUid() {
						return;
					}
				},
				propsData: {
					isTicketModalActive: true,
					isAgent: false,
					ticket: {
						hasChildren: true,
						id: 'id'
					}
				}
			});
			expect(component.html()).toContain('subticketpagination-stub');
		});
	});

	describe('Sección de comentarios', () => {
		it('No permite crear comentarios si no se es agente', () => {
			const component = shallowMount(PopUpTicket, {
				computed: {
					currentUserUid() {
						return;
					}
				},
				propsData: {
					isTicketModalActive: true,
					isAgent: false,
					ticket: { closed: false }
				}
			});
			expect(component.html()).not.toContain('createcomment-stub');
		});
		it('No permite crear comentarios si el ticket esta cerrado', () => {
			const component = shallowMount(PopUpTicket, {
				computed: {
					currentUserUid() {
						return;
					}
				},
				propsData: {
					isTicketModalActive: true,
					isAgent: true,
					ticket: { closed: true }
				}
			});
			expect(component.html()).not.toContain('createcomment-stub');
		});
		it('Permite crear comentarios si se es agente y el ticket esta abierto', () => {
			const component = shallowMount(PopUpTicket, {
				computed: {
					currentUserUid() {
						return;
					}
				},
				propsData: {
					isTicketModalActive: true,
					isAgent: true,
					ticket: { closed: false }
				}
			});
			expect(component.html()).toContain('createcomment-stub');
		});
	});
});
