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
    // Fetch group info separately
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

  const handleUpdateImages = async () => {
    if (!groupId || (!newAvatar && !newBanner)) return;
    await CommunityService.updateGroupImages(groupId, newAvatar, newBanner);
    setNewAvatar(null);
    setNewBanner(null);
    fetchData(); // Refetch to get new image URLs
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

            {/* Other tabs content */}
        </div>
    </div>
  );
}
