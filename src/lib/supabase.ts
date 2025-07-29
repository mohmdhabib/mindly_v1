import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const uploadFile = async (file: File) => {
  const { data, error } = await supabase.storage
    .from('uploads')
    .upload(file.name, file);
  if (error) {
    console.error('Error uploading file:', error);
    return null;
  }
  return data;
};
