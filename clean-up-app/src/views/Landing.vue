<template>
	<section class="section">
		<div class="container">
			<div class="columns is-centered">
				<div class="column is-half">
					<b-tabs position="is-centered" type="is-toggle" expanded>
						<b-tab-item label="Inicio de sesión">
							<LoginForm />
						</b-tab-item>
						<b-tab-item label="Crear cuenta de usuario">
							<SignupForm />
						</b-tab-item>
					</b-tabs>
				</div>
			</div>
		</div>
	</section>
</template>

<script>
	import LoginForm from '@/components/LoginForm.vue';
	import SignupForm from '@/components/SignupForm.vue';

	export default {
		data: () => ({
			redirect: '/mistickets'
		}),
		components: {
			LoginForm,
			SignupForm
		}
	};
</script>
