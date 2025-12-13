// Simple notification wrapper that uses browser alerts as fallback
// This avoids the complexity of accessing the Vue app instance
// For a better solution, components should use the programmatic API directly

export function warning(msg) {
	if (typeof window !== 'undefined') {
		// Simple console log for now - components can use $oruga directly
		console.warn(msg);
		// Could also create a toast/alert element here
		showToast(msg, 'warning');
	}
}

export function success(msg) {
	if (typeof window !== 'undefined') {
		console.log(msg);
		showToast(msg, 'success');
	}
}

function showToast(message, variant) {
	// Create a simple toast notification element
	const toast = document.createElement('div');
	toast.className = `notification is-${variant}`;
	toast.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999; max-width: 400px;';
	toast.innerHTML = `
		<button class="delete" onclick="this.parentElement.remove()"></button>
		${message}
	`;
	document.body.appendChild(toast);
	
	setTimeout(() => {
		if (toast.parentElement) {
			toast.remove();
		}
	}, 2500);
}

export default {
	success,
	warning
};
