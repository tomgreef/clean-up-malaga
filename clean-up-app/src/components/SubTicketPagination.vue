<template>
	<div>
		<hr />
		<h4 class="title is-4">Sub incidencias</h4>
		<o-field grouped group-multiline>
			<o-field v-for="child in paginatedTickets" :key="child.id" expanded>
				<p class="control">
					<PopUpTicket
						:ticket="child"
						:isAgent="isAgent"
						:isChild="true"
					/>
				</p>
			</o-field>
		</o-field>
		<o-pagination
			:total="children.length"
			v-model:current="current"
			:per-page="perPage"
		>
		</o-pagination>
	</div>
</template>

<script>
	import { db } from '@/firebase';
	import { collection, doc, onSnapshot } from 'firebase/firestore';

	export default {
		data: () => ({
			current: 1,
			perPage: 3,
			children: []
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
		mounted() {
			if (this.parentId) {
				const childrenRef = collection(
					doc(db, 'tickets', this.parentId),
					'children'
				);
				this.unsubscribe = onSnapshot(childrenRef, snapshot => {
					this.children = snapshot.docs.map(doc => ({
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
