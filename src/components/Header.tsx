'use client'

import { Menu } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ModeToggle } from '~/components/ModeToggle'
import { Button } from '~/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '~/components/ui/sheet'
import { cn } from '~/lib/utils'

const links = [
  { name: '留言紀錄', href: '/' },
  { name: '直播紀錄', href: '/video' },
]

export function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:px-6">
      <nav className="hidden w-full flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link href="#" className="flex items-center gap-2 text-lg font-semibold md:text-base">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="" className="size-6" />
          <span className="sr-only">K3</span>
        </Link>

        {links.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            prefetch={false}
            className={cn(
              pathname === link.href ? 'text-foreground' : 'text-muted-foreground',
              'transition-colors hover:text-foreground',
            )}
          >
            {link.name}
          </Link>
        ))}

        <div className="ml-auto">
          <ModeToggle></ModeToggle>
        </div>
      </nav>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="size-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right">
          <nav className="flex h-full flex-col gap-6 text-lg font-medium">
            <Link href="#" className="flex items-center gap-2 text-lg font-semibold">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="" className="size-6" />
              <span className="sr-only">K3</span>
            </Link>

            {links.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                prefetch={false}
                className={cn(
                  pathname === link.href ? 'text-foreground' : 'text-muted-foreground',
                  'transition-colors hover:text-foreground',
                )}
              >
                {link.name}
              </Link>
            ))}

            <div className="mt-auto">
              <ModeToggle></ModeToggle>
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  )
}
