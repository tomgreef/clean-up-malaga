<template>
	<section class="box">
		<b-field
			label="Título"
			label-position="on-border"
			position="is-centered"
			expanded
			:message="
				title.length > 0 && title.length < 10
					? 'El título debe tener 10 caracteres como mínimo'
					: ''
			"
		>
			<b-input
				v-model="title"
				placeholder="Ej: Contenedor Arroyo de la Miel"
				maxlength="40"
			></b-input>
		</b-field>

		<b-field
			label="Descripción"
			label-position="on-border"
			position="is-centered"
			:message="
				description.length > 0 && description.length < 20
					? 'La descripción debe tener 20 caracteres como mínimo'
					: ''
			"
		>
			<b-input
				maxlength="250"
				type="textarea"
				placeholder="Ej: El contenedor de reciclaje en el Arroyo de la Miel está..."
				v-model="description"
			></b-input>
		</b-field>

		<b-field grouped group-multiline position="is-centered">
			<b-field label="Código postal" label-position="on-border" expanded>
				<b-numberinput
					placeholder="29007"
					v-model="cp"
					:controls="false"
					min="29000"
					max="29999"
				></b-numberinput>
			</b-field>
			<b-field
				label="Calle"
				label-position="on-border"
				expanded
				:message="
					street.length > 0 && street.length < 10
						? 'La calle debe tener 10 caracteres como mínimo'
						: ''
				"
			>
				<b-input placeholder="Calle cómpeta" v-model="street"></b-input>
			</b-field>
			<b-field label="Número" label-position="on-border" expanded>
				<b-numberinput
					placeholder="Nº 42"
					v-model="streetNumber"
					:controls="false"
					min="0"
					max="999"
				></b-numberinput>
			</b-field>
		</b-field>
		<br />
		<b-field>
			<div class="columns is-centered">
				<div class="column is-half">
					<b-upload
						v-model="images"
						:disabled="imgLimit || invalidImgLimit || invalidSize"
						multiple
						accept="image/*"
						drag-drop
						expanded
					>
						<section class="section">
							<div class="content has-text-centered">
								<p>
									<b-icon
										icon="upload"
										size="is-large"
									></b-icon>
								</p>
								<p>
									Suelta tus archivos aquí o haz clic para
									subirlos
								</p>
								<p>{{ images.length }} / 3</p>
							</div>
						</section>
					</b-upload>
					<div class="tags">
						<span
							v-for="(image, index) in images"
							:key="index"
							:class="'tag has-text-centered ' + getType(index)"
						>
							{{ image.name }}
							<button
								class="delete is-small"
								type="button"
								@click="deleteDropFile(index)"
							></button>
						</span>
					</div>
				</div>
			</div>
		</b-field>
		<br />
		<b-button
			:disabled="invalid || invalidSize || isCreating"
			type="is-primary"
			@click="createTicket"
			expanded
			>Crear la incidencia</b-button
		>
	</section>
</template>

<script>
	import { auth, db, storage } from '@/firebase';
	import { doc, setDoc, collection } from 'firebase/firestore';
	import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
	import { warning } from '@/helpers/notificaciones';
	import { success } from '@/helpers/notificaciones';
	import { invalidTextSize } from '@/helpers/ticketHelper';

	export default {
		data: () => ({
			title: '',
			description: '',
			cp: null,
			street: '',
			streetNumber: null,
			images: [],
			isCreating: false
		}),
		computed: {
			invalid() {
				return (
					invalidTextSize(
						this.title,
						this.description,
						this.cp,
						this.streetNumber,
						this.street
					) ||
					this.images.length > 3 ||
					this.images.length < 1
				);
			},
			invalidSize() {
				let invalid = false;
				let tooBig = element => element.size > 15 * 1024 * 1024;
				if (this.images.length > 0) {
					invalid = this.images.some(tooBig);
					if (invalid) {
						warning('Las imagenes no pueden pesar más de 15mb');
					}
				}
				return invalid;
			},
			imgLimit() {
				return this.images.length == 3;
			},
			invalidImgLimit() {
				let invalid = this.images.length > 3;
				if (invalid) {
					warning('El límite es de 3 imagenes');
				}
				return invalid;
			}
		},
		methods: {
			getType(index) {
				let type = 'is-primary';
				if (this.images[index].size > 15 * 1024 * 1024) {
					type = 'is-danger';
				}
				return type;
			},
			deleteDropFile(index) {
				this.images.splice(index, 1);
			},
			getUploadPromises(ticketId) {
				let uploadPromises = [];
				this.images.forEach(image => {
					const imageRef = storageRef(storage, `tickets/${ticketId}/${image.name}`);
					uploadPromises.push(uploadBytes(imageRef, image));
				});
				return Promise.all(uploadPromises);
			},
			getDownloadPromises(tasks) {
				let downloadPromises = [];
				tasks.forEach(task => {
					downloadPromises.push(getDownloadURL(task.ref));
				});
				return Promise.all(downloadPromises);
			},
			createTicket() {
				this.isCreating = true;
				let uid = auth.currentUser.uid;
				const ticketsCol = collection(db, 'tickets');
				const newTicketRef = doc(ticketsCol);
				const ticketId = newTicketRef.id;
				
				this.getUploadPromises(ticketId)
					.then(tasks => {
						let imagesUrl = [];
						this.getDownloadPromises(tasks)
							.then(urls => {
								urls.forEach(url => {
									imagesUrl.push(url);
								});
							})
							.then(() => {
								setDoc(newTicketRef, {
									id: ticketId,
									title: this.title,
									description: this.description,
									street: this.street,
									streetNumber: this.streetNumber,
									cp: this.cp,
									date: Date.now(),
									images: imagesUrl,
									userUid: uid,
									allowedUsers: [uid],
									hasChildren: false,
									agentUid: '',
									closed: false
								})
									.then(() => {
										success(
											'Su ticket ha sido creado satisfactoriamente'
										);
										this.$router.replace({
											path: '/mistickets'
										});
									});
							});
					})
					.catch(err => {
						console.error(err);
						warning('Se ha producido un error');
					});
			}
		}
	};
</script>
