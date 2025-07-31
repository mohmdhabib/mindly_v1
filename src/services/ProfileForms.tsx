import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, User, Mail, Calendar, Target, Bell, Shield, Save, Camera, Loader2, Upload, MapPin, Globe, Twitter, Linkedin } from "lucide-react";
import { useAuth } from "@/components/AuthWrapper";
import { ProfileService } from "@/services/profile.service";
import { supabase } from "@/lib/supabase";

export function ProfileForms({ onBack, initialData }) {
  const { session } = useAuth();
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [profileData, setProfileData] = useState({ 
    full_name: "", 
    username: "", 
    email: "", 
    avatar_url: "", 
    learning_level: "beginner"
  });
  const [additionalInfo, setAdditionalInfo] = useState({
    daily_goal_hours: 2, 
    preferred_learning_style: "visual", 
    bio: "", 
    location: "", 
    website: "", 
    twitter_handle: "", 
    linkedin_handle: ""
  });
  const [notifications, setNotifications] = useState({ 
    email_notifications: true, 
    push_notifications: true, 
    sms_notifications: false, 
    marketing_notifications: false, 
    achievement_notifications: true, 
    reminder_notifications: true 
  });
  const [privacy, setPrivacy] = useState({ 
    profile_visibility: "public", 
    show_progress: true, 
    show_achievements: true, 
    show_activity: false 
  });

  // Fetch profile data on mount
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!session?.user?.id) return;
      setIsLoading(true);
      setSaveError(null);
      try {
        const { data, error } = await ProfileService.getOrCreateProfile(session.user.id);
        if (error) { 
          console.error("Error fetching profile:", error); 
          setSaveError("Failed to load profile data"); 
          return; 
        }
        if (data) {
          // Set basic profile data
          setProfileData({ 
            full_name: data.full_name || "", 
            username: data.username || "", 
            email: session.user.email || "", 
            avatar_url: data.avatar_url || "", 
            learning_level: data.learning_level || "beginner"
          });
          
          // Extract additional info from learning_preferences
          const prefs = data.learning_preferences || {};
          setAdditionalInfo({
            daily_goal_hours: prefs.daily_goal_hours || 2,
            preferred_learning_style: prefs.preferred_learning_style || "visual",
            bio: prefs.bio || "",
            location: prefs.location || "",
            website: prefs.website || "",
            twitter_handle: prefs.twitter_handle || "",
            linkedin_handle: prefs.linkedin_handle || ""
          });
          
          setNotifications({ 
            email_notifications: prefs.email_notifications !== false, 
            push_notifications: prefs.push_notifications !== false, 
            sms_notifications: prefs.sms_notifications === true, 
            marketing_notifications: prefs.marketing_notifications === true, 
            achievement_notifications: prefs.achievement_notifications !== false, 
            reminder_notifications: prefs.reminder_notifications !== false 
          });
          
          setPrivacy({ 
            profile_visibility: prefs.profile_visibility || "public", 
            show_progress: prefs.show_progress !== false, 
            show_achievements: prefs.show_achievements !== false, 
            show_activity: prefs.show_activity === true 
          });
        }
      } catch (error) { 
        console.error("Exception fetching profile:", error); 
        setSaveError("An error occurred while loading profile data"); 
      } finally { 
        setIsLoading(false); 
      }
    };
    fetchProfileData();
  }, [session?.user?.id]);

  // Handle form input changes
  const handleInputChange = (field, value) => { 
    setProfileData(prev => ({ ...prev, [field]: value })); 
    setSaveError(null); 
  };
  
  const handleAdditionalInfoChange = (field, value) => { 
    setAdditionalInfo(prev => ({ ...prev, [field]: value })); 
    setSaveError(null); 
  };
  
  const handleNotificationChange = (key, value) => setNotifications(prev => ({ ...prev, [key]: value }));
  const handlePrivacyChange = (key, value) => setPrivacy(prev => ({ ...prev, [key]: value }));

  // Handle image upload
  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !session?.user?.id) return;

    if (!file.type.startsWith("image/")) {
      setSaveError("Please select a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setSaveError("Image size must be less than 5MB");
      return;
    }

    setIsUploadingImage(true);
    setSaveError(null);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${session.user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from("habibi")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        setSaveError("Failed to upload image. Please try again.");
        return;
      }

      const { data: urlData } = supabase.storage.from("habibi").getPublicUrl(filePath);
      if (urlData?.publicUrl) handleInputChange("avatar_url", urlData.publicUrl);
    } catch (error) {
      console.error("Exception uploading image:", error);
      setSaveError("An error occurred while uploading the image");
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Save profile changes
  const handleSaveProfile = async () => {
    if (!session?.user?.id) { 
      setSaveError("User session not found. Please login again."); 
      return; 
    }
    if (!profileData.full_name.trim()) { 
      setSaveError("Full name is required"); 
      return; 
    }
    if (!profileData.username.trim()) { 
      setSaveError("Username is required"); 
      return; 
    }
    
    setIsSaving(true);
    setSaveError(null);
    
    try {
      // Prepare update data according to schema
      const updateData = { 
        id: session.user.id, 
        full_name: profileData.full_name.trim(), 
        username: profileData.username.trim(), 
        avatar_url: profileData.avatar_url, 
        learning_level: profileData.learning_level,
        learning_preferences: { 
          ...notifications, 
          ...privacy, 
          ...additionalInfo,
          preferred_learning_style: additionalInfo.preferred_learning_style, 
          daily_goal_hours: Number(additionalInfo.daily_goal_hours) 
        }, 
        updated_at: new Date().toISOString() 
      };
      
      console.log("Saving profile data:", updateData);
      
      const { data, error } = await supabase
        .from("profiles")
        .upsert(updateData, { onConflict: "id", ignoreDuplicates: false })
        .select()
        .single();
      
      if (error) { 
        console.error("Supabase error:", error); 
        setSaveError(`Failed to save profile: ${error.message}`); 
        return; 
      }
      
      console.log("Profile saved successfully:", data);
      setSaveError(null);
      alert("Profile updated successfully!");
      setTimeout(() => { if (onBack) onBack(); }, 1000);
    } catch (error) { 
      console.error("Exception updating profile:", error); 
      setSaveError("An unexpected error occurred while saving your profile."); 
    } finally { 
      setIsSaving(false); 
    }
  };

  const getInitials = (name) => name ? name.split(" ").map(part => part[0]).join("").toUpperCase().substring(0, 2) : "U";

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="text-center p-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-3xl shadow-xl border border-white/20">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-white" />
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">Loading your profile...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={onBack} 
            className="mb-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-white/20 hover:bg-white dark:hover:bg-gray-700 transition-all duration-200 shadow-lg"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Profile
          </Button>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4 shadow-lg">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Edit Profile
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">Update your personal information and preferences</p>
          </div>
        </div>

        {/* Error Message */}
        {saveError && (
          <div className="mb-6 p-4 bg-red-50/80 dark:bg-red-900/20 backdrop-blur-sm border border-red-200/50 dark:border-red-800/50 rounded-2xl shadow-lg">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-sm font-bold">!</span>
              </div>
              <p className="text-red-700 dark:text-red-300 font-medium">{saveError}</p>
            </div>
          </div>
        )}

        <div className="space-y-8">
          {/* Profile Information */}
          <Card className="p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl border-0 rounded-3xl">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-3">
                <User className="w-5 h-5 text-white" />
              </div>
              Profile Information
            </h2>
            
            {/* Avatar Section */}
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-8 mb-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-700/50 dark:to-gray-600/50 rounded-2xl">
              <div className="relative group">
                <Avatar className="w-32 h-32 shadow-2xl border-4 border-white dark:border-gray-600">
                  {profileData.avatar_url ? 
                    <AvatarImage src={profileData.avatar_url} alt="Profile" className="object-cover" /> : 
                    null
                  }
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-3xl font-bold">
                    {getInitials(profileData.full_name || profileData.username)}
                  </AvatarFallback>
                </Avatar>
                <Button 
                  size="sm" 
                  className="absolute -bottom-2 -right-2 rounded-full w-12 h-12 p-0 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg group-hover:scale-110 transition-all duration-200" 
                  onClick={() => fileInputRef.current?.click()} 
                  disabled={isUploadingImage}
                >
                  {isUploadingImage ? 
                    <Loader2 className="w-5 h-5 animate-spin" /> : 
                    <Camera className="w-5 h-5" />
                  }
                </Button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Profile Picture</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">Upload a new profile picture (max 5MB)</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => fileInputRef.current?.click()} 
                  disabled={isUploadingImage}
                  className="bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border-purple-200 hover:border-purple-300 hover:bg-purple-50 dark:hover:bg-gray-600"
                >
                  {isUploadingImage ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Choose File
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <User className="w-4 h-4 mr-2 text-purple-500" />
                  Full Name *
                </label>
                <input 
                  type="text" 
                  value={profileData.full_name} 
                  onChange={(e) => handleInputChange("full_name", e.target.value)} 
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm" 
                  placeholder="Enter your full name" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <User className="w-4 h-4 mr-2 text-purple-500" />
                  Username *
                </label>
                <input 
                  type="text" 
                  value={profileData.username} 
                  onChange={(e) => handleInputChange("username", e.target.value)} 
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm" 
                  placeholder="Choose a username" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <Mail className="w-4 h-4 mr-2 text-gray-400" />
                  Email Address
                </label>
                <input 
                  type="email" 
                  value={profileData.email} 
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-100/80 dark:bg-gray-600/50 text-gray-500 dark:text-gray-400 backdrop-blur-sm" 
                  disabled 
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">Email cannot be changed</p>
              </div>
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <MapPin className="w-4 h-4 mr-2 text-green-500" />
                  Location
                </label>
                <input 
                  type="text" 
                  value={additionalInfo.location} 
                  onChange={(e) => handleAdditionalInfoChange("location", e.target.value)} 
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm" 
                  placeholder="City, Country" 
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <Globe className="w-4 h-4 mr-2 text-blue-500" />
                  Website
                </label>
                <input 
                  type="url" 
                  value={additionalInfo.website} 
                  onChange={(e) => handleAdditionalInfoChange("website", e.target.value)} 
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm" 
                  placeholder="https://yourwebsite.com" 
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <Twitter className="w-4 h-4 mr-2 text-blue-400" />
                  Twitter Handle
                </label>
                <input 
                  type="text" 
                  value={additionalInfo.twitter_handle} 
                  onChange={(e) => handleAdditionalInfoChange("twitter_handle", e.target.value)} 
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm" 
                  placeholder="@username" 
                />
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <User className="w-4 h-4 mr-2 text-purple-500" />
                Bio
              </label>
              <textarea 
                value={additionalInfo.bio} 
                onChange={(e) => handleAdditionalInfoChange("bio", e.target.value)} 
                rows={4} 
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm resize-none" 
                placeholder="Tell us a bit about yourself..." 
              />
            </div>
          </Card>

          {/* Learning Preferences */}
          <Card className="p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl border-0 rounded-3xl">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mr-3">
                <Target className="w-5 h-5 text-white" />
              </div>
              Learning Preferences
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Learning Level</label>
                <select 
                  value={profileData.learning_level} 
                  onChange={(e) => handleInputChange("learning_level", e.target.value)} 
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                >
                  <option value="beginner">🌱 Beginner</option>
                  <option value="intermediate">🌿 Intermediate</option>
                  <option value="advanced">🌳 Advanced</option>
                  <option value="expert">🏆 Expert</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Learning Style</label>
                <select 
                  value={additionalInfo.preferred_learning_style} 
                  onChange={(e) => handleAdditionalInfoChange("preferred_learning_style", e.target.value)} 
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                >
                  <option value="visual">👁️ Visual</option>
                  <option value="auditory">🎧 Auditory</option>
                  <option value="kinesthetic">✋ Kinesthetic</option>
                  <option value="mixed">🎯 Mixed</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Daily Goal (hours)</label>
                <input 
                  type="number" 
                  value={additionalInfo.daily_goal_hours} 
                  onChange={(e) => handleAdditionalInfoChange("daily_goal_hours", parseFloat(e.target.value))} 
                  min="0.5" 
                  max="12" 
                  step="0.5" 
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm" 
                />
              </div>
            </div>
          </Card>

          {/* Notification Settings */}
          <Card className="p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl border-0 rounded-3xl">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mr-3">
                <Bell className="w-5 h-5 text-white" />
              </div>
              Notification Preferences
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {Object.entries(notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-600/50 border border-gray-200/50 dark:border-gray-600/50 hover:shadow-md transition-all duration-200">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {key.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Receive {key.replace("_", " ")} about your learning progress
                    </p>
                  </div>
                  <Switch 
                    checked={value} 
                    onCheckedChange={(checked) => handleNotificationChange(key, checked)} 
                    className="ml-4"
                  />
                </div>
              ))}
            </div>
          </Card>

          {/* Privacy Settings */}
          <Card className="p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl border-0 rounded-3xl">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center mr-3">
                <Shield className="w-5 h-5 text-white" />
              </div>
              Privacy Settings
            </h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Profile Visibility</label>
                <select 
                  value={privacy.profile_visibility} 
                  onChange={(e) => handlePrivacyChange("profile_visibility", e.target.value)} 
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                >
                  <option value="public">🌐 Public</option>
                  <option value="friends">👥 Friends Only</option>
                  <option value="private">🔒 Private</option>
                </select>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {Object.entries(privacy).filter(([key]) => key !== "profile_visibility").map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-green-50 to-teal-50 dark:from-gray-700/50 dark:to-gray-600/50 border border-green-200/50 dark:border-gray-600/50 hover:shadow-md transition-all duration-200">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {key.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Allow others to see your {key.replace("show_", "").replace("_", " ")}
                      </p>
                    </div>
                    <Switch 
                      checked={value} 
                      onCheckedChange={(checked) => handlePrivacyChange(key, checked)} 
                      className="ml-4"
                    />
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Save Button */}
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 pb-8">
            <Button 
              variant="outline" 
              onClick={onBack} 
              disabled={isSaving}
              className="w-full sm:w-auto px-8 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-lg rounded-xl"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveProfile} 
              disabled={isSaving || isUploadingImage} 
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 rounded-xl min-w-[140px]"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}