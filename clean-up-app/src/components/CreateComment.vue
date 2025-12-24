<template>
	<section>
		<o-field label="Añadir un comentario" label-position="on-border">
			<o-input
				v-model="message"
				placeholder="Escriba un comentario"
				type="textarea"
				maxlength="200"
			></o-input>
		</o-field>
		<o-button variant="primary" expanded @click="addComment"
			>Añadir</o-button
		>
	</section>
</template>

<script>
	import { auth, db } from '@/firebase';
	import { collection, doc, addDoc } from 'firebase/firestore';
	import { success } from '@/helpers/notificaciones';

	export default {
		data: () => ({
			message: ''
		}),
		props: {
			ticketId: String
		},
		methods: {
			addComment() {
				const agentId = auth.currentUser.uid;
				const commentsRef = collection(
					doc(db, 'tickets', this.ticketId),
					'comments'
				);
				addDoc(commentsRef, {
					agent: auth.currentUser.displayName || agentId,
					message: this.message,
					date: Date.now()
				}).then(() => {
					success('Comentario añadido satisfactoriamente');
					this.message = '';
				});
			}
		}
	};
</script>
