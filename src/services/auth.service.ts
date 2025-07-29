import { supabase } from '@/lib/supabase'
import { ProfileService } from './profile.service'

export const AuthService = {
  signIn: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password })
  },
  
  signUp: async (email: string, password: string, username?: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    
    if (data.user && !error) {
      // Create a profile for the new user
      const newProfile = {
        id: data.user.id,
        username: username || email.split('@')[0],
        full_name: '',
        avatar_url: '',
        learning_level: 'beginner',
        total_xp: 0,
        current_level: 1,
        streak_count: 0,
        streak_freeze_count: 3,
        last_active_date: new Date().toISOString().split('T')[0],
        learning_preferences: {},
      }
      
      await ProfileService.createProfile(newProfile)
    }
    
    return { data, error }
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