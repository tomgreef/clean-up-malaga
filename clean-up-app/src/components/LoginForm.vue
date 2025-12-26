<template>
	<div class="box">
		<h1 class="title is-4">Inicio de sesión</h1>
		<o-field label="Email" label-position="on-border">
			<o-input v-model="email"></o-input>
		</o-field>
		<o-field label="Contraseña" label-position="on-border">
			<o-input v-model="pass" type="password" password-reveal></o-input>
		</o-field>
		<o-button
			@click="inicio"
			class="button"
			variant="primary"
			expanded
			:disabled="validate"
			>Iniciar sesión</o-button
		>
	</div>
</template>

<script>
	import { auth } from '@/firebase';
	import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
	import authErrors from '@/helpers/authErrors';
	import { warning } from '@/helpers/notificaciones';
	import getUserType from '@/helpers/sessionHelper';

	export default {
		data: () => ({
			email: '',
			pass: ''
		}),
		computed: {
			validate: function() {
				return this.pass.length < 6 || this.email.length < 10;
			}
		},
		methods: {
			inicio() {
				signInWithEmailAndPassword(auth, this.email, this.pass)
					.then(userRef => {
						getUserType().then(type => {
							if (type == 'agent' || userRef.user.emailVerified) {
								this.$store.commit('change', type);
								this.$router.replace({ path: '/home' });
							} else {
								warning(
									'Verifica tu correo para iniciar sesión'
								);
								signOut(auth);
							}
						});
					})
					.catch(error => {
						warning(authErrors(error));
						signOut(auth);
					});
			}
		}
	};
</script>
