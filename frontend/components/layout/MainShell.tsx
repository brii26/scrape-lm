"use client"

import { useState, Suspense } from "react"
import Navbar from "./Navbar"
import Sidebar from "./Sidebar"
import { useSearchHistory } from "@/hooks/useSearchHistory"
import { SearchHistoryContext } from "@/context/SearchHistoryContext"
import { SuggestionsProvider } from "@/context/SuggestionsContext"

export default function MainShell({ children, suggestions = [] }: { children: React.ReactNode, suggestions?: string[] }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { history, addEntry } = useSearchHistory()

  return (
    <SuggestionsProvider suggestions={suggestions}>
      <SearchHistoryContext.Provider value={{ addEntry, resetSearch: () => {}, activeTopic: null, searchFromHistory: () => {} }}>
        <Suspense fallback={null}>
          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} history={history} />
        </Suspense>
        <Navbar onBurgerClick={() => setSidebarOpen((prev) => !prev)} />
        <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">{children}</main>
      </SearchHistoryContext.Provider>
    </SuggestionsProvider>
  )
}
