
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { User, Calendar as CalendarIcon, Clock, FileText, Settings, MessageSquare, Phone, VideoIcon, CheckCircle, XCircle, Users, LogOut } from "lucide-react";

interface PatientRequest {
  id: string;
  patientName: string;
  patientId: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  date: Date;
  severity: 'low' | 'medium' | 'high';
  patientAvatar?: string;
}

interface Patient {
  id: string;
  name: string;
  contactInfo: string;
  lastVisit?: Date;
  notes?: string;
  status: 'active' | 'inactive';
}

const DoctorDashboard = () => {
  const { user, doctorData, updateUserProfile, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    specialization: user?.specialization || "",
    bio: user?.bio || ""
  });
  
  // Patient requests state
  const [patientRequests, setPatientRequests] = useState<PatientRequest[]>([
    {
      id: "req1",
      patientName: "John Doe",
      patientId: "p123",
      message: "I've been experiencing severe anxiety and panic attacks lately. Can we schedule an urgent session?",
      status: 'pending',
      date: new Date(Date.now() - 86400000), // 1 day ago
      severity: 'high'
    },
    {
      id: "req2",
      patientName: "Emma Wilson",
      patientId: "p456",
      message: "Would like to discuss my medication side effects. I'm experiencing dizziness and nausea.",
      status: 'pending',
      date: new Date(Date.now() - 172800000), // 2 days ago
      severity: 'medium'
    },
    {
      id: "req3",
      patientName: "Michael Brown",
      patientId: "p789",
      message: "Need to follow up on my treatment plan for depression. Feeling some improvement but still having issues.",
      status: 'accepted',
      date: new Date(Date.now() - 259200000), // 3 days ago
      severity: 'medium'
    }
  ]);
  
  // My patients state
  const [myPatients, setMyPatients] = useState<Patient[]>([
    {
      id: "p789",
      name: "Michael Brown",
      contactInfo: "michael.b@example.com",
      lastVisit: new Date(Date.now() - 259200000), // 3 days ago
      notes: "Patient showing signs of improvement with current medication.",
      status: 'active'
    }
  ]);
  
  // New appointment state
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [appointmentNote, setAppointmentNote] = useState<string>("");
  
  // Appointments state
  const [appointments, setAppointments] = useState<any[]>(
    doctorData?.appointments || []
  );

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        specialization: user.specialization || "",
        bio: user.bio || ""
      });
    }
    
    if (doctorData) {
      setAppointments(doctorData.appointments);
    }
  }, [user, doctorData]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: profileForm.name,
      phone: profileForm.phone,
      specialization: profileForm.specialization,
      bio: profileForm.bio
    });
    
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved."
    });
  };

  const handleAcceptRequest = (requestId: string) => {
    setPatientRequests(prev => 
      prev.map(req => 
        req.id === requestId ? {...req, status: 'accepted'} : req
      )
    );
    
    // Add the patient to my patients list if not already there
    const request = patientRequests.find(req => req.id === requestId);
    if (request) {
      const patientExists = myPatients.some(pat => pat.id === request.patientId);
      
      if (!patientExists) {
        setMyPatients(prev => [
          ...prev,
          {
            id: request.patientId,
            name: request.patientName,
            contactInfo: `patient-${request.patientId}@example.com`,
            lastVisit: new Date(),
            status: 'active'
          }
        ]);
      }
    }
    
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
  
  const handleScheduleAppointment = () => {
    if (!selectedDate || !selectedPatient) {
      toast({
        title: "Missing Information",
        description: "Please select a date and patient.",
        variant: "destructive"
      });
      return;
    }
    
    const patient = myPatients.find(pat => pat.id === selectedPatient);
    
    if (!patient) {
      toast({
        title: "Error",
        description: "Selected patient not found.",
        variant: "destructive"
      });
      return;
    }
    
    const newAppointment = {
      id: `apt-${Date.now()}`,
      doctorId: user?.id || "",
      patientId: patient.id,
      doctorName: user?.name || "",
      patientName: patient.name,
      date: selectedDate,
      status: 'scheduled' as const,
      notes: appointmentNote
    };
    
    setAppointments(prev => [...prev, newAppointment]);
    
    // Update patient's last visit
    setMyPatients(prev => 
      prev.map(pat => 
        pat.id === patient.id ? {...pat, lastVisit: selectedDate} : pat
      )
    );
    
    toast({
      title: "Appointment Scheduled",
      description: `Your appointment with ${patient.name} on ${format(selectedDate, 'MMMM dd, yyyy')} has been scheduled.`
    });
    
    // Reset form fields
    setSelectedDate(undefined);
    setSelectedPatient("");
    setAppointmentNote("");
  };
  
  const handleAddPatientNote = (patientId: string, note: string) => {
    setMyPatients(prev => 
      prev.map(pat => 
        pat.id === patientId ? {...pat, notes: note} : pat
      )
    );
    
    toast({
      title: "Note Added",
      description: "Your note has been saved."
    });
  };
  
  const handleCancelAppointment = (appointmentId: string) => {
    setAppointments(prev => 
      prev.map(apt => 
        apt.id === appointmentId ? {...apt, status: 'cancelled'} : apt
      )
    );
    
    toast({
      title: "Appointment Cancelled",
      description: "The appointment has been cancelled."
    });
  };
  
  const handleCompleteAppointment = (appointmentId: string) => {
    setAppointments(prev => 
      prev.map(apt => 
        apt.id === appointmentId ? {...apt, status: 'completed'} : apt
      )
    );
    
    toast({
      title: "Appointment Completed",
      description: "The appointment has been marked as completed."
    });
  };

  const formatDate = (date: Date) => {
    return format(new Date(date), 'MMM dd, yyyy');
  };

  const getSeverityBadge = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'high':
        return <Badge variant="outline" className="bg-red-950/30 text-red-400 border-red-800">Urgent</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-orange-900/30 text-orange-400 border-orange-800">Medium</Badge>;
      case 'low':
        return <Badge variant="outline" className="bg-green-900/30 text-green-400 border-green-800">Low</Badge>;
      default:
        return null;
    }
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
              <Card className="dark-card bg-neutral-800 border-neutral-700">
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-full bg-neutral-700 flex items-center justify-center text-3xl text-mindful-primary mb-4">
                      {user?.name ? user.name.charAt(0).toUpperCase() : "D"}
                    </div>
                    <h3 className="text-lg font-semibold text-white">{user?.name || "Doctor"}</h3>
                    <p className="text-sm text-gray-400">{user?.email}</p>
                    <p className="text-xs bg-mindful-primary text-white px-2 py-1 rounded mt-2 capitalize">
                      {user?.type || "doctor"}
                    </p>
                    {profileForm.specialization && (
                      <p className="text-sm text-gray-300 mt-2">{profileForm.specialization}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="dark-card bg-neutral-800 border-neutral-700">
                <CardContent className="p-0">
                  <nav className="flex flex-col">
                    <a href="#profile" className="flex items-center gap-2 p-3 hover:bg-neutral-700 border-l-4 border-transparent text-gray-300">
                      <User size={18} />
                      <span>Profile</span>
                    </a>
                    <a href="#requests" className="flex items-center gap-2 p-3 hover:bg-neutral-700 border-l-4 border-mindful-primary bg-neutral-700/50 text-white">
                      <MessageSquare size={18} />
                      <span>Patient Requests</span>
                      {patientRequests.filter(req => req.status === 'pending').length > 0 && (
                        <Badge variant="destructive" className="ml-auto">
                          {patientRequests.filter(req => req.status === 'pending').length}
                        </Badge>
                      )}
                    </a>
                    <a href="#appointments" className="flex items-center gap-2 p-3 hover:bg-neutral-700 border-l-4 border-transparent text-gray-300">
                      <CalendarIcon size={18} />
                      <span>Appointments</span>
                    </a>
                    <a href="#patients" className="flex items-center gap-2 p-3 hover:bg-neutral-700 border-l-4 border-transparent text-gray-300">
                      <Users size={18} />
                      <span>My Patients</span>
                      {myPatients.length > 0 && (
                        <Badge className="ml-auto bg-blue-900 text-blue-200">
                          {myPatients.length}
                        </Badge>
                      )}
                    </a>
                    <a href="#settings" className="flex items-center gap-2 p-3 hover:bg-neutral-700 border-l-4 border-transparent text-gray-300">
                      <Settings size={18} />
                      <span>Settings</span>
                    </a>
                    <button 
                      onClick={handleLogout} 
                      className="flex items-center gap-2 p-3 hover:bg-neutral-700 border-l-4 border-transparent text-left text-red-400 w-full"
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
              <Tabs defaultValue="requests" className="w-full">
                <TabsList className="mb-6 bg-neutral-800">
                  <TabsTrigger value="profile" className="data-[state=active]:bg-mindful-primary data-[state=active]:text-white">
                    Profile
                  </TabsTrigger>
                  <TabsTrigger value="requests" className="data-[state=active]:bg-mindful-primary data-[state=active]:text-white">
                    Patient Requests
                    {patientRequests.filter(req => req.status === 'pending').length > 0 && (
                      <Badge variant="destructive" className="ml-2">
                        {patientRequests.filter(req => req.status === 'pending').length}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="appointments" className="data-[state=active]:bg-mindful-primary data-[state=active]:text-white">
                    Appointments
                  </TabsTrigger>
                  <TabsTrigger value="patients" className="data-[state=active]:bg-mindful-primary data-[state=active]:text-white">
                    My Patients
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                  <Card className="dark-card bg-neutral-800 border-neutral-700">
                    <CardHeader>
                      <CardTitle className="text-white">Professional Profile</CardTitle>
                      <CardDescription className="text-gray-400">
                        Update your professional information and credentials
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
                              className="bg-neutral-700 border-neutral-600 text-white"
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
                              className="bg-neutral-700 border-neutral-600 text-white"
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
                              className="bg-neutral-700 border-neutral-600 text-white"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="specialization" className="text-gray-300">Specialization</Label>
                            <Input
                              id="specialization"
                              name="specialization"
                              value={profileForm.specialization}
                              onChange={handleProfileChange}
                              className="bg-neutral-700 border-neutral-600 text-white"
                              placeholder="e.g., Psychiatrist, Psychologist, Therapist"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="bio" className="text-gray-300">Professional Bio</Label>
                          <Textarea
                            id="bio"
                            name="bio"
                            value={profileForm.bio}
                            onChange={handleProfileChange}
                            rows={4}
                            className="bg-neutral-700 border-neutral-600 text-white resize-none"
                            placeholder="Describe your professional background, expertise, and approach to mental health care."
                          />
                        </div>

                        <Button type="submit" className="bg-mindful-primary hover:bg-mindful-secondary text-white">
                          Save Changes
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="requests">
                  <Card className="dark-card bg-neutral-800 border-neutral-700">
                    <CardHeader>
                      <CardTitle className="text-white">Patient Consultation Requests</CardTitle>
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
                              <Card key={request.id} className="bg-neutral-800 border-neutral-700 shadow-md relative overflow-hidden">
                                {request.severity === 'high' && (
                                  <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                                )}
                                {request.severity === 'medium' && (
                                  <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
                                )}
                                <CardContent className="p-4">
                                  <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                      <div className="w-12 h-12 rounded-full bg-neutral-700 flex items-center justify-center text-sm">
                                        {request.patientName.charAt(0)}
                                      </div>
                                      <div>
                                        <h4 className="font-medium text-white">{request.patientName}</h4>
                                        <p className="text-xs text-gray-400">{formatDate(request.date)}</p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Badge variant="outline" className="bg-yellow-900/30 text-yellow-400 border-yellow-800">
                                        Pending
                                      </Badge>
                                      {getSeverityBadge(request.severity)}
                                    </div>
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
                  <Card className="dark-card bg-neutral-800 border-neutral-700 mt-6">
                    <CardHeader>
                      <CardTitle className="text-white">Active Patients</CardTitle>
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
                              <Card key={request.id} className="bg-neutral-800 border-neutral-700 shadow-md">
                                <CardContent className="p-4">
                                  <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                      <div className="w-12 h-12 rounded-full bg-neutral-700 flex items-center justify-center text-sm">
                                        {request.patientName.charAt(0)}
                                      </div>
                                      <div>
                                        <h4 className="font-medium text-white">{request.patientName}</h4>
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
                  <Card className="dark-card bg-neutral-800 border-neutral-700 mb-6">
                    <CardHeader>
                      <CardTitle className="text-white">Schedule Appointment</CardTitle>
                      <CardDescription className="text-gray-400">
                        Create a new appointment with one of your patients
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="patient" className="text-gray-300 mb-2 block">Select Patient</Label>
                            <select
                              id="patient"
                              value={selectedPatient}
                              onChange={(e) => setSelectedPatient(e.target.value)}
                              className="w-full bg-neutral-700 border border-neutral-600 rounded-md p-2 text-white"
                            >
                              <option value="">Select a patient</option>
                              {myPatients.map(patient => (
                                <option key={patient.id} value={patient.id}>
                                  {patient.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          
                          <div>
                            <Label className="text-gray-300 mb-2 block">Select Date</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-start text-left font-normal bg-neutral-700 border-neutral-600 text-white">
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {selectedDate ? format(selectedDate, 'PPP') : <span>Pick a date</span>}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0 bg-neutral-800 border-neutral-700 text-white">
                                <Calendar
                                  mode="single"
                                  selected={selectedDate}
                                  onSelect={setSelectedDate}
                                  initialFocus
                                  className="p-3 pointer-events-auto"
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                          
                          <div>
                            <Label htmlFor="appointmentNote" className="text-gray-300 mb-2 block">Session Notes</Label>
                            <Textarea
                              id="appointmentNote"
                              value={appointmentNote}
                              onChange={(e) => setAppointmentNote(e.target.value)}
                              placeholder="Enter any notes for this appointment..."
                              className="bg-neutral-700 border-neutral-600 text-white resize-none"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-4 bg-neutral-700 p-4 rounded-md border border-neutral-600">
                          <h3 className="text-lg font-semibold text-white">Appointment Summary</h3>
                          {selectedPatient ? (
                            <div className="text-gray-300">
                              <p><span className="text-white">Patient:</span> {myPatients.find(pat => pat.id === selectedPatient)?.name}</p>
                              {selectedDate && (
                                <p><span className="text-white">Date:</span> {format(selectedDate, 'MMMM dd, yyyy')}</p>
                              )}
                            </div>
                          ) : (
                            <p className="text-gray-500 italic">Please select a patient and date</p>
                          )}
                          
                          <Button 
                            className="bg-mindful-primary hover:bg-mindful-secondary text-white w-full mt-4"
                            onClick={handleScheduleAppointment}
                            disabled={!selectedPatient || !selectedDate}
                          >
                            Schedule Appointment
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                
                  <Card className="dark-card bg-neutral-800 border-neutral-700">
                    <CardHeader>
                      <CardTitle className="text-white">Upcoming Appointments</CardTitle>
                      <CardDescription className="text-gray-400">
                        Manage your scheduled appointments
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {appointments.filter(apt => apt.status === 'scheduled').length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-gray-400 mb-4">No upcoming appointments scheduled.</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {appointments
                            .filter(apt => apt.status === 'scheduled')
                            .map(appointment => (
                              <Card key={appointment.id} className="bg-neutral-700 border-neutral-600">
                                <CardContent className="p-4">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h4 className="text-white font-medium">{appointment.patientName}</h4>
                                      <p className="text-gray-300 text-sm">{formatDate(new Date(appointment.date))}</p>
                                      {appointment.notes && (
                                        <p className="text-gray-400 mt-2 text-sm italic">{appointment.notes}</p>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Badge className="bg-blue-800 text-white">Upcoming</Badge>
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        className="text-red-400 border-red-800 hover:bg-red-950 hover:text-red-300"
                                        onClick={() => handleCancelAppointment(appointment.id)}
                                      >
                                        <X size={16} className="mr-1" /> Cancel
                                      </Button>
                                      <Button 
                                        size="sm"
                                        className="bg-green-700 hover:bg-green-600 text-white"
                                        onClick={() => handleCompleteAppointment(appointment.id)}
                                      >
                                        <Check size={16} className="mr-1" /> Complete
                                      </Button>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="patients">
                  <Card className="dark-card bg-neutral-800 border-neutral-700">
                    <CardHeader>
                      <CardTitle className="text-white">My Patients</CardTitle>
                      <CardDescription className="text-gray-400">
                        Manage your patient relationships and records
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {myPatients.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-gray-400 mb-4">Start accepting patient requests to build your patient list.</p>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {myPatients.map(patient => (
                            <Card key={patient.id} className="bg-neutral-700 border-neutral-600">
                              <CardContent className="p-4">
                                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-neutral-600 flex items-center justify-center text-lg text-white">
                                      {patient.name.charAt(0)}
                                    </div>
                                    <div>
                                      <h4 className="text-white font-medium">{patient.name}</h4>
                                      <p className="text-gray-400 text-sm">{patient.contactInfo}</p>
                                      <div className="flex items-center gap-2 mt-1">
                                        <Badge className={patient.status === 'active' ? 'bg-green-800 text-white' : 'bg-gray-700 text-gray-300'}>
                                          {patient.status === 'active' ? 'Active' : 'Inactive'}
                                        </Badge>
                                        {patient.lastVisit && (
                                          <span className="text-xs text-gray-400">
                                            Last visit: {formatDate(new Date(patient.lastVisit))}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="flex gap-2">
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
                                </div>
                                
                                <div className="mt-4">
                                  <Label htmlFor={`notes-${patient.id}`} className="text-gray-300 text-sm">Patient Notes</Label>
                                  <div className="flex items-start gap-2 mt-1">
                                    <Textarea
                                      id={`notes-${patient.id}`}
                                      value={patient.notes || ''}
                                      onChange={(e) => {
                                        setMyPatients(prev => 
                                          prev.map(pat => 
                                            pat.id === patient.id ? {...pat, notes: e.target.value} : pat
                                          )
                                        );
                                      }}
                                      placeholder="Add notes about this patient..."
                                      className="bg-neutral-800 border-neutral-600 text-white text-sm resize-none flex-1"
                                      rows={2}
                                    />
                                    <Button 
                                      className="bg-mindful-primary hover:bg-mindful-secondary text-white"
                                      size="sm"
                                      onClick={() => handleAddPatientNote(patient.id, patient.notes || '')}
                                    >
                                      Save Note
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
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
