<template>
	<div id="app">
		<Hero />
		<transition name="fade" mode="out-in">
			<router-view id="view" />
		</transition>
		<Footer id="footer" />
	</div>
</template>

<style scoped>
	#app {
		display: flex;
		min-height: 100vh;
		flex-direction: column;
	}

	#view {
		flex: 1;
	}
</style>

<script>
	import Hero from '@/components/Hero.vue';
	import Footer from '@/components/Footer.vue';

	export default {
		components: {
			Hero,
			Footer
		},
		mounted() {
			console.log('App.vue mounted successfully');
			console.log('Current route:', this.$route.path);
		}
	};
</script>
