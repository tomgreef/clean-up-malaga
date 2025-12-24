<template>
	<section>
		<hr />
		<b-button
			expanded
			type="is-primary"
			@click="isEditTicketModalActive = true"
			size="is-small"
			:disabled="ticket.closed"
			>Editar detalles de la incidencia</b-button
		>
		<b-modal
			:active.sync="isEditTicketModalActive"
			:width="720"
			v-if="!ticket.closed"
		>
			<div class="card box">
				<b-field
					label="Titulo"
					label-position="on-border"
					:message="
						title.length > 0 && title.length < 10
							? 'El título debe tener 10 caracteres como mínimo'
							: ''
					"
				>
					<b-input v-model="title"></b-input>
				</b-field>

				<b-field
					label="Descripción"
					label-position="on-border"
					:message="
						description.length > 0 && description.length < 20
							? 'La descripcion debe tener 20 caracteres como mínimo'
							: ''
					"
				>
					<b-input
						v-model="description"
						maxlength="250"
						type="textarea"
					></b-input>
				</b-field>

				<b-field label="Número" label-position="on-border">
					<b-numberinput
						:controls="false"
						v-model="streetNumber"
						min="0"
						max="999"
					></b-numberinput>
				</b-field>

				<p class="control">
					<b-button
						type="is-primary"
						expanded
						@click="saveChanges"
						:disabled="invalid"
						>Guardar</b-button
					>
				</p>
			</div>
		</b-modal>
	</section>
</template>

<script>
	import { auth, db } from '@/firebase';
	import { doc, updateDoc } from 'firebase/firestore';
	import { success } from '@/helpers/notificaciones';
	import { invalidTextSize } from '@/helpers/ticketHelper';

	export default {
		data: () => ({
			title: '',
			description: '',
			cp: null,
			street: '',
			streetNumber: null,
			isEditTicketModalActive: false
		}),
		props: {
			ticket: Object
		},
		mounted() {
			this.title = this.ticket.title;
			this.description = this.ticket.description;
			this.cp = this.ticket.cp;
			this.street = this.ticket.street;
			this.streetNumber = this.ticket.streetNumber;
		},
		computed: {
			invalid() {
				return invalidTextSize(
					this.title,
					this.description,
					this.cp,
					this.streetNumber,
					this.street
				);
			},
			currentUserUid() {
				return auth.currentUser.uid;
			}
		},
		methods: {
			async saveChanges() {
				const ticketRef = doc(db, 'tickets', this.ticket.id);
				try {
					await updateDoc(ticketRef, {
						title: this.title,
						description: this.description,
						streetNumber: this.streetNumber
					});
					success(
						'Incidencia modificada con éxito. Recarga para ver los cambios'
					);
					this.isEditTicketModalActive = false;
				} catch (error) {
					console.error('Error updating ticket:', error);
				}
			}
		}
	};
</script>
