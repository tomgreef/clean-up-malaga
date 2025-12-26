<template>
	<o-navbar>
		<template #brand>
			<o-navbar-item tag="router-link" :to="{ path: '/' }">
				<h1 class="title">Clean Up</h1>
			</o-navbar-item>
		</template>
		<template #start v-if="isLoggedIn">
			<o-button
				tag="router-link"
				:to="isUser ? '/mistickets' : '/inicioagente'"
				variant="primary"
				>Inicio
			</o-button>
			<o-button
				v-if="isUser"
				tag="router-link"
				to="/crearticket"
				variant="primary"
			>
				Crear incidencia
			</o-button>
		</template>
		<template #end v-if="isLoggedIn">
			<o-navbar-item tag="div">
				<div class="buttons">
					<o-button
						tag="router-link"
						to="/miperfil"
						inverted
						variant="link"
						>Mi perfil</o-button
					>
					<o-button variant="danger" @click="logout"
						>Cerrar sesión</o-button
					>
				</div>
			</o-navbar-item>
		</template>
	</o-navbar>
</template>

<script>
	import { auth } from '@/firebase';
	import { signOut } from 'firebase/auth';

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
				signOut(auth).then(() => {
					this.$router.push({ path: '/' });
				});
			}
		}
	};
</script>
