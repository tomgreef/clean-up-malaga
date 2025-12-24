import { createRouter, createWebHistory } from 'vue-router';
import { auth } from '@/firebase';
import store from '@/store/store';

const routes = [
	{
		path: '/',
		component: () => import('@/views/Landing'),
		meta: {
			title: 'Inicio'
		}
	},
	{
		path: '/miperfil',
		component: () => import('@/views/Profile'),
		meta: {
			title: 'Mi perfil'
		}
	},
	// Rutas de usuario
	{
		path: '/mistickets',
		component: () => import('@/views/HomeUser'),
		meta: {
			title: 'Mis tickets',
			userType: 'user'
		}
	},
	{
		path: '/crearticket',
		component: () => import('@/views/CreateTicket'),
		meta: {
			title: 'Crear ticket',
			userType: 'user'
		}
	},
	// Rutas de agente
	{
		path: '/inicioagente',
		component: () => import('@/views/HomeAgent'),
		meta: {
			title: 'Inicio de agente',
			userType: 'agent'
			// userType: 'agent'
		}
	},
	{
		path: '/GDPR',
		component: () => import('@/views/GDPR'),
		meta: {
			title: 'GDPR'
		}
	}
];

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes
});

router.beforeEach((to, from, next) => {
	document.title = to.meta.title;

	function homeRedirect(type) {
		switch (type) {
			case 'user':
				next({ path: '/mistickets' });
				break;
			case 'agent':
				next({ path: '/inicioagente' });
				break;
		}
	}

	if (!auth.currentUser) {
		// Si no ha iniciado sesión ...
		if (!to.meta.userType) {
			// Y la ruta no requiere un tipo concreto de usuario ...
			next(); // Continua a la ruta
		} else {
			// En caso contrario ...
			next({ path: '/' }); // Ve al inicio
		}
	} else {
		// Si ha iniciado sesión ...
		let type = store.getters.type; // Obten el tipo de usuario
		if (
			to.path == '/home' ||
			to.path == '/' ||
			(!!to.meta.userType && to.meta.userType != type)
		) {
			// Si va a 'home', inicio, o no tiene permisos...
			homeRedirect(type); // Ve a la pagina de inicio de su tipo de usuario
		} else {
			// Pero si tiene permisos...
			next(); // Continua a la ruta
		}
	}
});

export default router;
