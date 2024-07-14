'use client'

import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '~/components/ui/button'
import { useSearchTermContext } from '~/context'

export function NavigateBack() {
  const { searchTerm } = useSearchTermContext()

  return (
    <Button asChild size="icon">
      <Link
        href={{
          pathname: '/',
          query: searchTerm ? { query: searchTerm } : undefined,
        }}
        prefetch={false}
      >
        <ChevronLeft className="size-4" />
      </Link>
    </Button>
  )
}
