"use client"

import { createContext, useContext } from "react"

interface SearchHistoryContextValue {
  addEntry: (topic: string, q: string) => void
  resetSearch: () => void
  activeTopic: string | null
  searchFromHistory: (q: string) => void
}

export const SearchHistoryContext = createContext<SearchHistoryContextValue>({
  addEntry: () => {},
  resetSearch: () => {},
  activeTopic: null,
  searchFromHistory: () => {},
})

export function useSearchHistoryContext() {
  return useContext(SearchHistoryContext)
}

export { SearchHistoryContext as default }
