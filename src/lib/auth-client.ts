import { createAuthClient } from "better-auth/react";
import { stripeClient } from "@better-auth/stripe/client";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const baseURL = apiUrl.replace('/api', '');

export const authClient = createAuthClient({
  baseURL,
  plugins: [
    stripeClient({
      subscription: true,
    }),
  ],
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
} = authClient;
