"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchAuthSession } from "aws-amplify/auth";
import { toast } from "sonner";
import { getFriendlyErrorMessage } from "@/lib/error-mapping";

interface RequestOptions {
  method?: string;
  body?: unknown;
}

/**
 * Configuration options for the API request and hook behavior.
 */
interface UseApiOptions extends RequestOptions {
  /** If true, the request will not be executed on mount. Use `execute` to trigger it. Defaults to false. */
  lazy?: boolean;
}

/**
 * Result object returned by the useApi hook.
 * @template T - The type of the data expected from the API response.
 */
interface UseApiResult<T> {
  /** The data returned from the API, or null if the request hasn't completed or failed. */
  data: T | null;
  /** Boolean flag indicating if a request is currently in progress. */
  isLoading: boolean;
  /** Error object if the request failed, or null otherwise. */
  error: Error | null;
  /**
   * Manually triggers an API request. This is particularly useful in "lazy" mode.
   * @param overrides - Optional overrides for the request (e.g., method, body).
   * @returns A promise that resolves to the API response data, or null on failure.
   */
  execute: (overrides?: RequestOptions) => Promise<T | null>;
}

async function getAuthToken(): Promise<string | null> {
  const session = await fetchAuthSession();
  return session.tokens?.accessToken?.toString() ?? null;
}

async function apiFetch<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const token = await getAuthToken();
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "";
  const headers: HeadersInit = { "Content-Type": "application/json" };

  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(`${baseUrl}${endpoint}`, {
    method: options.method ?? "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const message = await response.text().catch(() => response.statusText);
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

/**
 * Custom hook to handle API requests with automatic authentication token management.
 * 
 * Supports two main use cases:
 * 1. Eager fetching: The request starts automatically on component mount (default).
 * 2. Lazy fetching: The request only starts when `execute` is called manually (e.g., for form submissions).
 * 
 * @template T - The type of the data expected from the API response.
 * @param endpoint - The API endpoint relative to the base URL (e.g., '/notes/').
 * @param options - Configuration options for the request and hook behavior.
 * @returns An object containing the data, loading state, error, and an execute function.
 * 
 * @example
 * // Eager fetching
 * const { data, isLoading } = useApi<Note[]>('/notes/');
 * 
 * @example
 * // Lazy fetching (e.g., for a POST request)
 * const { execute, isLoading } = useApi<Note>('/notes/', { lazy: true });
 * const handleSave = () => execute({ method: 'POST', body: { title: 'Hello' } });
 */
export function useApi<T>(endpoint: string, options: UseApiOptions = {}): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(!options.lazy);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (overrides: RequestOptions = {}): Promise<T | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await apiFetch<T>(endpoint, { ...options, ...overrides });
        setData(result);
        return result;
      } catch (err) {
        const friendlyMessage = getFriendlyErrorMessage(err);
        const typedError = new Error(friendlyMessage);
        setError(typedError);
        toast.error(friendlyMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [endpoint, options]
  );

  useEffect(() => {
    if (!options.lazy) execute();
  }, []);

  return { data, isLoading, error, execute };
}
