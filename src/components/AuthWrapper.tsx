import { supabase } from '@/lib/supabase'
import { Session } from '@supabase/supabase-js'
import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react'

type AuthContextType = {
  session: Session | null
}

const AuthContext = createContext<AuthContextType>({
  session: null,
})

export const AuthWrapper = ({ children }: PropsWithChildren) => {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  return <AuthContext.Provider value={{ session }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
