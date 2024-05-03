// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'

import { ColorSchemeScript, Container } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { Inter } from 'next/font/google'

import { Navbar } from '@/app/components/Navbar'

import './globals.css'
import Providers from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'The Wallet App',
  description: 'A web3 wallet app powered by Circle'
}

export default function RootLayout ({ children }) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body className={inter.className} style={{ height: '100vh' }}>
        <Providers>
          <Container size="50rem" px="s" h="calc(100% - 80px)">
            <Navbar />
            {children}
          </Container>
          <Notifications />
        </Providers>
      </body>
    </html>
  )
}
