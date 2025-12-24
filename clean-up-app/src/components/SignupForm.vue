<template>
	<div class="box">
		<h1 class="title is-4">Crear cuenta</h1>
		<b-field label="Nombre" label-position="on-border">
			<b-input v-model="name"></b-input>
		</b-field>
		<b-field label="Email" label-position="on-border">
			<b-input v-model="email"></b-input>
		</b-field>
		<b-field label="Contraseña" label-position="on-border">
			<b-input v-model="pass" type="password" password-reveal></b-input>
		</b-field>
		<div class="field">
			<b-checkbox v-model="gdpr">
				Al seleccionar esta casilla reconoce que ha leído y acepta las
				<router-link to="/GDPR" target="_blank"
					>condiciones de uso y la política de protección de datos
					personales</router-link
				>
				de Clean-Up
			</b-checkbox>
		</div>
		<b-button
			class="button"
			type="is-primary"
			expanded
			@click="signup"
			:disabled="validate"
			>Crear cuenta</b-button
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
				import('firebase/auth').then(({ createUserWithEmailAndPassword, updateProfile, sendEmailVerification }) => {
					import('firebase/firestore').then(({ doc, setDoc }) => {
						createUserWithEmailAndPassword(auth, this.email, this.pass)
							.then(userCredential => {
								updateProfile(userCredential.user, {
									displayName: this.name
								})
									.then(() => {
										const userDocRef = doc(db, 'users', userCredential.user.uid);
										return setDoc(userDocRef, {
											type: 'user'
										});
									})
									.then(() => {
										sendEmailVerification(userCredential.user)
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
					});
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
