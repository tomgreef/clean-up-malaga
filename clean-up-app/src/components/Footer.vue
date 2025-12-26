<template>
	<footer class="footer has-background-primary">
		<div class="content has-text-centered">
			<p>
				<a v-for="item in items" :key="item.name" :href="item.link">
					<o-icon
						:icon="item.icon"
						size="medium"
						variant="light"
					></o-icon>
				</a>
			</p>
			<p class="has-text-light has-text-weight-bold">
				CLEAN UP 2020 @Copyright. Todos los derechos reservados
			</p>
			<div>
				<router-link to="/GDPR" class="has-text-light"
					>Política de protección de datos personales</router-link
				>
			</div>
		</div>
	</footer>
</template>

<style scoped>
	a {
		margin: 0 2%;
	}
</style>

<script>
	export default {
		data() {
			return {
				items: [
					{
						name: 'Facebook',
						link: 'https://facebook.com',
						icon: 'facebook'
					},
					{
						name: 'Twitter',
						link: 'https://twitter.com',
						icon: 'twitter'
					},
					{
						name: 'Instagram',
						link: 'https://instagram.com',
						icon: 'instagram'
					},
					{
						name: 'Ayuntamiento de Málaga',
						link: 'http://www.malaga.eu/',
						icon: 'city'
					},
					{
						name: 'Policia',
						link:
							'https://www.policia.es/depenpol/depenpol_provincia.php?id_region=22&id_provincia=29',
						icon: 'shield'
					},
					{
						name: 'Hospital',
						link: 'http://www.hospitalregionaldemalaga.es/',
						icon: 'hospital'
					}
				]
			};
		}
	};
</script>
