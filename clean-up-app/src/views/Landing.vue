<template>
	<section class="section">
		<div class="container">
			<div class="columns is-centered">
				<div class="column is-half">
					<o-tabs position="is-centered" variant="toggle" expanded>
						<o-tab-item label="Inicio de sesión">
							<LoginForm />
						</o-tab-item>
						<o-tab-item label="Crear cuenta de usuario">
							<SignupForm />
						</o-tab-item>
					</o-tabs>
				</div>
			</div>
		</div>
	</section>
</template>

<script>
	import LoginForm from '@/components/LoginForm';
	import SignupForm from '@/components/SignupForm';

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
