"use client"

import { createContext, useContext } from "react"

const SuggestionsContext = createContext<string[]>([])

export function SuggestionsProvider({ suggestions, children }: { suggestions: string[], children: React.ReactNode }) {
  return <SuggestionsContext.Provider value={suggestions}>{children}</SuggestionsContext.Provider>
}

export function useSuggestions() {
  return useContext(SuggestionsContext)
}
