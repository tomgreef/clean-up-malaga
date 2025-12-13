<template>
	<div>
		<b-collapse
			animation="slide"
			:open.sync="isOpen"
			v-if="this.comments ? this.comments.length > 0 : false"
		>
			<p class="panel-heading has-text-left" slot="trigger">
				<strong> Listado de comentarios </strong>
				<b-icon
					:icon="isOpen ? 'chevron-down' : 'chevron-up'"
					size="is-small"
				>
				</b-icon>
			</p>
			<p
				v-for="comment in comments"
				:key="comment.id"
				class="panel-block is-marginless"
			>
				<Comment :comment="comment" />
			</p>
		</b-collapse>
		<p v-else class="box has-text-left">
			<strong>Aún no hay comentarios en esta incidencia</strong>
		</p>
	</div>
</template>

<script>
	import { db } from '@/firebase';
	import Comment from '@/components/Comment.vue';
	export default {
		data: () => ({
			isOpen: true
		}),
		props: {
			ticketId: String
		},
		components: {
			Comment
		},
		firestore() {
			return {
				comments: db
					.collection('tickets')
					.doc(this.ticketId)
					.collection('comments')
					.orderBy('date')
			};
		}
	};
</script>
