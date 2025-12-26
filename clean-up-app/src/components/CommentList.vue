<template>
	<div>
		<o-collapse
			animation="slide"
			v-model:open="isOpen"
			v-if="this.comments ? this.comments.length > 0 : false"
		>
			<template #trigger>
				<p class="panel-heading has-text-left">
					<strong> Listado de comentarios </strong>
					<o-icon
						:icon="isOpen ? 'chevron-down' : 'chevron-up'"
						size="small"
					>
					</o-icon>
				</p>
			</template>
			<p
				v-for="comment in comments"
				:key="comment.id"
				class="panel-block is-marginless"
			>
				<Comment :comment="comment" />
			</p>
		</o-collapse>
		<p v-else class="box has-text-left">
			<strong>Aún no hay comentarios en esta incidencia</strong>
		</p>
	</div>
</template>

<script>
	import { db } from '@/firebase';
	import {
		collection,
		doc,
		query,
		orderBy,
		onSnapshot
	} from 'firebase/firestore';
	import Comment from '@/components/Comment';

	export default {
		data: () => ({
			isOpen: true,
			comments: []
		}),
		props: {
			ticketId: String
		},
		components: {
			Comment
		},
		mounted() {
			if (this.ticketId) {
				const commentsQuery = query(
					collection(doc(db, 'tickets', this.ticketId), 'comments'),
					orderBy('date')
				);
				this.unsubscribe = onSnapshot(commentsQuery, snapshot => {
					this.comments = snapshot.docs.map(doc => ({
						id: doc.id,
						...doc.data()
					}));
				});
			}
		},
		unmounted() {
			if (this.unsubscribe) {
				this.unsubscribe();
			}
		}
	};
</script>
