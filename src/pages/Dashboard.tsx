
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Simulate user data - in a real app, this would come from your auth system
  const [userData, setUserData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    role: "patient" // or "doctor"
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      // Simulate file upload
      const reader = new FileReader();
      reader.onloadend = () => {
        setTimeout(() => {
          setProfileImage(reader.result as string);
          setIsUploading(false);
          toast({
            title: "Profile photo updated",
            description: "Your profile photo has been successfully updated.",
          });
        }, 1000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Profile updated",
      description: "Your profile information has been successfully updated.",
    });
  };

  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-200px)] bg-mindful-warmNeutral py-12">
        <div className="mindful-container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="md:col-span-1">
              <Card className="shadow-md">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center space-y-4 mb-6">
                    <div className="relative">
                      <Avatar className="w-24 h-24 border-4 border-mindful-accent">
                        <AvatarImage src={profileImage || ""} />
                        <AvatarFallback className="bg-mindful-primary text-white text-xl">
                          {userData.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <label 
                        htmlFor="profile-photo" 
                        className="absolute bottom-0 right-0 bg-mindful-primary hover:bg-mindful-secondary text-white rounded-full p-1 cursor-pointer"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"></path>
                          <path d="m15 7 3 3"></path>
                          <path d="M3 21 12 12"></path>
                          <path d="M12 12 21 3"></path>
                        </svg>
                        <input 
                          id="profile-photo" 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={handleFileChange}
                          disabled={isUploading}
                        />
                      </label>
                    </div>
                    <div className="text-center">
                      <h3 className="text-xl font-semibold">{userData.name}</h3>
                      <p className="text-gray-500">{userData.email}</p>
                      <span className="inline-block px-3 py-1 mt-2 text-xs font-medium rounded-full capitalize bg-mindful-accent text-mindful-primary">
                        {userData.role}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button 
                      onClick={() => setActiveTab("dashboard")}
                      variant={activeTab === "dashboard" ? "default" : "ghost"}
                      className={`w-full justify-start ${activeTab === "dashboard" ? "bg-mindful-primary text-white" : ""}`}
                    >
                      Dashboard
                    </Button>
                    <Button 
                      onClick={() => setActiveTab("profile")}
                      variant={activeTab === "profile" ? "default" : "ghost"}
                      className={`w-full justify-start ${activeTab === "profile" ? "bg-mindful-primary text-white" : ""}`}
                    >
                      Profile Settings
                    </Button>
                    <Button 
                      onClick={() => {
                        toast({
                          title: "Logged out",
                          description: "You have been successfully logged out.",
                        });
                        navigate("/login");
                      }}
                      variant="ghost"
                      className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      Logout
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="md:col-span-3">
              {activeTab === "dashboard" && (
                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle>Dashboard</CardTitle>
                    <CardDescription>
                      Welcome to your personal dashboard at Mindful Grove.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 md:grid-cols-2">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base font-medium">Upcoming Sessions</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-center py-6">
                            <p className="text-muted-foreground">No upcoming sessions scheduled.</p>
                            <Button 
                              className="mt-4 mindful-btn-primary"
                              onClick={() => navigate("/services")}
                            >
                              Book a Session
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base font-medium">AI Chat Support</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-center py-6">
                            <p className="text-muted-foreground">Need some immediate support?</p>
                            <Button 
                              className="mt-4 mindful-btn-primary"
                              onClick={() => navigate("/chatbot")}
                            >
                              Start AI Chat
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === "profile" && (
                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle>Profile Settings</CardTitle>
                    <CardDescription>
                      Manage your personal information and account settings.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleProfileUpdate} className="space-y-6">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input 
                              id="name" 
                              value={userData.name}
                              onChange={(e) => setUserData({...userData, name: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input 
                              id="email" 
                              type="email" 
                              value={userData.email}
                              onChange={(e) => setUserData({...userData, email: e.target.value})}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="profile-photo-upload">Profile Photo</Label>
                          <div className="flex items-center space-x-4">
                            <Avatar className="w-16 h-16">
                              <AvatarImage src={profileImage || ""} />
                              <AvatarFallback className="bg-mindful-primary text-white">
                                {userData.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <label className="cursor-pointer">
                              <Button 
                                type="button" 
                                variant="outline" 
                                disabled={isUploading}
                              >
                                {isUploading ? "Uploading..." : "Change Photo"}
                              </Button>
                              <input 
                                id="profile-photo-upload"
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                onChange={handleFileChange} 
                                disabled={isUploading}
                              />
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button type="submit" className="mindful-btn-primary">
                          Save Changes
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
