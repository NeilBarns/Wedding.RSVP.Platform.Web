# Wedding RSVP frontend

React, TypeScript, Vite, and Tailwind frontend for the public wedding experience and administration CMS.

## Playwright smoke tests

Install the Chromium browser once after installing dependencies:

```bash
npx playwright install chromium
```

Start the Laravel API locally, then run:

```bash
npm run test:e2e
npm run test:e2e:headed
npm run test:e2e:ui
```

Playwright starts or reuses the Vite development server. Configuration is environment-driven:

```dotenv
PLAYWRIGHT_BASE_URL=http://localhost:5173
PLAYWRIGHT_API_BASE_URL=http://localhost:8000
PLAYWRIGHT_INVITATION_TOKEN=
PLAYWRIGHT_ADMIN_EMAIL=
PLAYWRIGHT_ADMIN_PASSWORD=
```

The base URLs must use localhost, a private-network address, or a `.test` hostname; production-like targets are rejected before tests run. Only use disposable or explicitly approved local/test data. Credentials and invitation tokens must remain in the environment and must not be committed.

Public landing, invalid-invitation, unauthenticated admin, and mobile login coverage run without fixture credentials. Valid-invitation and authenticated CMS checks are skipped unless their environment values are supplied. RSVP submission/editing and CMS publication mutations are intentionally excluded until the API provides deterministic disposable fixture setup and reset.

## Vite reference

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```
