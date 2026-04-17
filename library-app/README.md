# Library App Frontend (React + Vite + TypeScript)

## Setup
1. Backend: Run Spring Boot on `localhost:8080` (JWT auth, user: user/user123)
2. Frontend: `npm install && npm run dev`
3. `.env`:
```
VITE_API_URL=http://localhost:8080/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51TLRDmH93Bu2GSgQRM0if6BtDXmcAfYpLcvqUDUVJ2MY1aBIpVEaJ56bhDgyhDmkUbsXnjDfMHixfBYlKTz45fLW00pB03Ry7C
```

## Key Fixes
- Login 403: Added .env API_URL + debug logs in LoginForm.tsx
- Stripe: Configured publishable key in main.tsx (`loadStripe(VITE_...)`) + Elements provider
- Payment: `/fees` (auth req'd) - fetches fees, Stripe card payment

## Pages
- `/login`, `/register`
- `/fees` - **Payment demo** (login first)
- `/shelf`, `/admin`, `/messages`

Restart dev server after .env changes.
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
