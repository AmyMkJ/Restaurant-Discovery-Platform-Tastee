'use client'

import { FavoritesProvider } from '@/lib/context/FavoritesContext'

export default function Providers({ children }: { children: React.ReactNode }) {
  return <FavoritesProvider>{children}</FavoritesProvider>
}

