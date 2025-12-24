<template>
	<section>
		<b-field label="Añadir un comentario" label-position="on-border">
			<b-input
				v-model="message"
				placeholder="Escriba un comentario"
				type="textarea"
				maxlength="200"
			></b-input>
		</b-field>
		<b-button type="is-primary" expanded @click="addComment"
			>Añadir</b-button
		>
	</section>
</template>

<script>
	import { auth, db } from '@/firebase';
	import { collection, addDoc } from 'firebase/firestore';
	import { success } from '@/helpers/notificaciones';

	export default {
		data: () => ({
			message: ''
		}),
		props: {
			ticketId: String
		},
		methods: {
			async addComment() {
				const agentId = auth.currentUser.uid;
				const commentsCol = collection(db, 'tickets', this.ticketId, 'comments');
				try {
					await addDoc(commentsCol, {
						agent: auth.currentUser.displayName || agentId,
						message: this.message,
						date: Date.now()
					});
					success('Comentario añadido satisfactoriamente');
					this.message = '';
				} catch (error) {
					console.error('Error adding comment:', error);
				}
			}
		}
	};
</script>
