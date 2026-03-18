"use client";

import React, { createContext, useContext, ReactNode, useMemo } from "react";
import { Category } from "@/types/category";
import { useApi } from "@/hooks/useApi";

/**
 * Shape of the context providing category data and management across the application.
 */
interface CategoriesContextType {
  /** The list of categories fetched from the API. Defaults to an empty array. */
  categories: Category[];
  /** Loading state flag indicating if the category fetch is in progress. */
  isLoading: boolean;
  /** 
   * Helper that maps a technical category key (e.g. 'brand-peach') to its 
   * human-readable label (e.g. 'Random Thoughts'). 
   */
  getCategoryLabel: (value: string) => string;
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

/**
 * Provider component that manages central category fetching and exposes it through context.
 * Wrap the application root with this to allow all child components to access category metadata
 * without manual prop drilling.
 *
 * @param {Object} props - Component properties.
 * @param {ReactNode} props.children - Child components to be wrapped.
 * @returns {JSX.Element} The categories provider component.
 */
export function CategoriesProvider({ children }: { children: ReactNode }) {
  const { data: rawCategories, isLoading } = useApi<Category[]>("/api/categories/");
  const categories = rawCategories ?? [];

  /** 
   * Performance optimization: Create a lookup map once instead of searching the 
   * categories array repeatedly in getCategoryLabel.
   */
  const labelsMap = useMemo(() => {
    const map: Record<string, string> = {};
    categories.forEach((cat) => {
      map[cat.value] = cat.label;
    });
    return map;
  }, [categories]);

  /**
   * Retrieves the human-friendly label for a given category value.
   * If not found, falls back to a formatted version of the input value.
   */
  const getCategoryLabel = (value: string) => {
    return labelsMap[value] || value.replace("brand-", "");
  };

  const value = useMemo(
    () => ({
      categories,
      isLoading,
      getCategoryLabel,
    }),
    [categories, isLoading]
  );

  return (
    <CategoriesContext.Provider value={value}>
      {children}
    </CategoriesContext.Provider>
  );
}

/**
 * Custom hook to conveniently access category data from the closest CategoriesProvider.
 * Throws an error if used outside of its provider to ensure early detection of misconfigurations.
 *
 * @returns {CategoriesContextType} The current category global state and helpers.
 * @throws {Error} When used without a surrounding CategoriesProvider.
 */
export function useCategories() {
  const context = useContext(CategoriesContext);
  if (context === undefined) {
    throw new Error("useCategories must be used within a CategoriesProvider");
  }
  return context;
}
