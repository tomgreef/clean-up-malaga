import { shallowMount } from '@vue/test-utils';
import TicketsTable from '@/components/TicketsTable.vue';
import firebase from '@/firebase';

vi.mock('../../src/firebase.js', () => ({
	auth: {
		currentUser: {}
	}
}));

describe('Controles de agente', () => {
	it('No se muestran si no se es agente', () => {
		const component = shallowMount(TicketsTable, {
			data() {
				return {
					tickets: []
				};
			},
			propsData: {
				isAgent: false
			}
		});
		const componentText = component.text();
		expect(componentText).not.toContain('Asignar');
		expect(componentText).not.toContain('Anidar');
		expect(componentText).not.toContain('Cerrar');
	});
	it('Se muestran si se es agente', () => {
		const component = shallowMount(TicketsTable, {
			data() {
				return {
					tickets: []
				};
			},
			propsData: {
				isAgent: true
			}
		});
		const componentText = component.text();
		expect(componentText).toContain('Asignar');
		expect(componentText).toContain('Anidar');
		expect(componentText).toContain('Cerrar');
	});
});

describe('Tabla', () => {
	describe('Sistema de filtro', () => {
		const tickets = [
			{
				id: 1,
				agentUid: 'agente1',
				allowedUsers: ['uid', 'uid2'],
				closed: true
			},
			{
				id: 2,
				agentUid: 'agente2',
				allowedUsers: ['creatorUid', 'uid'],
				closed: true
			},
			{
				id: 3,
				agentUid: '',
				allowedUsers: ['creatorUid', 'uid2'],
				closed: false
			}
		];
		describe('Si se es usuario', () => {
			it('Devuelve true si se esta en la lista de permitidos', () => {
				const component = shallowMount(TicketsTable, {
					computed: {
						currentUserUid() {
							return;
						},
						filteredTickets() {
							return [];
						}
					},
					data() {
						return {
							selection: []
						};
					},
					propsData: {
						isAgent: false
					}
				});
				firebase.auth.currentUser.uid = 'uid';
				expect(
					component.vm.filter({
						allowedUsers: ['creatorUid', 'uid']
					})
				).toBe(true);
			});
			it('Devuelve false si no se esta en la lista de permitidos', () => {
				const component = shallowMount(TicketsTable, {
					computed: {
						currentUserUid() {
							return;
						},
						filteredTickets() {
							return [];
						}
					},
					data() {
						return {
							selection: []
						};
					},
					propsData: {
						isAgent: false
					}
				});
				firebase.auth.currentUser.uid = 'uid';
				expect(
					component.vm.filter({
						allowedUsers: ['creatorUid', 'uid2']
					})
				).toBe(false);
			});
			it('Filtra los tickets', () => {
				const component = shallowMount(TicketsTable, {
					computed: {
						currentUserUid() {
							return;
						},
						filteredTickets() {
							return [];
						}
					},
					data() {
						return {
							selection: []
						};
					},
					propsData: {
						isAgent: false
					}
				});
				let filteredTickets = tickets.filter(component.vm.filter);
				expect(filteredTickets).toStrictEqual([tickets[0], tickets[1]]);
			});
		});
		describe('Si se es agente', () => {
			it('Devuelve todos los tickets', () => {
				const component = shallowMount(TicketsTable, {
					computed: {
						currentUserUid() {
							return;
						},
						filteredTickets() {
							return [];
						}
					},
					data() {
						return {
							selection: []
						};
					},
					propsData: {
						isAgent: true
					}
				});
				expect(tickets.filter(component.vm.filter)).toStrictEqual(
					tickets
				);
			});
			it('Filtrado por agente', () => {
				const component = shallowMount(TicketsTable, {
					computed: {
						currentUserUid() {
							return;
						},
						filteredTickets() {
							return [];
						}
					},
					data() {
						return {
							filterAgent: true,
							selection: []
						};
					},
					propsData: {
						isAgent: true
					}
				});
				firebase.auth.currentUser.uid = 'agente1';
				let filteredTickets = tickets.filter(component.vm.filter);
				expect(filteredTickets).toStrictEqual([tickets[0]]);
			});
			it('Filtrado por cerrados', () => {
				const component = shallowMount(TicketsTable, {
					computed: {
						currentUserUid() {
							return;
						},
						filteredTickets() {
							return [];
						}
					},
					data() {
						return {
							filterClosed: true,
							selection: []
						};
					},
					propsData: {
						isAgent: true
					}
				});
				let filteredTickets = tickets.filter(component.vm.filter);
				expect(filteredTickets).toStrictEqual([tickets[0], tickets[1]]);
			});
			it('Doble filtro', () => {
				const component = shallowMount(TicketsTable, {
					computed: {
						currentUserUid() {
							return;
						},
						filteredTickets() {
							return [];
						}
					},
					data() {
						return {
							filterAgent: true,
							filterClosed: true,
							selection: []
						};
					},
					propsData: {
						isAgent: true
					}
				});
				firebase.auth.currentUser.uid = 'agente1';
				let filteredTickets = tickets.filter(component.vm.filter);
				expect(filteredTickets).toStrictEqual([tickets[0]]);
			});
		});
	});

	it('Muestra un aviso al agente si no hay tickets', () => {
		const component = shallowMount(TicketsTable, {
			computed: {
				currentUserUid() {
					return;
				},
				filteredTickets() {
					return [];
				}
			},
			propsData: {
				isAgent: true
			}
		});
		const componentText = component.text();
		expect(componentText).toContain('Nada por aquí');
		expect(componentText).not.toContain('Crea tu primera incidencia');
	});
	it('Muestra un aviso al usuario si no hay tickets', () => {
		const component = shallowMount(TicketsTable, {
			computed: {
				currentUserUid() {
					return;
				},
				filteredTickets() {
					return [];
				}
			},
			propsData: {
				isAgent: false
			}
		});
		const componentText = component.text();
		expect(componentText).toContain('Aún no has creado ninguna incidencia');
		expect(componentText).not.toContain('Nada por aquí');
	});
});
