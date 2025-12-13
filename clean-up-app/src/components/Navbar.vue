<template>
	<b-navbar type="is-primary" :spaced="true">
		<template #brand>
			<b-navbar-item tag="router-link" :to="{ path: '/' }">
				<h1 class="title">Clean Up</h1>
			</b-navbar-item>
		</template>
		<template #start v-if="isLoggedIn">
			<b-button
				tag="router-link"
				:to="isUser ? '/mistickets' : '/inicioagente'"
				type="is-primary"
				>Inicio
			</b-button>
			<b-button
				v-if="isUser"
				tag="router-link"
				to="/crearticket"
				type="is-primary"
			>
				Crear incidencia
			</b-button>
		</template>
		<template #end v-if="isLoggedIn">
			<b-navbar-item tag="div">
				<div class="buttons">
					<b-button
						tag="router-link"
						to="/miperfil"
						inverted
						type="is-link"
						>Mi perfil</b-button
					>
					<b-button type="is-danger" @click="logout"
						>Cerrar sesión</b-button
					>
				</div>
			</b-navbar-item>
		</template>
	</b-navbar>
</template>

<script>
	import { auth } from '@/firebase';

	export default {
		computed: {
			isUser() {
				return this.$store.getters.type == 'user';
			},
			inUserLanding() {
				return this.$route.path == '/';
			},
			isLoggedIn() {
				return auth.currentUser != null;
			}
		},
		methods: {
			logout() {
				auth.signOut().then(() => {
					this.$router.push({ path: '/' });
				});
			}
		}
	};
</script>
