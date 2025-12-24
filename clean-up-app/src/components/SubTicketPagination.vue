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
	import { collection, query } from 'firebase/firestore';
	import { useCollection } from 'vuefire';
	import { computed, ref } from 'vue';

	export default {
		props: {
			isAgent: Boolean,
			parentId: String
		},
		components: {
			PopUpTicket: () => import('@/components/PopUpTicket.vue')
		},
		setup(props) {
			const current = ref(1);
			const perPage = ref(3);
			
			// Create a query for the children subcollection
			const childrenQuery = computed(() => 
				query(collection(db, 'tickets', props.parentId, 'children'))
			);
			
			// Use VueFire's useCollection to bind the data
			const children = useCollection(childrenQuery);
			
			const paginatedTickets = computed(() => {
				return children.value.slice(
					(current.value - 1) * perPage.value,
					current.value * perPage.value
				);
			});
			
			return {
				current,
				perPage,
				children,
				paginatedTickets
			};
		}
	};
</script>
