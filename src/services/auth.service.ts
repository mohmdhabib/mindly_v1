import { supabase } from '@/lib/supabase'

export const AuthService = {
  signIn: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password })
  },
  
  signUp: async (email: string, password: string) => {
    return await supabase.auth.signUp({ email, password })
  },
  
  signOut: async () => {
    return await supabase.auth.signOut()
  },
  
  getCurrentSession: async () => {
    return await supabase.auth.getSession()
  },
  
  resetPassword: async (email: string) => {
    return await supabase.auth.resetPasswordForEmail(email)
  },
  
  updatePassword: async (newPassword: string) => {
    return await supabase.auth.updateUser({ password: newPassword })
  }
}