<template>
	<div class="box">
		<h1 class="title is-4">Crear cuenta</h1>
		<o-field label="Nombre" label-position="on-border">
			<o-input v-model="name"></o-input>
		</o-field>
		<o-field label="Email" label-position="on-border">
			<o-input v-model="email"></o-input>
		</o-field>
		<o-field label="Contraseña" label-position="on-border">
			<o-input v-model="pass" type="password" password-reveal></o-input>
		</o-field>
		<div class="field">
			<o-checkbox v-model="gdpr">
				Al seleccionar esta casilla reconoce que ha leído y acepta las
				<router-link to="/GDPR" target="_blank"
					>condiciones de uso y la política de protección de datos
					personales</router-link
				>
				de Clean-Up
			</o-checkbox>
		</div>
		<o-button
			class="button"
			variant="primary"
			expanded
			@click="signup"
			:disabled="validate"
			>Crear cuenta</o-button
		>
	</div>
</template>

<script>
	import { auth, db } from '@/firebase';
	import authErrors from '@/helpers/authErrors';
	import { warning, success } from '@/helpers/notificaciones.js';

	export default {
		data: () => ({
			name: '',
			email: '',
			pass: '',
			gdpr: false
		}),
		computed: {
			validate: function() {
				return (
					this.pass.length < 6 ||
					this.name.length < 3 ||
					this.email.length < 8 ||
					this.gdpr == false
				);
			}
		},
		methods: {
			signup() {
				auth.createUserWithEmailAndPassword(this.email, this.pass)
					.then(userRef => {
						userRef.user
							.updateProfile({
								displayName: this.name
							})
							.then(() => {
								db.collection('users')
									.doc(userRef.user.uid)
									.set({
										type: 'user'
									});
							})
							.then(() => {
								userRef.user
									.sendEmailVerification()
									.then(() => {
										success(
											'Email de verificación enviado, comprueba tu correo'
										);
									});
								this.reset();
							});
					})
					.catch(error => {
						warning(authErrors(error));
					});
			},
			reset() {
				this.name = '';
				this.email = '';
				this.pass = '';
				this.gdpr = false;
			}
		}
	};
</script>
