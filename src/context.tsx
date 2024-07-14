'use client'

import { createContext, type Dispatch, type ReactNode, type SetStateAction, useContext, useState } from 'react'

type SearchTermContext = {
  searchTerm: string
  setSearchTerm: Dispatch<SetStateAction<string>>
}

export const SearchTermContext = createContext<SearchTermContext | null>(null)

export function SearchTermContextProvider({ children }: { children: ReactNode }) {
  const [searchTerm, setSearchTerm] = useState('')

  return <SearchTermContext.Provider value={{ searchTerm, setSearchTerm }}>{children}</SearchTermContext.Provider>
}

export function useSearchTermContext() {
  const context = useContext(SearchTermContext)

  if (!context) {
    throw new Error('useSearchTermContext must be used within a SearchTermProvider')
  }

  return context
}
