/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { ReactNode } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { SessionContextProvider } from '@supabase/auth-helpers-react'

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface SupabaseProviderProps {
  children: ReactNode
  initialSession?: any // you can type this better if you want
}

export default function SupabaseProvider({ children, initialSession }: SupabaseProviderProps) {
  return (
    <SessionContextProvider supabaseClient={supabase} initialSession={initialSession}>
      {children}
    </SessionContextProvider>
  )
}
