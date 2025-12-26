<template>
	<div>
		<o-field grouped group-multiline v-if="isAgent">
			<p class="control">
				<o-button
					variant="primary"
					@click="asign"
					:disabled="selection.length == 0"
					>Asignar</o-button
				>
			</p>
			<p class="control">
				<o-tooltip
					variant="dark"
					:active="selection.length > 1"
					always
					square
					multilined
					label="La primera incidencia que selecciones será la incidencia padre"
				>
					<o-button
						variant="primary"
						@click="anidar"
						:disabled="selection.length <= 1"
						>Anidar</o-button
					>
				</o-tooltip>
			</p>
			<p class="control">
				<o-button
					variant="danger"
					@click="close"
					:disabled="selection.length == 0"
					>Cerrar</o-button
				>
			</p>
			<p class="control">
				<o-switch
					v-model="filterAgent"
					:rounded="false"
					size="medium"
					variant="primary"
				>
					{{
						filterAgent ? 'Asignadas a mi' : 'Todas las incidencias'
					}}
				</o-switch>
			</p>
			<p class="control">
				<o-switch
					v-model="filterClosed"
					:rounded="false"
					size="medium"
					variant="primary"
				>
					{{ filterClosed ? 'Mostrar abiertas' : 'Mostrar cerradas' }}
				</o-switch>
			</p>
		</o-field>
		<o-table
			:data="filteredTickets"
			:paginated="filteredTickets.length > 10"
			per-page="10"
			:checkable="isAgent"
			v-model:checked-rows="selection"
			hoverable
		>
			<o-table-column
				field="title"
				label="Título"
				sortable
				searchable
				v-slot="props"
			>
				<PopUpTicket :ticket="props.row" :isAgent="isAgent" />
			</o-table-column>

			<o-table-column
				field="cp"
				label="Código postal"
				sortable
				v-slot="props"
				>{{ props.row.cp }}</o-table-column
			>

			<o-table-column
				field="street"
				label="Calle"
				sortable
				searchable
				v-slot="props"
				>{{ props.row.street }}</o-table-column
			>

			<o-table-column
				field="closed"
				label="Estado"
				centered
				v-slot="props"
				>{{ props.row.closed ? 'Cerrado' : 'Abierto' }}</o-table-column
			>

			<o-table-column field="agentUid" label="Agente asignado" v-slot="props">
				{{
					props.row.agentUid != ''
						? props.row.agentUid == currentUserUid
							? 'Yo'
							: isAgent
							? props.row.agentUid
							: 'Si'
						: 'Sin asignar'
				}}
			</o-table-column>

			<o-table-column field="date" label="Fecha" sortable centered v-slot="props">
				<o-tag variant="success">{{
					new Date(props.row.date).toLocaleDateString()
				}}</o-tag>
			</o-table-column>

			<template #empty>
				<section class="section">
					<div
						v-if="isAgent"
						class="content has-text-grey has-text-centered"
					>
						<p>
							<o-icon
								icon="package-variant"
								size="large"
							></o-icon>
						</p>
						<p>Nada por aquí</p>
					</div>
					<o-message
						v-else
						title="Sin incidencias"
						variant="dark"
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

							<o-button
								tag="router-link"
								to="/crearticket"
								variant="primary"
							>
								Crea tu primera incidencia
							</o-button>
						</div>
					</o-message>
				</section>
			</template>
		</o-table>
	</div>
</template>

<script>
	import { auth, db } from '@/firebase';
	import {
		collection,
		doc,
		query,
		where,
		orderBy,
		getDocs,
		updateDoc,
		setDoc,
		deleteDoc,
		getDoc,
		onSnapshot
	} from 'firebase/firestore';
	import { success, warning } from '@/helpers/notificaciones';
	import PopUpTicket from '@/components/PopUpTicket';

	export default {
		data: () => ({
			selection: [],
			filterAgent: false,
			filterClosed: false,
			tickets: []
		}),
		props: {
			isAgent: Boolean
		},
		components: {
			PopUpTicket
		},
		computed: {
			currentUserUid() {
				return auth.currentUser.uid;
			},
			filteredTickets() {
				return this.tickets.filter(this.filter);
			}
		},
		methods: {
			filter(t) {
				if (this.isAgent) {
					let applyAgentFilters = true;
					if (this.filterAgent) {
						applyAgentFilters = t.agentUid == auth.currentUser.uid;
					}
					if (this.filterClosed) {
						applyAgentFilters &= t.closed;
					}
					return applyAgentFilters;
				} else {
					return t.allowedUsers.includes(auth.currentUser.uid);
				}
			},
			async update(action, condition) {
				const ticketsRef = collection(db, 'tickets');
				const updatePromises = [];

				for (const selected of this.selection) {
					if (condition(selected)) {
						const ticketRef = doc(ticketsRef, selected.id);
						updatePromises.push(updateDoc(ticketRef, action));

						if (selected.hasChildren) {
							const childrenRef = collection(ticketRef, 'children');
							const childrenSnapshot = await getDocs(childrenRef);

							childrenSnapshot.forEach(child => {
								updatePromises.push(
									updateDoc(doc(childrenRef, child.id), action)
								);
							});
						}
					}
				}

				Promise.all(updatePromises)
					.then(() => success('Acción realizada con éxito'))
					.catch(err => {
						warning(err.message);
					});

				this.selection = [];
			},
			asign() {
				this.update(
					{ agentUid: auth.currentUser.uid },
					t => t.agentUid == ''
				);
			},
			close() {
				this.update({ closed: true }, t => t.closed == false);
			},
			async anidar() {
				const parentTicket = this.selection[0];
				const childrenTickets = this.selection.slice(
					1,
					this.selection.length
				);
				const ticketsRef = collection(db, 'tickets');
				const parentTicketRef = doc(ticketsRef, parentTicket.id);
				const childrenRef = collection(parentTicketRef, 'children');
				const updatePromises = [];

				try {
					const parentDoc = await getDoc(parentTicketRef);
					let allowedUsers = parentDoc.data().allowedUsers;

					childrenTickets.forEach(child => {
						allowedUsers.push(child.allowedUsers[0]);
						updatePromises.push(
							setDoc(doc(childrenRef, child.id), child)
						);
						updatePromises.push(
							deleteDoc(doc(ticketsRef, child.id))
						);
					});

					await Promise.all(updatePromises);
					await updateDoc(parentTicketRef, {
						hasChildren: true,
						allowedUsers: allowedUsers
					});
					success('Incidencias anidadas con éxito');
				} catch (error) {
					warning('Se ha producido un error');
				}
			}
		},
		mounted() {
			const ticketsRef = collection(db, 'tickets');
			let q;

			if (!this.isAgent) {
				q = query(
					ticketsRef,
					where('allowedUsers', 'array-contains', auth.currentUser.uid)
				);
			} else {
				q = query(ticketsRef, orderBy('date', 'desc'));
			}

			this.unsubscribe = onSnapshot(q, snapshot => {
				this.tickets = snapshot.docs.map(doc => ({
					id: doc.id,
					...doc.data()
				}));
			});
		},
		unmounted() {
			if (this.unsubscribe) {
				this.unsubscribe();
			}
		}
	};
</script>
