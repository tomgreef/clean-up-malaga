<template>
	<div>
		<hr />
		<h4 class="title is-4">Sub incidencias</h4>
		<b-field grouped group-multiline>
			<b-field v-for="child in paginatedTickets" :key="child.id" expanded>
				<p class="control">
					<PopUpTicket
						:ticket="child"
						:isAgent="isAgent"
						:isChild="true"
					/>
				</p>
			</b-field>
		</b-field>
		<b-pagination
			:total="children.length"
			:current.sync="current"
			:per-page="perPage"
		>
		</b-pagination>
	</div>
</template>

<script>
	import { db } from '@/firebase';

	export default {
		data: () => ({
			current: 1,
			perPage: 3
		}),
		props: {
			isAgent: Boolean,
			parentId: String
		},
		components: {
			PopUpTicket: () => import('@/components/PopUpTicket.vue')
		},
		computed: {
			paginatedTickets() {
				return this.children.slice(
					(this.current - 1) * this.perPage,
					this.current * this.perPage
				);
			}
		},
		firestore() {
			return {
				children: db
					.collection('tickets')
					.doc(this.parentId)
					.collection('children')
			};
		}
	};
</script>
