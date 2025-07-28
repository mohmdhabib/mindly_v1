import { supabase } from '@/lib/supabase'

export const ProfileService = {
  getProfile: async (userId: string) => {
    return await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
  },
  
  updateProfile: async (userId: string, updates: any) => {
    return await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
  },
  
  createProfile: async (profile: any) => {
    return await supabase
      .from('profiles')
      .insert([profile])
  }
}