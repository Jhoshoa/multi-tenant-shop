import React, { useEffect } from 'react'
import { useRouter, useSegments, useNavigationContainerRef } from 'expo-router'
import { supabase } from '../src/lib/supabase'
import { useAuth } from '../src/hooks/useAuth'

interface Props {
  children: React.ReactNode
}

export const RootNavigationGuard: React.FC<Props> = ({ children }) => {
  const { isAuthenticated, tenantStatus, syncOAuth } = useAuth()
  const router = useRouter()
  const segments = useSegments()
  const navigationRef = useNavigationContainerRef()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const provider = session?.user?.app_metadata?.provider
        const isOAuth = provider && provider !== 'email' && provider !== 'phone'
        if (event === 'SIGNED_IN' && session && !isAuthenticated && isOAuth) {
          await syncOAuth(session.access_token, {
            full_name: session.user.user_metadata?.full_name,
          })
        }
      }
    )
    return () => subscription.unsubscribe()
  }, [isAuthenticated])

  useEffect(() => {
    if (!navigationRef.isReady()) return

    const inAuth = segments[0] === '(auth)'
    const inPending = segments[0] === '(pending)'
    const inDashboard = segments[0] === '(dashboard)'

    if (!isAuthenticated && !inAuth) {
      router.replace('/(auth)/login')
    } else if (isAuthenticated && tenantStatus === 'pending' && !inPending) {
      router.replace('/(pending)')
    } else if (isAuthenticated && tenantStatus === 'active' && !inDashboard) {
      router.replace('/(dashboard)')
    } else if (isAuthenticated && inAuth) {
      router.replace('/(dashboard)')
    }
  }, [navigationRef.isReady(), isAuthenticated, tenantStatus])

  return <>{children}</>
}
