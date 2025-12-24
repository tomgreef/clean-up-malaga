<template>
	<div class="box">
		<h1 class="title is-4">Inicio de sesión</h1>
		<b-field label="Email" label-position="on-border">
			<b-input v-model="email"></b-input>
		</b-field>
		<b-field label="Contraseña" label-position="on-border">
			<b-input v-model="pass" type="password" password-reveal></b-input>
		</b-field>
		<b-button
			@click="inicio"
			class="button"
			type="is-primary"
			expanded
			:disabled="validate"
			>Iniciar sesión</b-button
		>
	</div>
</template>

<script>
	import { auth } from '@/firebase';
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
				import('firebase/auth').then(({ signInWithEmailAndPassword, signOut }) => {
					signInWithEmailAndPassword(auth, this.email, this.pass)
						.then(userCredential => {
							getUserType().then(type => {
								if (type == 'agent' || userCredential.user.emailVerified) {
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
				});
			}
		}
	};
</script>
