<template>
	<div>
		<h2 class="title is-4">Zona de riesgo</h2>
		<o-button variant="danger" @click="confirmCustomDelete"
			>Eliminar Perfil</o-button
		>
	</div>
</template>

<script>
	import { auth } from '@/firebase';
	export default {
		methods: {
			confirmCustomDelete() {
				this.$buefy.dialog.confirm({
					title: 'Eliminando cuenta',
					message:
						'¿Estas seguro que quieres <b>eliminar</b> tu cuenta? Esta acción no se puede deshacer.',
					confirmText: 'Eliminar Cuenta',
					type: 'is-danger',
					hasIcon: true,
					onConfirm: () => this.deleteAccount(),
					cancelText: 'Cancelar'
				});
			},
			deleteAccount() {
				auth.currentUser.delete().then(() => {
					this.$buefy.toast.open('¡Cuenta Eliminada!');
					this.$router.replace({ path: '/' });
				});
			}
		}
	};
</script>
