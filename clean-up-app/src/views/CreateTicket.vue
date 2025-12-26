<template>
	<section class="section">
		<div class="columns is-centered">
			<div class="column is-half">
				<h1 class="title">Crear una incidencia</h1>
				<CreateTicket />
			</div>
		</div>
	</section>
</template>

<script>
	import CreateTicket from '@/components/CreateTicket.vue';

	export default {
		components: {
			CreateTicket
		}
	};
</script>
