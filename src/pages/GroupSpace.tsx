import { useState, useEffect, ChangeEvent } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CommunityService, Post, GroupFile, GroupEvent, GroupMember } from '@/services/community.service';
import { useAuth } from '@/components/AuthWrapper';
import { format, formatDistanceToNow } from 'date-fns';

export function GroupSpace() {
  const { groupId } = useParams<{ groupId: string }>();
  const { session } = useAuth();
  const [activeTab, setActiveTab] = useState('feed');
  const [posts, setPosts] = useState<Post[]>([]);
  const [groupFiles, setGroupFiles] = useState<GroupFile[]>([]);
  const [groupEvents, setGroupEvents] = useState<GroupEvent[]>([]);
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
  const [newPost, setNewPost] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newEvent, setNewEvent] = useState({ title: '', startTime: new Date(), endTime: null as Date | null });
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
    } else if (activeTab === 'calendar') {
        const { data, error } = await CommunityService.getGroupEvents(groupId);
        if (data) setGroupEvents(data);
        if (error) console.error("Error fetching events:", error);
    } else if (activeTab === 'members') {
        const { data, error } = await CommunityService.getGroupMembers(groupId);
        if (data) setGroupMembers(data);
        if (error) console.error("Error fetching members:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [groupId, activeTab]);

  const handleCreatePost = async () => {
    if (!newPost.trim() || !session || !groupId) return;
    const { error } = await CommunityService.createPostInGroup({ userId: session.user.id, groupId, content: newPost });
    if (!error) {
      setNewPost('');
      fetchData();
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setSelectedFile(e.target.files[0]);
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

  const handleCreateEvent = async () => {
    if (!newEvent.title.trim() || !session || !groupId) return;
    const { error } = await CommunityService.createGroupEvent({ ...newEvent, groupId, userId: session.user.id });
    if (!error) {
        setNewEvent({ title: '', startTime: new Date(), endTime: null });
        fetchData();
    }
  }

  return (
    <div className="p-8">
      <div className="flex border-b mb-4">
        <Button variant={activeTab === 'feed' ? 'default' : 'ghost'} onClick={() => setActiveTab('feed')}>Feed</Button>
        <Button variant={activeTab === 'files' ? 'default' : 'ghost'} onClick={() => setActiveTab('files')}>Files</Button>
        <Button variant={activeTab === 'calendar' ? 'default' : 'ghost'} onClick={() => setActiveTab('calendar')}>Calendar</Button>
        <Button variant={activeTab === 'members' ? 'default' : 'ghost'} onClick={() => setActiveTab('members')}>Members</Button>
      </div>

      {activeTab === 'feed' && (
        // ... feed content ...
      )}

      {activeTab === 'files' && (
        // ... files content ...
      )}

      {activeTab === 'calendar' && (
        // ... calendar content ...
      )}

      {activeTab === 'members' && (
        <div>
          <h1 className="text-2xl font-bold mb-4">Group Members</h1>
          {loading ? <p>Loading members...</p> : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {groupMembers.map((member) => (
                <Card key={member.user_id} className="p-4 flex flex-col items-center">
                  <Avatar className="w-16 h-16 mb-2">
                    <AvatarFallback>{member.profiles?.username?.[0].toUpperCase() || 'U'}</AvatarFallback>
                  </Avatar>
                  <p className="font-semibold">{member.profiles?.username || 'Anonymous'}</p>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
