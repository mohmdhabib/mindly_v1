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
  votes: number;
  group_id: string | null;
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
      .is('group_id', null)
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

  async getStudyGroups(): Promise<{ data: any[] | null, error: PostgrestError | null }> {
    const { data, error } = await supabase
      .from('study_groups')
      .select(`
        *,
        group_memberships (
          user_id
        ),
        profiles (
          username
        )
      `);

    return { data, error };
  },

  async createStudyGroup(group: { name: string; description: string; subject: string; creator_id: string; avatar_url?: string; banner_url?: string; }): Promise<{ data: any[] | null, error: PostgrestError | null }> {
    const { data, error } = await supabase
      .from('study_groups')
      .insert([group])
      .select();

    return { data, error };
  },

  async updateGroupImages(groupId: string, avatarFile: File | null, bannerFile: File | null): Promise<{ data: any[] | null, error: PostgrestError | null }> {
    let avatar_url = null;
    let banner_url = null;

    if (avatarFile) {
      const { data, error } = await supabase.storage.from('group-avatars').upload(`${groupId}/${avatarFile.name}`, avatarFile, { upsert: true });
      if (error) return { data: null, error };
      avatar_url = supabase.storage.from('group-avatars').getPublicUrl(data.path).data.publicUrl;
    }

    if (bannerFile) {
      const { data, error } = await supabase.storage.from('group-banners').upload(`${groupId}/${bannerFile.name}`, bannerFile, { upsert: true });
      if (error) return { data: null, error };
      banner_url = supabase.storage.from('group-banners').getPublicUrl(data.path).data.publicUrl;
    }

    const updates: { avatar_url?: string; banner_url?: string } = {};
    if (avatar_url) updates.avatar_url = avatar_url;
    if (banner_url) updates.banner_url = banner_url;

    return supabase.from('study_groups').update(updates).eq('id', groupId).select();
  },

  async joinStudyGroup(membership: { group_id: string; user_id: string }): Promise<{ data: any[] | null, error: PostgrestError | null }> {
    const { data, error } = await supabase
      .from('group_memberships')
      .insert([membership])
      .select();

    return { data, error };
  },

  async getForumQuestions(): Promise<{ data: Post[] | null, error: PostgrestError | null }> {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        profiles (
          username,
          avatar_url
        )
      `)
      .eq('post_type', 'question')
      .order('created_at', { ascending: false });

    return { data: data as Post[], error };
  },

  async createForumQuestion(question: { user_id: string; content: string; subject?: string }): Promise<{ data: any[] | null, error: PostgrestError | null }> {
    const { data, error } = await supabase
      .from('posts')
      .insert([
        {
          user_id: question.user_id,
          content: question.content,
          subject: question.subject,
          post_type: 'question',
        },
      ])
      .select();

    return { data, error };
  },

  async voteOnForumQuestion(postId: string, currentVotes: number, direction: 'up' | 'down'): Promise<{ data: any[] | null, error: PostgrestError | null }> {
    const newVotes = direction === 'up' ? currentVotes + 1 : currentVotes - 1;
    const { data, error } = await supabase
      .from('posts')
      .update({ votes: newVotes })
      .eq('id', postId)
      .select();

    return { data, error };
  },

  async likePost(postId: string, userId: string): Promise<{ data: any[] | null, error: PostgrestError | null }> {
    return supabase.from('post_interactions').insert([{ post_id: postId, user_id: userId, interaction_type: 'like' }]).select();
  },

  async unlikePost(postId: string, userId: string): Promise<{ data: any[] | null, error: PostgrestError | null }> {
    return supabase.from('post_interactions').delete().match({ post_id: postId, user_id: userId, interaction_type: 'like' }).select();
  },

  async getCommentsForPost(postId: string): Promise<{ data: Comment[] | null, error: PostgrestError | null }> {
    const { data, error } = await supabase
      .from('post_interactions')
      .select(`
        *,
        profiles (
          username,
          avatar_url
        )
      `)
      .eq('post_id', postId)
      .eq('interaction_type', 'comment')
      .order('created_at', { ascending: true });

    return { data: data as Comment[], error };
  },

  async createComment(comment: { postId: string; userId: string; content: string }): Promise<{ data: any[] | null, error: PostgrestError | null }> {
    return supabase.from('post_interactions').insert([{ post_id: comment.postId, user_id: comment.userId, comment_content: comment.content, interaction_type: 'comment' }]).select();
  },

  async getPostsForGroup(groupId: string): Promise<{ data: Post[] | null, error: PostgrestError | null }> {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        profiles (
          username,
          avatar_url
        )
      `)
      .eq('group_id', groupId)
      .order('created_at', { ascending: false });

    return { data: data as Post[], error };
  },

  async createPostInGroup(post: { userId: string, groupId: string, content: string }): Promise<{ data: any[] | null, error: PostgrestError | null }> {
    return supabase.from('posts').insert([{ user_id: post.userId, group_id: post.groupId, content: post.content, post_type: 'text' }]).select();
  },

  async getGroupFiles(groupId: string): Promise<{ data: GroupFile[] | null, error: PostgrestError | null }> {
    const { data, error } = await supabase
      .from('group_files')
      .select(`
        *,
        profiles (
          username
        )
      `)
      .eq('group_id', groupId)
      .order('created_at', { ascending: false });

    return { data: data as GroupFile[], error };
  },

  async uploadGroupFile(file: File, groupId: string, userId: string): Promise<{ error: Error | null }> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${groupId}/${fileName}`;

    const { error: uploadError } = await supabase.storage.from('group-files').upload(filePath, file);

    if (uploadError) {
      return { error: uploadError };
    }

    const { data: { publicUrl } } = supabase.storage.from('group-files').getPublicUrl(filePath);

    const { error: dbError } = await supabase
      .from('group_files')
      .insert([{ group_id: groupId, user_id: userId, file_name: file.name, file_url: publicUrl }]);

    return { error: dbError };
  },

  async getGroupEvents(groupId: string): Promise<{ data: GroupEvent[] | null, error: PostgrestError | null }> {
    const { data, error } = await supabase
      .from('group_events')
      .select(`
        *,
        profiles (
          username
        )
      `)
      .eq('group_id', groupId)
      .order('start_time', { ascending: true });

    return { data: data as GroupEvent[], error };
  },

  async createGroupEvent(event: { groupId: string; userId: string; title: string; startTime: Date; endTime: Date | null }): Promise<{ data: any[] | null, error: PostgrestError | null }> {
    return supabase.from('group_events').insert([{
      group_id: event.groupId,
      user_id: event.userId,
      title: event.title,
      start_time: event.startTime.toISOString(),
      end_time: event.endTime?.toISOString()
    }]).select();
  },

  async getGroupMembers(groupId: string): Promise<{ data: GroupMember[] | null, error: PostgrestError | null }> {
    const { data, error } = await supabase
      .from('group_memberships')
      .select(`
        user_id,
        profiles (
          username,
          avatar_url
        )
      `)
      .eq('group_id', groupId);

    return { data: data as GroupMember[], error };
  }
};

export type StudyGroup = {
  id: string;
  name: string;
  description: string;
  subject: string;
  creator_id: string;
  max_members: number;
  is_private: boolean;
  avatar_url: string | null;
  banner_url: string | null;
  join_code: string | null;
  created_at: string;
  group_memberships: { user_id: string }[];
  profiles: { username: string } | null;
};

export type Comment = {
    id: string;
    post_id: string;
    user_id: string;
    comment_content: string;
    created_at: string;
    profiles: {
        username: string;
        avatar_url: string;
    } | null;
};

export type GroupFile = {
    id: string;
    group_id: string;
    user_id: string;
    file_name: string;
    file_url: string;
    created_at: string;
    profiles: {
        username: string;
    } | null;
};

export type GroupMember = {
    user_id: string;
    profiles: {
        username: string;
        avatar_url: string;
    } | null;
};

export type GroupEvent = {
    id: string;
    group_id: string;
    user_id: string;
    title: string;
    start_time: string;
    end_time: string | null;
    created_at: string;
    profiles: {
        username: string;
    } | null;
};
