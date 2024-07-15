'use client'

import { usePathname } from 'next/navigation'
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

export const CanNavigateBackContext = createContext(false)

/**
 * credits: https://github.com/uidotdev/usehooks/blob/90fbbb4cc085e74e50c36a62a5759a40c62bb98e/index.js#L1017-L1027
 *
 * @see https://usehooks.com/useprevious
 */
function usePrevious<T>(value: T) {
  const [current, setCurrent] = useState<T>(value)
  const [previous, setPrevious] = useState<T | null>(null)

  if (value !== current) {
    setPrevious(current)
    setCurrent(value)
  }

  return previous
}

export function CanNavigateBackContextProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const previousPathname = usePrevious(pathname)
  const canNavigateBack = previousPathname !== null

  return <CanNavigateBackContext.Provider value={canNavigateBack}>{children}</CanNavigateBackContext.Provider>
}

export function useCanNavigateBackContext() {
  return useContext(CanNavigateBackContext)
}
