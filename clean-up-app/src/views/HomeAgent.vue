<template>
	<section class="section">
		<div class="container">
			<TicketsTable :isAgent="true" />
		</div>
	</section>
</template>

<script>
	import TicketsTable from '@/components/TicketsTable.vue';

	export default {
		data: () => ({}),
		components: {
			TicketsTable
		}
	};
</script>
