# Clean Up Malaga - Development Guide

## Vue 3 Migration Complete ✅

This project has been migrated from Vue 2 to Vue 3 with modern tooling.

## ⚠️ IMPORTANT: How to Run the Application

**DO NOT open `index.html` directly in your browser!** This will cause the error:
```
Uncaught TypeError: Failed to resolve module specifier "vue"
```

Modern JavaScript modules require a web server to work properly.

## Development Mode (Recommended)

```bash
npm install
npm run dev
```

Then open your browser to the URL shown (usually **http://localhost:5173**)

## Production Preview

To preview the production build:

```bash
npm run build
npm run preview
```

Then open your browser to the URL shown (usually **http://localhost:4173**)

## Why the Error Occurs

The error "Failed to resolve module specifier 'vue'" happens when:

1. ❌ **Opening `index.html` directly** - ES modules don't work with `file://` protocol
2. ❌ **Opening built files without a server** - Module resolution requires HTTP/HTTPS
3. ✅ **Solution**: Always use `npm run dev` or `npm run preview`

## Technology Stack

- **Vue 3.5.25** - Progressive JavaScript framework
- **Vue Router 4** - Official router  
- **Vuex 4** - State management
- **Vite 6** - Fast build tool and dev server
- **Firebase 12** - Backend services (modular SDK)
- **VueFire 3** - Vue bindings for Firebase
- **Bulma 1.0** - CSS framework
- **Vitest 2** - Unit testing framework

## Available Scripts

- `npm run dev` - Start development server with hot-reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm test` - Run unit tests
- `npm run lint` - Lint and fix code

## Deployment

When deploying, ensure your web server:
1. Serves files via HTTP/HTTPS (not file://)
2. Redirects all routes to `index.html` (for Vue Router)
3. Serves all assets in `dist/assets/`

### Testing Built Files Locally

```bash
npm run build
npx serve dist
```

Or using Python:
```bash
python -m http.server 8000 --directory dist
```

## Common Issues

### "Failed to resolve module specifier" Error
- **Cause**: Opening HTML file directly or without proper server
- **Solution**: Use `npm run dev` or `npm run preview`

### White Screen
1. Check browser console for errors
2. Ensure dev server is running (`npm run dev`)
3. Check Firebase credentials in `src/firebase.js`

### Build Errors
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Migration Notes

This project was migrated from Vue 2 to Vue 3:
- Buefy → Compatibility layer with Bulma
- Firebase 8 → 12 (modular SDK)
- Vue CLI → Vite
- Jest → Vitest

See the compatibility layer in `src/plugins/buefy-compat.js`.
