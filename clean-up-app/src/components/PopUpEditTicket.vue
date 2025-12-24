<template>
	<section>
		<hr />
		<o-button
			expanded
			variant="primary"
			@click="isEditTicketModalActive = true"
			size="small"
			:disabled="ticket.closed"
			>Editar detalles de la incidencia</o-button
		>
		<o-modal
			v-model:active="isEditTicketModalActive"
			:width="720"
			v-if="!ticket.closed"
		>
			<div class="card box">
				<o-field
					label="Titulo"
					label-position="on-border"
					:message="
						title.length > 0 && title.length < 10
							? 'El título debe tener 10 caracteres como mínimo'
							: ''
					"
				>
					<o-input v-model="title"></o-input>
				</o-field>

				<o-field
					label="Descripción"
					label-position="on-border"
					:message="
						description.length > 0 && description.length < 20
							? 'La descripcion debe tener 20 caracteres como mínimo'
							: ''
					"
				>
					<o-input
						v-model="description"
						maxlength="250"
						type="textarea"
					></o-input>
				</o-field>

				<o-field label="Número" label-position="on-border">
					<o-inputnumber
						:controls="false"
						v-model="streetNumber"
						min="0"
						max="999"
					></o-inputnumber>
				</o-field>

				<p class="control">
					<o-button
						variant="primary"
						expanded
						@click="saveChanges"
						:disabled="invalid"
						>Guardar</o-button
					>
				</p>
			</div>
		</o-modal>
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
			saveChanges() {
				const ticketRef = doc(db, 'tickets', this.ticket.id);
				updateDoc(ticketRef, {
					title: this.title,
					description: this.description,
					streetNumber: this.streetNumber
				}).then(() => {
					success(
						'Incidencia modificada con éxito. Recarga para ver los cambios'
					);
					this.isEditTicketModalActive = false;
				});
			}
		}
	};
</script>
