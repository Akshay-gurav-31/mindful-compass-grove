
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { User, Calendar, Clock, FileText, Settings, MessageSquare, Phone, VideoIcon, CheckCircle, XCircle } from "lucide-react";

interface PatientRequest {
  id: string;
  patientName: string;
  patientId: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  date: Date;
}

const DoctorDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Mock patient requests
  const [patientRequests, setPatientRequests] = useState<PatientRequest[]>([
    {
      id: "req1",
      patientName: "John Doe",
      patientId: "p123",
      message: "I've been experiencing severe anxiety lately. Can we schedule a session?",
      status: 'pending',
      date: new Date(Date.now() - 86400000) // 1 day ago
    },
    {
      id: "req2",
      patientName: "Emma Wilson",
      patientId: "p456",
      message: "Would like to discuss my medication side effects.",
      status: 'pending',
      date: new Date(Date.now() - 172800000) // 2 days ago
    },
    {
      id: "req3",
      patientName: "Michael Brown",
      patientId: "p789",
      message: "Need to follow up on my treatment plan.",
      status: 'accepted',
      date: new Date(Date.now() - 259200000) // 3 days ago
    }
  ]);

  const handleAcceptRequest = (requestId: string) => {
    setPatientRequests(prev => 
      prev.map(req => 
        req.id === requestId ? {...req, status: 'accepted'} : req
      )
    );
    
    toast({
      title: "Request Accepted",
      description: "You can now communicate with this patient.",
    });
  };

  const handleRejectRequest = (requestId: string) => {
    setPatientRequests(prev => 
      prev.map(req => 
        req.id === requestId ? {...req, status: 'rejected'} : req
      )
    );
    
    toast({
      title: "Request Rejected",
      description: "The patient will be notified.",
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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
                      {user?.name ? user.name.charAt(0).toUpperCase() : "D"}
                    </div>
                    <h3 className="text-lg font-semibold">{user?.name || "Doctor"}</h3>
                    <p className="text-sm text-gray-400">{user?.email}</p>
                    <p className="text-xs bg-mindful-primary text-white px-2 py-1 rounded mt-2 capitalize">
                      {user?.type || "doctor"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="dark-card">
                <CardContent className="p-0">
                  <nav className="flex flex-col">
                    <a href="#profile" className="flex items-center gap-2 p-3 hover:bg-neutral-700 border-l-4 border-transparent">
                      <User size={18} />
                      <span>Profile</span>
                    </a>
                    <a href="#requests" className="flex items-center gap-2 p-3 hover:bg-neutral-700 border-l-4 border-mindful-primary">
                      <MessageSquare size={18} />
                      <span>Patient Requests</span>
                    </a>
                    <a href="#appointments" className="flex items-center gap-2 p-3 hover:bg-neutral-700 border-l-4 border-transparent">
                      <Calendar size={18} />
                      <span>Appointments</span>
                    </a>
                    <a href="#patients" className="flex items-center gap-2 p-3 hover:bg-neutral-700 border-l-4 border-transparent">
                      <FileText size={18} />
                      <span>My Patients</span>
                    </a>
                    <a href="#settings" className="flex items-center gap-2 p-3 hover:bg-neutral-700 border-l-4 border-transparent">
                      <Settings size={18} />
                      <span>Settings</span>
                    </a>
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <Tabs defaultValue="requests" className="w-full">
                <TabsList className="mb-6 bg-neutral-800">
                  <TabsTrigger value="requests" className="data-[state=active]:bg-mindful-primary data-[state=active]:text-white">
                    Patient Requests
                  </TabsTrigger>
                  <TabsTrigger value="appointments" className="data-[state=active]:bg-mindful-primary data-[state=active]:text-white">
                    Appointments
                  </TabsTrigger>
                  <TabsTrigger value="patients" className="data-[state=active]:bg-mindful-primary data-[state=active]:text-white">
                    My Patients
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="requests">
                  <Card className="dark-card">
                    <CardHeader>
                      <CardTitle>Patient Consultation Requests</CardTitle>
                      <CardDescription className="text-gray-400">
                        Review and respond to patient requests
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {patientRequests.filter(req => req.status === 'pending').length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-gray-400 mb-4">No pending patient requests.</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {patientRequests
                            .filter(req => req.status === 'pending')
                            .map(request => (
                              <Card key={request.id} className="bg-neutral-800 border-neutral-700">
                                <CardContent className="p-4">
                                  <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                      <div className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center text-sm">
                                        {request.patientName.charAt(0)}
                                      </div>
                                      <div>
                                        <h4 className="font-medium">{request.patientName}</h4>
                                        <p className="text-xs text-gray-400">{formatDate(request.date)}</p>
                                      </div>
                                    </div>
                                    <Badge variant="outline" className="bg-yellow-900/30 text-yellow-400 border-yellow-800">
                                      Pending
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-gray-300 mb-4">{request.message}</p>
                                  <div className="flex justify-end gap-2">
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="border-red-800 text-red-400 hover:bg-red-950"
                                      onClick={() => handleRejectRequest(request.id)}
                                    >
                                      <XCircle size={16} className="mr-1" />
                                      Decline
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      className="bg-green-800 hover:bg-green-700 text-white"
                                      onClick={() => handleAcceptRequest(request.id)}
                                    >
                                      <CheckCircle size={16} className="mr-1" />
                                      Accept
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  {/* Accepted Requests */}
                  <Card className="dark-card mt-6">
                    <CardHeader>
                      <CardTitle>Active Patients</CardTitle>
                      <CardDescription className="text-gray-400">
                        Patients you've accepted for consultation
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {patientRequests.filter(req => req.status === 'accepted').length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-gray-400 mb-4">No active patients yet.</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {patientRequests
                            .filter(req => req.status === 'accepted')
                            .map(request => (
                              <Card key={request.id} className="bg-neutral-800 border-neutral-700">
                                <CardContent className="p-4">
                                  <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                      <div className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center text-sm">
                                        {request.patientName.charAt(0)}
                                      </div>
                                      <div>
                                        <h4 className="font-medium">{request.patientName}</h4>
                                        <p className="text-xs text-gray-400">{formatDate(request.date)}</p>
                                      </div>
                                    </div>
                                    <Badge variant="outline" className="bg-green-900/30 text-green-400 border-green-800">
                                      Active
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-gray-300 mb-4">{request.message}</p>
                                  <div className="flex justify-end gap-2">
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="border-blue-800 text-blue-400 hover:bg-blue-950"
                                    >
                                      <MessageSquare size={16} className="mr-1" />
                                      Chat
                                    </Button>
                                    <Button 
                                      variant="outline"
                                      size="sm" 
                                      className="border-purple-800 text-purple-400 hover:bg-purple-950"
                                    >
                                      <Phone size={16} className="mr-1" />
                                      Call
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      className="bg-mindful-primary hover:bg-mindful-secondary text-white"
                                    >
                                      <VideoIcon size={16} className="mr-1" />
                                      Video
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="appointments">
                  <Card className="dark-card">
                    <CardHeader>
                      <CardTitle>Upcoming Appointments</CardTitle>
                      <CardDescription className="text-gray-400">
                        Manage your scheduled appointments
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8">
                        <p className="text-gray-400 mb-4">No upcoming appointments scheduled.</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="patients">
                  <Card className="dark-card">
                    <CardHeader>
                      <CardTitle>My Patients</CardTitle>
                      <CardDescription className="text-gray-400">
                        List of all your patients
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8">
                        <p className="text-gray-400 mb-4">Start accepting patient requests to build your patient list.</p>
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

export default DoctorDashboard;
