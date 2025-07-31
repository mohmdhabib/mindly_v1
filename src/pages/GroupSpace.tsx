import { useState, useEffect, ChangeEvent } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CommunityService, Post, GroupFile } from '@/services/community.service';
import { useAuth } from '@/components/AuthWrapper';
import { formatDistanceToNow } from 'date-fns';

export function GroupSpace() {
  const { groupId } = useParams<{ groupId: string }>();
  const { session } = useAuth();
  const [activeTab, setActiveTab] = useState('feed');
  const [posts, setPosts] = useState<Post[]>([]);
  const [groupFiles, setGroupFiles] = useState<GroupFile[]>([]);
  const [newPost, setNewPost] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!groupId) return;
    setLoading(true);
    if (activeTab === 'feed') {
      const { data, error } = await CommunityService.getPostsForGroup(groupId);
      if (data) setPosts(data);
      if (error) console.error("Error fetching posts:", error);
    } else if (activeTab === 'files') {
      const { data, error } = await CommunityService.getGroupFiles(groupId);
      if (data) setGroupFiles(data);
      if (error) console.error("Error fetching files:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [groupId, activeTab]);

  const handleCreatePost = async () => {
    if (!newPost.trim() || !session || !groupId) return;
    const { error } = await CommunityService.createPostInGroup({
      userId: session.user.id,
      groupId,
      content: newPost,
    });
    if (!error) {
      setNewPost('');
      fetchData();
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile || !session || !groupId) return;
    const { error } = await CommunityService.uploadGroupFile(selectedFile, groupId, session.user.id);
    if (!error) {
      setSelectedFile(null);
      fetchData();
    } else {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div className="p-8">
      <div className="flex border-b mb-4">
        <Button variant={activeTab === 'feed' ? 'default' : 'ghost'} onClick={() => setActiveTab('feed')}>Feed</Button>
        <Button variant={activeTab === 'files' ? 'default' : 'ghost'} onClick={() => setActiveTab('files')}>Files</Button>
      </div>

      {activeTab === 'feed' && (
        <div>
          <h1 className="text-2xl font-bold mb-4">Group Feed</h1>
          <Card className="p-4 mb-6">
            {/* ... create post form ... */}
          </Card>
          {loading ? <p>Loading posts...</p> : (
            <div className="space-y-4">
              {posts.map((post) => (
                <Card key={post.id} className="p-4">
                  {/* ... post display ... */}
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'files' && (
        <div>
          <h1 className="text-2xl font-bold mb-4">Shared Files</h1>
          <Card className="p-4 mb-6">
            <h2 className="text-lg font-semibold mb-2">Upload a new file</h2>
            <div className="flex items-center space-x-2">
              <Input type="file" onChange={handleFileChange} />
              <Button onClick={handleFileUpload} disabled={!selectedFile || !session}>Upload</Button>
            </div>
          </Card>
          {loading ? <p>Loading files...</p> : (
            <div className="space-y-2">
              {groupFiles.map((file) => (
                <Card key={file.id} className="p-3 flex justify-between items-center">
                  <div>
                    <a href={file.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {file.file_name}
                    </a>
                    <p className="text-sm text-gray-500">
                      Uploaded by {file.profiles?.username || 'Anonymous'} on {new Date(file.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
