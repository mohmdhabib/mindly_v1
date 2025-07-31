import { supabase } from '@/lib/supabase';
import { PostgrestError } from '@supabase/supabase-js';

export type Post = {
  id: string;
  user_id: string;
  content: string;
  subject: string | null;
  post_type: 'text' | 'question' | 'resource' | 'achievement';
  likes_count: number;
  comments_count: number;
  is_pinned: boolean;
  created_at: string;
  profiles: {
    username: string;
    avatar_url: string;
  } | null;
};

export const CommunityService = {
  async getPosts(): Promise<{ data: Post[] | null, error: PostgrestError | null }> {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        profiles (
          username,
          avatar_url
        )
      `)
      .order('created_at', { ascending: false });

    return { data: data as Post[], error };
  },

  async createPost(post: { user_id: string; content: string; subject?: string }): Promise<{ data: any[] | null, error: PostgrestError | null }> {
    const { data, error } = await supabase
      .from('posts')
      .insert([
        {
          user_id: post.user_id,
          content: post.content,
          subject: post.subject,
        },
      ])
      .select();

    return { data, error };
  },
};
