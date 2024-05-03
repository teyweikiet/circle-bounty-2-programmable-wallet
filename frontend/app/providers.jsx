'use client'

import { useState } from 'react'
import { MantineProvider } from '@mantine/core'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './hooks/auth'
import { CircleProvider } from './hooks/circle'

export default function Providers ({ children }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // With SSR, we usually want to set some default staleTime
            // above 0 to avoid refetching immediately on the client
            staleTime: 60 * 60 * 1000
          }
        }
      })
  )
  return (
    <MantineProvider >
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CircleProvider>
            {children}
          </CircleProvider>
        </AuthProvider>
      </QueryClientProvider>
    </MantineProvider>
  )
}
