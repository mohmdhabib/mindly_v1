import { useState, useEffect, ChangeEvent } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CommunityService, Post, GroupFile, GroupEvent, GroupMember, StudyGroup } from '@/services/community.service';
import { useAuth } from '@/components/AuthWrapper';
import { format, formatDistanceToNow } from 'date-fns';

export function GroupSpace() {
  const { groupId } = useParams<{ groupId: string }>();
  const { session } = useAuth();
  const [group, setGroup] = useState<StudyGroup | null>(null);
  const [activeTab, setActiveTab] = useState('feed');
  const [posts, setPosts] = useState<Post[]>([]);
  const [groupFiles, setGroupFiles] = useState<GroupFile[]>([]);
  const [groupEvents, setGroupEvents] = useState<GroupEvent[]>([]);
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
  const [newPost, setNewPost] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newEvent, setNewEvent] = useState({ title: '', startTime: new Date(), endTime: null as Date | null });
  const [newAvatar, setNewAvatar] = useState<File | null>(null);
  const [newBanner, setNewBanner] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!groupId) return;
    setLoading(true);

    const { data: groupData } = await CommunityService.getStudyGroups().then(res => ({ data: res.data?.find(g => g.id === groupId) }));
    if (groupData) setGroup(groupData);

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
  };

  const handleUpdateImages = async () => {
    if (!groupId || (!newAvatar && !newBanner)) return;
    await CommunityService.updateGroupImages(groupId, newAvatar, newBanner);
    setNewAvatar(null);
    setNewBanner(null);
    fetchData();
  };

  return (
    <div>
      {group?.banner_url && <img src={group.banner_url} alt="Group Banner" className="w-full h-48 object-cover" />}
      <div className="p-8">
        <div className="flex items-center mb-4">
            <Avatar className="w-24 h-24 mr-4">
                <AvatarImage src={group?.avatar_url || ''} />
                <AvatarFallback>{group?.name?.[0].toUpperCase() || 'G'}</AvatarFallback>
            </Avatar>
            <h1 className="text-3xl font-bold">{group?.name}</h1>
        </div>

        <div className="flex border-b mb-4">
            <Button variant={activeTab === 'feed' ? 'default' : 'ghost'} onClick={() => setActiveTab('feed')}>Feed</Button>
            <Button variant={activeTab === 'files' ? 'default' : 'ghost'} onClick={() => setActiveTab('files')}>Files</Button>
            <Button variant={activeTab === 'calendar' ? 'default' : 'ghost'} onClick={() => setActiveTab('calendar')}>Calendar</Button>
            <Button variant={activeTab === 'members' ? 'default' : 'ghost'} onClick={() => setActiveTab('members')}>Members</Button>
            {session?.user.id === group?.creator_id && (
                <Button variant={activeTab === 'settings' ? 'default' : 'ghost'} onClick={() => setActiveTab('settings')}>Settings</Button>
            )}
        </div>

        {activeTab === 'feed' && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Group Feed</h1>
            <Card className="p-4 mb-6">
              <div className="flex items-start space-x-4">
                <Avatar>
                  <AvatarFallback>{session?.user?.email?.[0].toUpperCase() || 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    placeholder="Post to the group..."
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    disabled={!session}
                  />
                  <div className="flex justify-end mt-2">
                    <Button onClick={handleCreatePost} disabled={!newPost.trim() || !session}>
                      Post
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
            {loading ? <p>Loading posts...</p> : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <Card key={post.id} className="p-4">
                    <div className="flex items-start space-x-4">
                      <Avatar>
                        <AvatarFallback>{post.profiles?.username?.[0].toUpperCase() || 'U'}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <p className="font-semibold">{post.profiles?.username || 'Anonymous'}</p>
                          <p className="text-sm text-gray-500">
                            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                          </p>
                        </div>
                        <p>{post.content}</p>
                      </div>
                    </div>
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

        {activeTab === 'calendar' && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Shared Calendar</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <Card>
                  <Calendar
                    mode="multiple"
                    selected={groupEvents.map(e => new Date(e.start_time))}
                    className="p-4"
                  />
                </Card>
              </div>
              <div>
                <Card className="p-4">
                  <h2 className="text-lg font-semibold mb-4">Create a new event</h2>
                  <div className="space-y-4">
                    <Input placeholder="Event title" value={newEvent.title} onChange={(e) => setNewEvent({...newEvent, title: e.target.value})} />
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline">{format(newEvent.startTime, "PPP")}</Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={newEvent.startTime} onSelect={(day) => day && setNewEvent({...newEvent, startTime: day})} />
                      </PopoverContent>
                    </Popover>
                    <Button onClick={handleCreateEvent} disabled={!newEvent.title.trim() || !session}>Create Event</Button>
                  </div>
                </Card>
                <div className="mt-6 space-y-4">
                  <h2 className="text-lg font-semibold">Upcoming Events</h2>
                  {groupEvents.map(event => (
                      <Card key={event.id} className="p-3">
                          <p className="font-semibold">{event.title}</p>
                          <p className="text-sm text-gray-500">{format(new Date(event.start_time), "PPP")}</p>
                      </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
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

        {activeTab === 'settings' && (
            <div>
                <h2 className="text-2xl font-bold mb-4">Group Settings</h2>
                <Card className="p-4">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="avatar-upload">Group Avatar</label>
                            <Input id="avatar-upload" type="file" onChange={(e) => setNewAvatar(e.target.files?.[0] || null)} />
                        </div>
                        <div>
                            <label htmlFor="banner-upload">Group Banner</label>
                            <Input id="banner-upload" type="file" onChange={(e) => setNewBanner(e.target.files?.[0] || null)} />
                        </div>
                        <Button onClick={handleUpdateImages}>Save Changes</Button>
                    </div>
                </Card>
            </div>
        )}
      </div>
    </div>
  );
}
