import { useState } from 'react';
import { User, LogIn, LogOut, Upload } from 'lucide-react';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export function SettingsPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('Guest User');
  const [profileImage, setProfileImage] = useState('');
  const [editingProfile, setEditingProfile] = useState(false);
  const [tempUsername, setTempUsername] = useState(username);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setUsername('Demo User');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('Guest User');
    setProfileImage('');
  };

  const handleSaveProfile = () => {
    setUsername(tempUsername);
    setEditingProfile(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="h-full p-6">
      <h1 className="mb-6">Settings</h1>

      <div className="max-w-2xl space-y-6">
        {/* My Profile */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-5 h-5 text-primary" />
            <h3>My Profile</h3>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <Avatar className="w-20 h-20">
                <AvatarImage src={profileImage} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {getInitials(username)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <label htmlFor="profile-upload" className="cursor-pointer">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-md transition-colors">
                    <Upload className="w-4 h-4" />
                    <span>Upload Photo</span>
                  </div>
                  <input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
                <p className="text-sm text-muted-foreground mt-2">
                  JPG, PNG or GIF (max. 2MB)
                </p>
              </div>
            </div>

            <div>
              <Label htmlFor="username" className="mb-2 block">Username</Label>
              {editingProfile ? (
                <div className="flex gap-2">
                  <Input
                    id="username"
                    value={tempUsername}
                    onChange={(e) => setTempUsername(e.target.value)}
                    placeholder="Enter username"
                  />
                  <Button onClick={handleSaveProfile}>Save</Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setEditingProfile(false);
                      setTempUsername(username);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2 items-center">
                  <div className="flex-1 px-3 py-2 bg-muted/30 rounded-md">{username}</div>
                  <Button onClick={() => setEditingProfile(true)}>Edit</Button>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-border">
              {!isLoggedIn ? (
                <Button onClick={handleLogin} className="w-full gap-2">
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Button>
              ) : (
                <Button onClick={handleLogout} variant="outline" className="w-full gap-2">
                  <LogOut className="w-4 h-4" />
                  Log Out
                </Button>
              )}
              <p className="text-xs text-muted-foreground mt-2 text-center">
                {isLoggedIn ? 'You are currently signed in' : 'Sign in to save your data across devices'}
              </p>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="mb-4">Notifications</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="task-reminders" className="flex-1">Task Reminders</Label>
              <Switch id="task-reminders" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="timer-alerts" className="flex-1">Timer Alerts</Label>
              <Switch id="timer-alerts" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="daily-motivation" className="flex-1">Daily Motivation</Label>
              <Switch id="daily-motivation" defaultChecked />
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="mb-4">Appearance</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode" className="flex-1">Dark Mode</Label>
              <Switch id="dark-mode" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="compact-view" className="flex-1">Compact View</Label>
              <Switch id="compact-view" />
            </div>
          </div>
        </div>

        {/* Productivity */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="mb-4">Productivity</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="focus-mode" className="flex-1">Focus Mode</Label>
              <Switch id="focus-mode" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-archive" className="flex-1">Auto-archive Completed Tasks</Label>
              <Switch id="auto-archive" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
