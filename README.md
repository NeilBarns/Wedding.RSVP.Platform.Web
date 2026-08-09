# Wedding RSVP frontend

React, TypeScript, Vite, and Tailwind frontend for the public wedding experience and administration CMS.

## Playwright smoke tests

Install the Chromium browser once after installing dependencies:

```bash
npx playwright install chromium
```

Create the dedicated `wedding_rsvp_e2e` database in the API repository and copy its `.env.e2e.example` to `.env.e2e`. Start the API explicitly in E2E mode:

```bash
php artisan serve --env=e2e --host=127.0.0.1 --port=8000
```

Set the frontend Playwright environment, then run:

```bash
npm run test:e2e
npm run test:e2e:headed
npm run test:e2e:ui
```

Playwright starts or reuses the Vite development server. Configuration is environment-driven:

```dotenv
PLAYWRIGHT_BASE_URL=http://localhost:5173
PLAYWRIGHT_API_BASE_URL=http://127.0.0.1:8000
PLAYWRIGHT_API_REPO_PATH=C:\path\to\Wedding.RSVP.Platform.API
```

Every Playwright invocation runs the backend's guarded `php artisan --env=e2e e2e:reset --json` command once before tests. This recreates the disposable E2E database, validates that the running API serves the resulting E2E Wedding, and creates authenticated admin browser state through the real Sanctum login flow. Single-file runs also reset the E2E database.

The base URLs must use localhost, a private-network address, or a `.test` hostname; production-like targets are rejected. `PLAYWRIGHT_API_REPO_PATH` must explicitly identify a repository containing `artisan`. The backend command independently requires `APP_ENV=e2e` and an `e2e`-named database, so the development database remains untouched.

Runtime fixture credentials, raw invitation tokens, and authenticated cookies are written under `playwright/.auth/`, overwritten on each run, and ignored by Git. They are never placed in browser local storage or printed by setup.

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
