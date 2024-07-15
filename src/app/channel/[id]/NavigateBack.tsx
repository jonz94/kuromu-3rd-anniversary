'use client'

import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '~/components/ui/button'
import { useCanNavigateBackContext, useSearchTermContext } from '~/context'

export function NavigateBack() {
  const { searchTerm } = useSearchTermContext()
  const canNavigateBack = useCanNavigateBackContext()
  const router = useRouter()

  if (canNavigateBack) {
    return (
      <Button asChild size="icon">
        <Link
          href={{
            pathname: '/',
            query: searchTerm ? { query: searchTerm } : undefined,
          }}
          prefetch={false}
          onClick={(e) => {
            e.preventDefault()
            router.back()
          }}
        >
          <ChevronLeft className="size-4" />
        </Link>
      </Button>
    )
  }

  return (
    <Button asChild size="icon">
      <Link href="/" prefetch={false}>
        <ChevronLeft className="size-4" />
      </Link>
    </Button>
  )
}
