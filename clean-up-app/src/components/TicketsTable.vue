<template>
	<div>
		<b-field grouped group-multiline v-if="isAgent">
			<p class="control">
				<b-button
					type="is-primary"
					@click="asign"
					:disabled="selection.length == 0"
					>Asignar</b-button
				>
			</p>
			<p class="control">
				<b-tooltip
					type="is-dark"
					:active="selection.length > 1"
					always
					square
					multilined
					label="La primera incidencia que selecciones será la incidencia padre"
				>
					<b-button
						type="is-primary"
						@click="anidar"
						:disabled="selection.length <= 1"
						>Anidar</b-button
					>
				</b-tooltip>
			</p>
			<p class="control">
				<b-button
					type="is-danger"
					@click="close"
					:disabled="selection.length == 0"
					>Cerrar</b-button
				>
			</p>
			<p class="control">
				<b-switch
					v-model="filterAgent"
					:rounded="false"
					size="is-medium"
					type="is-primary"
				>
					{{
						filterAgent ? 'Asignadas a mi' : 'Todas las incidencias'
					}}
				</b-switch>
			</p>
			<p class="control">
				<b-switch
					v-model="filterClosed"
					:rounded="false"
					size="is-medium"
					type="is-primary"
				>
					{{ filterClosed ? 'Mostrar abiertas' : 'Mostrar cerradas' }}
				</b-switch>
			</p>
		</b-field>
		<b-table
			:data="filteredTickets"
			:paginated="filteredTickets.length > 10"
			per-page="10"
			:checkable="isAgent"
			:checked-rows.sync="selection"
			hoverable
		>
			<template slot-scope="props">
				<b-table-column
					field="title"
					label="Título"
					sortable
					searchable
				>
					<PopUpTicket :ticket="props.row" :isAgent="isAgent" />
				</b-table-column>

				<b-table-column field="cp" label="Código postal" sortable>{{
					props.row.cp
				}}</b-table-column>

				<b-table-column
					field="street"
					label="Calle"
					sortable
					searchable
					>{{ props.row.street }}</b-table-column
				>

				<b-table-column field="closed" label="Estado" centered>{{
					props.row.closed ? 'Cerrado' : 'Abierto'
				}}</b-table-column>

				<b-table-column field="agentUid" label="Agente asignado">
					{{
						props.row.agentUid != ''
							? props.row.agentUid == currentUserUid
								? 'Yo'
								: isAgent
								? props.row.agentUid
								: 'Si'
							: 'Sin asignar'
					}}
				</b-table-column>

				<b-table-column field="date" label="Fecha" sortable centered>
					<b-tag type="is-success">{{
						new Date(props.row.date).toLocaleDateString()
					}}</b-tag>
				</b-table-column>
			</template>
			<template slot="empty">
				<section class="section">
					<div
						v-if="isAgent"
						class="content has-text-grey has-text-centered"
					>
						<p>
							<b-icon
								icon="package-variant"
								size="is-large"
							></b-icon>
						</p>
						<p>Nada por aquí</p>
					</div>
					<b-message
						v-else
						title="Sin incidencias"
						type="is-dark"
						:closable="false"
					>
						<div class="has-text-centered">
							<h1 class="title">
								Aún no has creado ninguna incidencia
							</h1>

							<svg style="width:10em" viewBox="0 0 24 24">
								<path
									fill="currentColor"
									d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M7,9.5C7,8.7 7.7,8 8.5,8C9.3,8 10,8.7 10,9.5C10,10.3 9.3,11 8.5,11C7.7,11 7,10.3 7,9.5M14.77,17.23C14.32,16.5 13.25,16 12,16C10.75,16 9.68,16.5 9.23,17.23L7.81,15.81C8.71,14.72 10.25,14 12,14C13.75,14 15.29,14.72 16.19,15.81L14.77,17.23M15.5,11C14.7,11 14,10.3 14,9.5C14,8.7 14.7,8 15.5,8C16.3,8 17,8.7 17,9.5C17,10.3 16.3,11 15.5,11Z"
								/>
							</svg>
							<br /><br />

							<b-button
								tag="router-link"
								to="/crearticket"
								type="is-primary"
							>
								Crea tu primera incidencia
							</b-button>
						</div>
					</b-message>
				</section>
			</template>
		</b-table>
	</div>
</template>

<script>
	import { auth, db } from '@/firebase';
	import { collection, doc, updateDoc, getDoc, getDocs, setDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
	import { useCollection } from 'vuefire';
	import { computed, ref } from 'vue';
	import { success, warning } from '@/helpers/notificaciones';
	import PopUpTicket from '@/components/PopUpTicket.vue';

	export default {
		props: {
			isAgent: Boolean
		},
		components: {
			PopUpTicket
		},
		setup(props) {
			const selection = ref([]);
			const filterAgent = ref(false);
			const filterClosed = ref(false);
			
			// Create query based on user type
			const ticketsQuery = computed(() => {
				const ticketsCol = collection(db, 'tickets');
				if (!props.isAgent) {
					return query(ticketsCol, where('allowedUsers', 'array-contains', auth.currentUser.uid));
				} else {
					return query(ticketsCol, orderBy('date', 'desc'));
				}
			});
			
			// Use VueFire's useCollection
			const tickets = useCollection(ticketsQuery);
			
			const currentUserUid = computed(() => auth.currentUser.uid);
			
			const filter = (t) => {
				if (props.isAgent) {
					let applyAgentFilters = true;
					if (filterAgent.value) {
						applyAgentFilters = t.agentUid == auth.currentUser.uid;
					}
					if (filterClosed.value) {
						applyAgentFilters &= t.closed;
					}
					return applyAgentFilters;
				} else {
					return t.allowedUsers.includes(auth.currentUser.uid);
				}
			};
			
			const filteredTickets = computed(() => {
				return tickets.value.filter(filter);
			});
			
			const update = async (action, condition) => {
				const ticketsCol = collection(db, 'tickets');
				const updatePromises = [];
				
				for (const selected of selection.value) {
					if (condition(selected)) {
						const ticketRef = doc(ticketsCol, selected.id);
						updatePromises.push(updateDoc(ticketRef, action));
						
						if (selected.hasChildren) {
							const childrenCol = collection(db, 'tickets', selected.id, 'children');
							const childrenSnapshot = await getDocs(childrenCol);
							childrenSnapshot.forEach(child => {
								const childDocRef = doc(childrenCol, child.id);
								updatePromises.push(updateDoc(childDocRef, action));
							});
						}
					}
				}
				
				try {
					await Promise.all(updatePromises);
					success('Acción realizada con éxito');
				} catch (err) {
					warning(err.message || 'Error al realizar la acción');
				}
				selection.value = [];
			};
			
			const asign = () => {
				update(
					{ agentUid: auth.currentUser.uid },
					t => t.agentUid == ''
				);
			};
			
			const close = () => {
				update({ closed: true }, t => t.closed == false);
			};
			
			const anidar = async () => {
				const parentTicket = selection.value[0];
				const childrenTickets = selection.value.slice(1, selection.value.length);
				
				const ticketsCol = collection(db, 'tickets');
				const parentTicketRef = doc(ticketsCol, parentTicket.id);
				const childrenCol = collection(db, 'tickets', parentTicket.id, 'children');
				
				try {
					const parentDoc = await getDoc(parentTicketRef);
					let allowedUsers = parentDoc.data().allowedUsers;
					const updatePromises = [];
					
					for (const child of childrenTickets) {
						allowedUsers.push(child.allowedUsers[0]);
						const childDocRef = doc(childrenCol, child.id);
						updatePromises.push(setDoc(childDocRef, child));
						
						const childTicketRef = doc(ticketsCol, child.id);
						updatePromises.push(deleteDoc(childTicketRef));
					}
					
					await Promise.all(updatePromises);
					await updateDoc(parentTicketRef, {
						hasChildren: true,
						allowedUsers: allowedUsers
					});
					success('Incidencias anidadas con éxito');
				} catch (err) {
					warning('Se ha producido un error');
					console.error(err);
				}
			};
			
			return {
				selection,
				filterAgent,
				filterClosed,
				tickets,
				currentUserUid,
				filteredTickets,
				update,
				asign,
				close,
				anidar,
				filter
			};
		}
	};
</script>
