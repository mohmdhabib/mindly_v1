import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import {
  ArrowLeft,
  User,
  Mail,
  Calendar,
  Target,
  Bell,
  Shield,
  Save,
  Camera,
  Loader2,
  Upload,
} from "lucide-react";
import { useAuth } from "@/components/AuthWrapper";
import { ProfileService } from "@/services/profile.service";
import { supabase } from "@/lib/supabase"; // Make sure you have this import

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
    learning_level: "beginner",
    daily_goal_hours: 2,
    preferred_learning_style: "visual",
    bio: "",
    location: "",
    website: "",
    twitter_handle: "",
    linkedin_handle: "",
  });

  const [notifications, setNotifications] = useState({
    email_notifications: true,
    push_notifications: true,
    sms_notifications: false,
    marketing_notifications: false,
    achievement_notifications: true,
    reminder_notifications: true,
  });

  const [privacy, setPrivacy] = useState({
    profile_visibility: "public",
    show_progress: true,
    show_achievements: true,
    show_activity: false,
  });

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!session?.user?.id) return;

      setIsLoading(true);
      setSaveError(null);
      try {
        const { data, error } = await ProfileService.getOrCreateProfile(
          session.user.id
        );

        if (error) {
          console.error("Error fetching profile:", error);
          setSaveError("Failed to load profile data");
          return;
        }

        if (data) {
          setProfileData({
            full_name: data.full_name || "",
            username: data.username || "",
            email: session.user.email || "",
            avatar_url: data.avatar_url || "",
            learning_level: data.learning_level || "beginner",
            daily_goal_hours: data.daily_goal_hours || 2,
            preferred_learning_style: data.preferred_learning_style || "visual",
            bio: data.bio || "",
            location: data.location || "",
            website: data.website || "",
            twitter_handle: data.twitter_handle || "",
            linkedin_handle: data.linkedin_handle || "",
          });

          // Set notifications from profile preferences
          const prefs = data.learning_preferences || {};
          setNotifications({
            email_notifications: prefs.email_notifications !== false,
            push_notifications: prefs.push_notifications !== false,
            sms_notifications: prefs.sms_notifications === true,
            marketing_notifications: prefs.marketing_notifications === true,
            achievement_notifications:
              prefs.achievement_notifications !== false,
            reminder_notifications: prefs.reminder_notifications !== false,
          });

          setPrivacy({
            profile_visibility: prefs.profile_visibility || "public",
            show_progress: prefs.show_progress !== false,
            show_achievements: prefs.show_achievements !== false,
            show_activity: prefs.show_activity === true,
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
    setProfileData((prev) => ({ ...prev, [field]: value }));
    setSaveError(null); // Clear any previous errors
  };

  // Handle notification toggle
  const handleNotificationChange = (key, value) => {
    setNotifications((prev) => ({ ...prev, [key]: value }));
  };

  // Handle privacy setting change
  const handlePrivacyChange = (key, value) => {
    setPrivacy((prev) => ({ ...prev, [key]: value }));
  };

  // Handle image upload
  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !session?.user?.id) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setSaveError("Please select a valid image file");
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setSaveError("Image size must be less than 5MB");
      return;
    }

    setIsUploadingImage(true);
    setSaveError(null);

    try {
      // Create a unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${session.user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("profiles") // Make sure this bucket exists in your Supabase project
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        setSaveError("Failed to upload image. Please try again.");
        return;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("profiles")
        .getPublicUrl(filePath);

      if (urlData?.publicUrl) {
        // Update profile data with new avatar URL
        handleInputChange("avatar_url", urlData.publicUrl);
      }
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

    // Basic validation
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
      // Prepare update data with explicit structure
      const updateData = {
        id: session.user.id,
        full_name: profileData.full_name.trim(),
        username: profileData.username.trim(),
        email: profileData.email,
        avatar_url: profileData.avatar_url,
        learning_level: profileData.learning_level,
        daily_goal_hours: Number(profileData.daily_goal_hours),
        preferred_learning_style: profileData.preferred_learning_style,
        bio: profileData.bio.trim(),
        location: profileData.location.trim(),
        website: profileData.website.trim(),
        twitter_handle: profileData.twitter_handle.trim(),
        linkedin_handle: profileData.linkedin_handle.trim(),
        learning_preferences: {
          // Notification preferences
          email_notifications: notifications.email_notifications,
          push_notifications: notifications.push_notifications,
          sms_notifications: notifications.sms_notifications,
          marketing_notifications: notifications.marketing_notifications,
          achievement_notifications: notifications.achievement_notifications,
          reminder_notifications: notifications.reminder_notifications,
          // Privacy preferences
          profile_visibility: privacy.profile_visibility,
          show_progress: privacy.show_progress,
          show_achievements: privacy.show_achievements,
          show_activity: privacy.show_activity,
          // Learning preferences
          preferred_learning_style: profileData.preferred_learning_style,
          daily_goal_hours: Number(profileData.daily_goal_hours),
        },
        updated_at: new Date().toISOString(),
      };

      console.log("Saving profile data:", updateData);

      // Use upsert to handle both insert and update cases
      const { data, error } = await supabase
        .from("profiles")
        .upsert(updateData, {
          onConflict: "id",
          ignoreDuplicates: false,
        })
        .select()
        .single();

      if (error) {
        console.error("Supabase error:", error);
        setSaveError(`Failed to save profile: ${error.message}`);
        return;
      }

      console.log("Profile saved successfully:", data);

      // Show success message
      setSaveError(null);

      // Optional: Show success toast or notification here
      alert("Profile updated successfully!");

      // Navigate back to main page after a short delay
      setTimeout(() => {
        if (onBack) onBack();
      }, 1000);
    } catch (error) {
      console.error("Exception updating profile:", error);
      setSaveError("An unexpected error occurred while saving your profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-mindly-bg dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-mindly-primary mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">
            Loading profile data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mindly-bg dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="outline" onClick={onBack} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Profile
          </Button>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Edit Profile
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Update your personal information and preferences
            </p>
          </div>
        </div>

        {/* Error Message */}
        {saveError && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-700 dark:text-red-300 text-sm">
              {saveError}
            </p>
          </div>
        )}

        <div className="space-y-8">
          {/* Profile Information */}
          <Card className="p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <User className="w-5 h-5 mr-2 text-mindly-primary" />
              Profile Information
            </h2>

            {/* Avatar Section */}
            <div className="flex items-center space-x-6 mb-6">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  {profileData.avatar_url ? (
                    <AvatarImage
                      src={profileData.avatar_url}
                      alt="Profile"
                      className="object-cover"
                    />
                  ) : null}
                  <AvatarFallback className="bg-gradient-to-br from-mindly-primary to-mindly-accent text-white text-2xl font-bold">
                    {getInitials(profileData.full_name || profileData.username)}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingImage}
                >
                  {isUploadingImage ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Camera className="w-4 h-4" />
                  )}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Profile Picture
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  Upload a new profile picture (max 5MB)
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingImage}
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
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={profileData.full_name}
                  onChange={(e) =>
                    handleInputChange("full_name", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-mindly-primary"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Username *
                </label>
                <input
                  type="text"
                  value={profileData.username}
                  onChange={(e) =>
                    handleInputChange("username", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-mindly-primary"
                  placeholder="Choose a username"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                  disabled
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Email cannot be changed
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={profileData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-mindly-primary"
                  placeholder="City, Country"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  value={profileData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-mindly-primary"
                  placeholder="https://yourwebsite.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Twitter Handle
                </label>
                <input
                  type="text"
                  value={profileData.twitter_handle}
                  onChange={(e) =>
                    handleInputChange("twitter_handle", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-mindly-primary"
                  placeholder="@username"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bio
              </label>
              <textarea
                value={profileData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-mindly-primary"
                placeholder="Tell us a bit about yourself..."
              />
            </div>
          </Card>

          {/* Learning Preferences */}
          <Card className="p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <Target className="w-5 h-5 mr-2 text-mindly-accent" />
              Learning Preferences
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Learning Level
                </label>
                <select
                  value={profileData.learning_level}
                  onChange={(e) =>
                    handleInputChange("learning_level", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-mindly-primary"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Preferred Learning Style
                </label>
                <select
                  value={profileData.preferred_learning_style}
                  onChange={(e) =>
                    handleInputChange(
                      "preferred_learning_style",
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-mindly-primary"
                >
                  <option value="visual">Visual</option>
                  <option value="auditory">Auditory</option>
                  <option value="kinesthetic">Kinesthetic</option>
                  <option value="mixed">Mixed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Daily Learning Goal (hours)
                </label>
                <input
                  type="number"
                  value={profileData.daily_goal_hours}
                  onChange={(e) =>
                    handleInputChange(
                      "daily_goal_hours",
                      parseFloat(e.target.value)
                    )
                  }
                  min="0.5"
                  max="12"
                  step="0.5"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-mindly-primary"
                />
              </div>
            </div>
          </Card>

          {/* Notification Settings */}
          <Card className="p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <Bell className="w-5 h-5 mr-2 text-yellow-500" />
              Notification Preferences
            </h2>

            <div className="space-y-4">
              {Object.entries(notifications).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                >
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {key
                        .split("_")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Receive {key.replace("_", " ")} about your learning
                      progress
                    </p>
                  </div>
                  <Switch
                    checked={value}
                    onCheckedChange={(checked) =>
                      handleNotificationChange(key, checked)
                    }
                  />
                </div>
              ))}
            </div>
          </Card>

          {/* Privacy Settings */}
          <Card className="p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-green-500" />
              Privacy Settings
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Profile Visibility
                </label>
                <select
                  value={privacy.profile_visibility}
                  onChange={(e) =>
                    handlePrivacyChange("profile_visibility", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-mindly-primary"
                >
                  <option value="public">Public</option>
                  <option value="friends">Friends Only</option>
                  <option value="private">Private</option>
                </select>
              </div>

              <div className="space-y-4">
                {Object.entries(privacy)
                  .filter(([key]) => key !== "profile_visibility")
                  .map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {key
                            .split("_")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(" ")}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Allow others to see your{" "}
                          {key.replace("show_", "").replace("_", " ")}
                        </p>
                      </div>
                      <Switch
                        checked={value}
                        onCheckedChange={(checked) =>
                          handlePrivacyChange(key, checked)
                        }
                      />
                    </div>
                  ))}
              </div>
            </div>
          </Card>

          {/* Save Button */}
          <div className="flex justify-center space-x-4">
            <Button variant="outline" onClick={onBack} disabled={isSaving}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveProfile}
              disabled={isSaving || isUploadingImage}
              className="bg-mindly-primary hover:bg-mindly-primary/90 min-w-[120px]"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
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
