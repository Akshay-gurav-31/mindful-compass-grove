
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { User, Settings, Calendar, Clock, FileText, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    bio: ""
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved."
    });
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-220px)] bg-neutral-900 py-8">
        <div className="mindful-container">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <div className="w-full md:w-64 space-y-4">
              <Card className="dark-card">
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-full bg-neutral-700 flex items-center justify-center text-3xl text-mindful-primary mb-4">
                      {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <h3 className="text-lg font-semibold">{user?.name || "User"}</h3>
                    <p className="text-sm text-gray-400">{user?.email}</p>
                    <p className="text-xs bg-mindful-primary text-white px-2 py-1 rounded mt-2 capitalize">
                      {user?.type || "user"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="dark-card">
                <CardContent className="p-0">
                  <nav className="flex flex-col">
                    <a href="#profile" className="flex items-center gap-2 p-3 hover:bg-neutral-700 border-l-4 border-mindful-primary">
                      <User size={18} />
                      <span>Profile</span>
                    </a>
                    <a href="#appointments" className="flex items-center gap-2 p-3 hover:bg-neutral-700 border-l-4 border-transparent">
                      <Calendar size={18} />
                      <span>Appointments</span>
                    </a>
                    <a href="#history" className="flex items-center gap-2 p-3 hover:bg-neutral-700 border-l-4 border-transparent">
                      <Clock size={18} />
                      <span>History</span>
                    </a>
                    <a href="#records" className="flex items-center gap-2 p-3 hover:bg-neutral-700 border-l-4 border-transparent">
                      <FileText size={18} />
                      <span>Records</span>
                    </a>
                    <a href="#settings" className="flex items-center gap-2 p-3 hover:bg-neutral-700 border-l-4 border-transparent">
                      <Settings size={18} />
                      <span>Settings</span>
                    </a>
                    <button 
                      onClick={handleLogout} 
                      className="flex items-center gap-2 p-3 hover:bg-neutral-700 border-l-4 border-transparent text-left text-red-400"
                    >
                      <LogOut size={18} />
                      <span>Logout</span>
                    </button>
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="mb-6 bg-neutral-800">
                  <TabsTrigger value="profile" className="data-[state=active]:bg-mindful-primary data-[state=active]:text-white">
                    Profile
                  </TabsTrigger>
                  <TabsTrigger value="appointments" className="data-[state=active]:bg-mindful-primary data-[state=active]:text-white">
                    Appointments
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="data-[state=active]:bg-mindful-primary data-[state=active]:text-white">
                    Settings
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                  <Card className="dark-card">
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription className="text-gray-400">
                        Update your personal details
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleProfileSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name" className="text-gray-300">Full Name</Label>
                            <Input
                              id="name"
                              name="name"
                              value={profileForm.name}
                              onChange={handleProfileChange}
                              className="dark-input"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-300">Email</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={profileForm.email}
                              onChange={handleProfileChange}
                              className="dark-input"
                              disabled
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone" className="text-gray-300">Phone Number</Label>
                            <Input
                              id="phone"
                              name="phone"
                              value={profileForm.phone}
                              onChange={handleProfileChange}
                              className="dark-input"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="bio" className="text-gray-300">About Me</Label>
                          <Textarea
                            id="bio"
                            name="bio"
                            value={profileForm.bio}
                            onChange={handleProfileChange}
                            rows={4}
                            className="dark-input resize-none"
                          />
                        </div>

                        <Button type="submit" className="mindful-btn-primary">
                          Save Changes
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="appointments">
                  <Card className="dark-card">
                    <CardHeader>
                      <CardTitle>Your Appointments</CardTitle>
                      <CardDescription className="text-gray-400">
                        Manage your upcoming sessions
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8">
                        <p className="text-gray-400 mb-4">You don't have any appointments scheduled yet.</p>
                        <Button className="mindful-btn-primary">Book a Consultation</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="settings">
                  <Card className="dark-card">
                    <CardHeader>
                      <CardTitle>Account Settings</CardTitle>
                      <CardDescription className="text-gray-400">
                        Manage your account preferences
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-gray-300">Email Notifications</Label>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="email-notify" className="rounded border-gray-600" />
                          <Label htmlFor="email-notify" className="text-gray-400 text-sm cursor-pointer">
                            Receive email notifications about appointments and updates
                          </Label>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-gray-300">Change Password</Label>
                        <Button variant="outline" className="border-neutral-600 text-white hover:bg-neutral-700">
                          Update Password
                        </Button>
                      </div>
                      
                      <div className="pt-4 border-t border-neutral-700">
                        <Button 
                          variant="destructive" 
                          className="bg-red-900 hover:bg-red-800 text-white"
                          onClick={() => {
                            toast({
                              title: "Account Action",
                              description: "This feature is not available in the demo.",
                            });
                          }}
                        >
                          Delete Account
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
