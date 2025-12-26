<template>
	<div>
		<h2 class="title is-4">Cambia tu nombre de usuario</h2>
		<o-field label="Name">
			<o-input v-model="name" palceholder="Nombre de usuario"></o-input>
		</o-field>
		<o-button variant="primary" @click="saveName" :disabled="invalidName"
			>Cambiar nombre</o-button
		>
	</div>
</template>

<script>
	import { auth } from '@/firebase';
	import { success } from '@/helpers/notificaciones';
	export default {
		data: () => ({
			name: ''
		}),
		computed: {
			invalidName() {
				return this.name.length < 3;
			}
		},
		methods: {
			saveName() {
				auth.currentUser
					.updateProfile({
						displayName: this.name
					})
					.then(
						success(
							'Tu nombre se ha cambiado, recarga para ver los cambios'
						)
					);
			}
		}
	};
</script>
