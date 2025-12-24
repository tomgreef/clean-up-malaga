import { useOruga } from '@oruga-ui/oruga-next';

export function warning(msg) {
	const oruga = useOruga();
	oruga.notification.open({
		duration: 2500,
		message: msg,
		variant: 'warning',
		position: 'top',
		closable: true
	});
}

export function success(msg) {
	const oruga = useOruga();
	oruga.notification.open({
		duration: 2500,
		message: msg,
		variant: 'success',
		position: 'top',
		closable: true
	});
}

export default {
	success,
	warning
};
