# Better Auth Integration

## Overview

The application has been migrated from React Query-based authentication to Better Auth for a more streamlined and direct authentication flow.

## Architecture

### Better Auth Client

Located in `src/lib/auth-client.ts`, this is the core authentication client that communicates with the backend.

```typescript
import { createAuthClient } from "better-auth/react";

const authClient = createAuthClient({
  baseURL: "http://localhost:3000", // Backend API URL
});
```

### Authentication Hooks

#### `useAuth()`

Provides authentication actions without React Query dependency:

- `login(credentials, options)` - Sign in with email/password
- `signup(credentials, options)` - Create a new account
- `logout()` - Sign out
- Loading states: `isLoggingIn`, `isSigningUp`, `isLoggingOut`
- Error states: `loginError`, `signupError`

**Example:**
```typescript
const { login, isLoggingIn, loginError } = useAuth();

await login({ email, password }, {
  onSuccess: () => navigate('/dashboard'),
  onError: (error) => toast.error(error.message)
});
```

#### `useSession()`

Provides current session information using Better Auth's session hook:

- `session` - Current session object
- `user` - Current user data
- `isAuthenticated` - Boolean authentication status
- `isLoading` - Session loading state
- `planId` - User's subscription plan

**Example:**
```typescript
const { user, isAuthenticated, isLoading } = useSession();

if (isLoading) return <Spinner />;
if (!isAuthenticated) return <Navigate to="/login" />;
```

## API Integration

### Backend Requirements

Better Auth expects the backend to be configured at `http://localhost:3000` with standard Better Auth endpoints:

- `POST /api/auth/sign-in/email` - Email/password login
- `POST /api/auth/sign-up/email` - User registration
- `POST /api/auth/sign-out` - Logout
- `GET /api/auth/session` - Get current session

### Configuration

The API base URL can be configured via environment variable:

```env
VITE_API_URL=http://localhost:3000/api
```

The auth client automatically strips `/api` suffix to get the base URL for Better Auth.

## Protected Routes

Routes are protected using the `ProtectedRoute` component:

```typescript
<ProtectedRoute>
  <DashboardLayout />
</ProtectedRoute>
```

If a user is not authenticated, they are redirected to `/login` with the attempted location saved for later redirect.

## Migration from React Query

### What Changed

1. **Authentication Hooks** - No longer use `useMutation` or `useQuery` from React Query
2. **Direct API Calls** - Better Auth handles API communication directly
3. **Session Management** - Better Auth manages sessions automatically
4. **Token Storage** - Better Auth handles token storage via cookies/localStorage

### What Stayed the Same

1. **UI Components** - LoginForm and SignupForm work the same
2. **Type Safety** - All TypeScript types maintained
3. **Error Handling** - Same error handling patterns
4. **User Experience** - Same UX, just more efficient backend integration

## Benefits

1. **Simpler Code** - Less boilerplate, no React Query wrapper needed
2. **Better Performance** - Direct API calls without cache management overhead
3. **Automatic Session Management** - Better Auth handles token refresh automatically
4. **Standard Authentication** - Follows Better Auth conventions used by the backend
5. **Smaller Bundle** - Reduced dependencies for auth features

## Testing

To test authentication:

1. Start the backend server: `npm run dev` (backend)
2. Start the frontend: `npm run dev` (frontend)
3. Navigate to `http://localhost:5173/login`
4. Create an account or login
5. Verify redirect to dashboard
6. Test logout functionality

## Troubleshooting

### Session Not Persisting

Check that Better Auth is configured correctly on the backend and that cookies are being set properly.

### Login Fails

- Verify backend is running at `http://localhost:3000`
- Check browser console for CORS errors
- Verify Better Auth endpoints are correctly configured on backend

### Type Errors

Better Auth session data structure should match:

```typescript
interface Session {
  user: {
    id: string;
    email: string;
    name?: string;
    planId?: string;
    // ... other user fields
  };
  // ... other session fields
}
```

## Future Improvements

- Add social authentication providers (Google, GitHub, etc.)
- Implement email verification
- Add password reset flow
- Add two-factor authentication
- Session timeout handling
