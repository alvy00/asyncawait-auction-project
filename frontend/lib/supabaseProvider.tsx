/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

export default function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  )

  return <>{children}</>
}
