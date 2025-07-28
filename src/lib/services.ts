import { supabase } from "./supabase";

// MOCK DATA
const mockPosts = [
  {
    id: 1,
    title: "How to improve my prompting skills?",
    author: "user123",
    content: "I'm looking for tips and tricks to improve my prompting skills. Any advice?",
    upvotes: 45,
    replies: [],
  },
  {
    id: 2,
    title: "Best way to learn about RAG?",
    author: "user456",
    content: "What are the best resources to learn about Retrieval-Augmented Generation?",
    upvotes: 32,
    replies: [],
  },
];

const mockUsers = [
  { name: "@user789", points: 1250 },
  { name: "@user123", points: 1100 },
  { name: "@user456", points: 950 },
];

const mockUserProfile = {
  name: "John Doe",
  email: "john.doe@example.com",
  avatar: "https://github.com/shadcn.png",
  posts: 12,
  replies: 45,
  upvotes: 128,
};

// DISCUSSION FORUM
export const getPosts = async () => {
  // const { data, error } = await supabase.from("posts").select("*");
  // if (error) throw error;
  // return data;
  return Promise.resolve(mockPosts);
};

// export const votePost = async (postId, type) => {
//   // const { data, error } = await supabase
//   //   .from("posts")
//   //   .update({ upvotes: upvotes + (type === "up" ? 1 : -1) })
//   //   .eq("id", postId);
//   // if (error) throw error;
//   // return data;
//   return Promise.resolve();
// };

// LEADERBOARD
export const getLeaderboard = async () => {
  // const { data, error } = await supabase.from("users").select("*").order("points", { ascending: false });
  // if (error) throw error;
  // return data;
  return Promise.resolve(mockUsers);
};

// USER PROFILE
export const getUserProfile = async () => {
  // const { data, error } = await supabase.from("profiles").select("*").single();
  // if (error) throw error;
  // return data;
  return Promise.resolve(mockUserProfile);
};

// CONVERSATIONS
export const getConversations = async () => {
    const { data, error } = await supabase
        .from('conversations')
        .select('id, title, updated_at')
        .order('updated_at', { ascending: false });

    if (error) {
        console.error('Error fetching conversations:', error);
        return [];
    }
    return data;
}

export const getConversation = async (conversationId: string) => {
    const { data, error } = await supabase
        .from('conversations')
        .select('messages, sme_type')
        .eq('id', conversationId)
        .single();

    if (error) {
        console.error('Error fetching conversation:', error);
        return null;
    }
    return data;
}

export const createConversation = async (sme_type: string, title: string, messages: any[]) => {
    const { data, error } = await supabase
        .from('conversations')
        .insert({
            sme_type,
            title,
            messages,
            user_id: (await supabase.auth.getUser()).data.user?.id,
        })
        .select('id')
        .single();

    if (error) {
        console.error('Error creating conversation:', error);
        return null;
    }
    return data;
}

export const updateConversation = async (conversationId: string, messages: any[]) => {
    const { data, error } = await supabase
        .from('conversations')
        .update({ messages, updated_at: new Date().toISOString() })
        .eq('id', conversationId);

    if (error) {
        console.error('Error updating conversation:', error);
    }
    return data;
}
