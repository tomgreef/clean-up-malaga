<template>
	<section class="hero is-primary">
		<div class="hero-head">
			<div class="container">
				<Navbar />
			</div>
		</div>
	</section>
</template>

<script>
	import Navbar from '@/components/Navbar.vue';

	export default {
		components: {
			Navbar
		}
	};
</script>
