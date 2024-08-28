import '~/styles/globals.css'

import { ThemeProvider } from '~/components/ThemeProvider'
import { CanNavigateBackContextProvider, SearchTermContextProvider } from '~/context'
import { TRPCReactProvider } from '~/trpc/react'

export const metadata = {
  title: '庫洛姆三週年驚喜',
  description: 'A gift to celebrate the 3rd anniversary debut of 庫洛姆•Kuromu',
  icons: [{ rel: 'icon', url: '/logo.png' }],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <TRPCReactProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <SearchTermContextProvider>
              <CanNavigateBackContextProvider>{children}</CanNavigateBackContextProvider>
            </SearchTermContextProvider>
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  )
}
