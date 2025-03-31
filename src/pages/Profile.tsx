
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import ProfileHeader from "@/components/user-profile/ProfileHeader";
import ProfileForm from "@/components/user-profile/ProfileForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCheck, FileText, Bell, Settings, Shield } from "lucide-react";

const Profile = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  if (!isAuthenticated || !user) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <Layout>
      <div className="container mx-auto max-w-4xl py-6 px-4 sm:px-6 space-y-8">
        <ProfileHeader />
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="profile" className="flex-1">Profile</TabsTrigger>
            <TabsTrigger value="activity" className="flex-1">Activity</TabsTrigger>
            <TabsTrigger value="settings" className="flex-1">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="pt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck size={20} />
                  <span>Profile Information</span>
                </CardTitle>
                <CardDescription>
                  Update your profile information to help others connect with you
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileForm />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="activity" className="pt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText size={20} />
                  <span>Recent Activity</span>
                </CardTitle>
                <CardDescription>
                  Your posts, comments and other activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <p>No recent activity to display</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings" className="pt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings size={20} />
                  <span>Account Settings</span>
                </CardTitle>
                <CardDescription>
                  Manage your account preferences and security settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
                    <Bell size={18} />
                    <span>Notification Settings</span>
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Configure how and when you receive notifications
                  </p>
                  <div className="text-sm text-muted-foreground text-center py-4">
                    Notification settings coming soon
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
                    <Shield size={18} />
                    <span>Privacy & Security</span>
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Control your privacy settings and account security
                  </p>
                  <div className="text-sm text-muted-foreground text-center py-4">
                    Privacy settings coming soon
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Profile;
