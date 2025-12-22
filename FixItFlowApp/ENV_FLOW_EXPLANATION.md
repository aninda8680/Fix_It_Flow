# Environment Variables Flow: `.env` → `Auth.tsx`

## Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. .env FILE (Root directory)                                   │
│    ───────────────────────────────────────────────────────────  │
│    BACKEND_API_URL=http://192.168.0.133:5000                   │
│                                                                  │
│    This is where you store your environment variables           │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │ Read by Babel plugin
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. babel.config.js                                              │
│    ───────────────────────────────────────────────────────────  │
│    plugins: [                                                   │
│      ['module:react-native-dotenv', {                          │
│        moduleName: '@env',      ← Creates virtual '@env' module│
│        path: '.env',            ← Points to .env file          │
│        allowUndefined: true,                                    │
│      }]                                                         │
│    ]                                                             │
│                                                                  │
│    This Babel plugin reads .env and creates a virtual module    │
│    that can be imported as '@env'                               │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │ Transforms imports at BUILD TIME
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. src/types/env.d.ts (TypeScript Declarations)                │
│    ───────────────────────────────────────────────────────────  │
│    declare module '@env' {                                      │
│      export const BACKEND_API_URL: string;                      │
│    }                                                             │
│                                                                  │
│    This tells TypeScript: "Hey, '@env' module exists and        │
│    exports BACKEND_API_URL as a string"                         │
│                                                                  │
│    Without this, TypeScript would throw an error!               │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │ TypeScript uses this for type checking
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│ 4. src/services/api.ts                                          │
│    ───────────────────────────────────────────────────────────  │
│    import { BACKEND_API_URL } from "@env";  ← Import from '@env'│
│                                                                  │
│    const api = axios.create({                                   │
│      baseURL: BACKEND_API_URL,  ← Uses the env variable         │
│      ...                                                        │
│    });                                                           │
│                                                                  │
│    At BUILD TIME, Babel transforms this import into:            │
│    const BACKEND_API_URL = "http://192.168.0.133:5000";        │
│                                                                  │
│    Then exports the configured axios instance                    │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │ Import the configured API
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│ 5. src/screens/Auth.tsx                                         │
│    ───────────────────────────────────────────────────────────  │
│    import api from "../services/api";  ← Uses the API service  │
│                                                                  │
│    const res = await api.post("/api/auth/login", {...});        │
│                                                                  │
│    The 'api' instance already has the baseURL configured         │
│    from BACKEND_API_URL in .env                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Step-by-Step Explanation

### Step 1: `.env` File
- **Location**: Root of your project (`FixItFlowApp/.env`)
- **Content**: `BACKEND_API_URL=http://192.168.0.133:5000`
- **Purpose**: Stores environment-specific configuration

### Step 2: Babel Configuration (`babel.config.js`)
- **Plugin**: `react-native-dotenv`
- **What it does**:
  - Reads the `.env` file
  - Creates a virtual module named `@env`
  - At **build time**, replaces `import { BACKEND_API_URL } from "@env"` 
    with `const BACKEND_API_URL = "http://192.168.0.133:5000"`

### Step 3: TypeScript Declarations (`src/types/env.d.ts`)
- **Purpose**: Tells TypeScript that `@env` module exists
- **Why needed**: TypeScript doesn't know about the virtual module created by Babel
- **Without this**: You'd get `Cannot find module '@env'` error

### Step 4: API Service (`src/services/api.ts`)
- **Imports**: `import { BACKEND_API_URL } from "@env"`
- **Uses**: Creates axios instance with `baseURL: BACKEND_API_URL`
- **Exports**: Configured axios instance

### Step 5: Auth Component (`src/screens/Auth.tsx`)
- **Imports**: `import api from "../services/api"`
- **Uses**: `api.post("/api/auth/login", {...})`
- **Result**: API calls automatically use the base URL from `.env`

## Key Concepts

### Build-Time vs Runtime
- **Build-Time**: Babel transforms your code BEFORE it runs
- The `@env` import is replaced with actual values during build
- This means environment variables are **baked into** your app bundle

### Why This Pattern?
1. **Centralized Configuration**: Change `.env` to switch between dev/staging/prod
2. **Type Safety**: TypeScript knows about your env variables
3. **No Runtime Overhead**: Values are inlined at build time
4. **React Native Compatible**: Works with Metro bundler

## Important Notes

⚠️ **Security Warning**: 
- Environment variables are **bundled into your app**
- Don't put secrets/API keys in `.env` for React Native apps
- Use them for non-sensitive config like API URLs

⚠️ **Restart Required**:
- After changing `.env`, restart Metro bundler
- Clear cache: `npm start -- --reset-cache`

## Alternative Flow (If You Want Direct Access)

You could also import directly in `Auth.tsx`:

```typescript
// In Auth.tsx
import { BACKEND_API_URL } from "@env";

const api = axios.create({
  baseURL: BACKEND_API_URL,
  ...
});
```

But the current pattern (centralized in `api.ts`) is better because:
- ✅ Single source of truth for API configuration
- ✅ Reusable across all screens
- ✅ Easier to add interceptors, error handling, etc.
