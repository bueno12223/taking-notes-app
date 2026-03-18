"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Amplify } from "aws-amplify";
import {
  signIn as amplifySignIn,
  signUp as amplifySignUp,
  signOut as amplifySignOut,
  getCurrentUser,
  AuthUser,
} from "aws-amplify/auth";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!,
      userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
    },
  },
});

/**
 * Interface representing the authentication state and actions.
 */
interface AuthContextValue {
  /** The current authenticated user object or null if not authenticated. */
  user: AuthUser | null;
  /** Boolean flag indicating if the authentication session is being initially loaded. */
  isLoading: boolean;
  /**
   * Authenticates a user with email and password.
   * @param email - The user's email address.
   * @param password - The user's password.
   * @throws {Error} If authentication fails.
   */
  signIn: (email: string, password: string) => Promise<void>;
  /**
   * Signs up a new user with email and password.
   * @param email - The user's email address.
   * @param password - The user's password.
   * @throws {Error} If signup fails.
   */
  signUp: (email: string, password: string) => Promise<void>;
  /**
   * Signs out the current user and clears the session.
   * @throws {Error} If signout fails.
   */
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Component that provides authentication state and actions to its children.
 * Initializes the Amplify configuration and monitors the current user session.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  const signIn = async (email: string, password: string) => {
    await amplifySignIn({ username: email, password });
    const current = await getCurrentUser();
    setUser(current);
  };

  const signUp = async (email: string, password: string) => {
    await amplifySignUp({ username: email, password, options: { userAttributes: { email } } });
  };

  const signOut = async () => {
    await amplifySignOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to access authentication context.
 * Must be used within an AuthProvider.
 * @returns The authentication context value.
 * @throws {Error} If used outside of an AuthProvider.
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
