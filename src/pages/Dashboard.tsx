
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { User, Settings, Calendar as CalendarIcon, Clock, FileText, LogOut, X, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface AppointmentProps {
  id: string;
  doctorName: string;
  doctorId: string;
  date: Date;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

const Dashboard = () => {
  const { user, patientData, updateUserProfile, logout, addAppointment, cancelAppointment } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    bio: user?.bio || ""
  });
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [appointmentNote, setAppointmentNote] = useState<string>("");
  const [medicalHistory, setMedicalHistory] = useState<string>(patientData?.medicalHistory || "");
  
  // Sample doctors for booking appointments
  const availableDoctors = [
    { id: "dr-smith", name: "Dr. Smith", specialization: "Psychiatrist" },
    { id: "dr-jones", name: "Dr. Jones", specialization: "Psychologist" },
    { id: "dr-williams", name: "Dr. Williams", specialization: "Therapist" }
  ];

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        bio: user.bio || ""
      });
    }
    
    if (patientData) {
      setMedicalHistory(patientData.medicalHistory || "");
    }
  }, [user, patientData]);

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
      bio: profileForm.bio
    });
    
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved."
    });
  };
  
  const handleBookAppointment = () => {
    if (!selectedDate || !selectedDoctor) {
      toast({
        title: "Missing Information",
        description: "Please select a date and doctor.",
        variant: "destructive"
      });
      return;
    }
    
    const doctor = availableDoctors.find(doc => doc.id === selectedDoctor);
    
    if (!doctor) {
      toast({
        title: "Error",
        description: "Selected doctor not found.",
        variant: "destructive"
      });
      return;
    }
    
    const newAppointment = {
      id: `apt-${Date.now()}`,
      doctorId: doctor.id,
      patientId: user?.id || "",
      doctorName: doctor.name,
      patientName: user?.name || "",
      date: selectedDate,
      status: 'scheduled' as const,
      notes: appointmentNote
    };
    
    addAppointment(newAppointment);
    
    toast({
      title: "Appointment Booked",
      description: `Your appointment with ${doctor.name} on ${format(selectedDate, 'MMMM dd, yyyy')} has been scheduled.`
    });
    
    // Reset form fields
    setSelectedDate(undefined);
    setSelectedDoctor("");
    setAppointmentNote("");
  };
  
  const handleCancelAppointment = (appointmentId: string) => {
    cancelAppointment(appointmentId);
    
    toast({
      title: "Appointment Cancelled",
      description: "Your appointment has been cancelled."
    });
  };
  
  const handleSaveMedicalHistory = () => {
    if (patientData) {
      const updatedPatientData = {
        ...patientData,
        medicalHistory
      };
      
      // Update in local storage
      localStorage.setItem('mindfulGrovePatient', JSON.stringify(updatedPatientData));
      
      toast({
        title: "Medical History Updated",
        description: "Your medical history has been saved."
      });
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
                      <CalendarIcon size={18} />
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
                  <TabsTrigger value="history" className="data-[state=active]:bg-mindful-primary data-[state=active]:text-white">
                    Medical History
                  </TabsTrigger>
                  <TabsTrigger value="records" className="data-[state=active]:bg-mindful-primary data-[state=active]:text-white">
                    Records
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
                  <Card className="dark-card mb-6">
                    <CardHeader>
                      <CardTitle>Book New Appointment</CardTitle>
                      <CardDescription className="text-gray-400">
                        Schedule a consultation with a mental health professional
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="doctor" className="text-gray-300 mb-2 block">Select Doctor</Label>
                            <select
                              id="doctor"
                              value={selectedDoctor}
                              onChange={(e) => setSelectedDoctor(e.target.value)}
                              className="w-full bg-neutral-800 border border-neutral-700 rounded-md p-2 text-gray-300"
                            >
                              <option value="">Select a doctor</option>
                              {availableDoctors.map(doctor => (
                                <option key={doctor.id} value={doctor.id}>
                                  {doctor.name} - {doctor.specialization}
                                </option>
                              ))}
                            </select>
                          </div>
                          
                          <div>
                            <Label className="text-gray-300 mb-2 block">Select Date</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-start text-left font-normal bg-neutral-800 border-neutral-700 text-gray-300">
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
                            <Label htmlFor="note" className="text-gray-300 mb-2 block">Additional Notes</Label>
                            <Textarea
                              id="note"
                              value={appointmentNote}
                              onChange={(e) => setAppointmentNote(e.target.value)}
                              placeholder="Describe your concerns..."
                              className="dark-input resize-none"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-4 bg-neutral-800 p-4 rounded-md border border-neutral-700">
                          <h3 className="text-lg font-semibold text-gray-300">Appointment Summary</h3>
                          {selectedDoctor ? (
                            <div className="text-gray-400">
                              <p><span className="text-gray-300">Doctor:</span> {availableDoctors.find(doc => doc.id === selectedDoctor)?.name}</p>
                              {selectedDate && (
                                <p><span className="text-gray-300">Date:</span> {format(selectedDate, 'MMMM dd, yyyy')}</p>
                              )}
                            </div>
                          ) : (
                            <p className="text-gray-500 italic">Please select a doctor and date</p>
                          )}
                          
                          <Button 
                            className="mindful-btn-primary w-full mt-4"
                            onClick={handleBookAppointment}
                            disabled={!selectedDoctor || !selectedDate}
                          >
                            Book Appointment
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="dark-card">
                    <CardHeader>
                      <CardTitle>Your Upcoming Appointments</CardTitle>
                      <CardDescription className="text-gray-400">
                        Manage your scheduled sessions
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {patientData?.appointments && patientData.appointments.length > 0 ? (
                        <div className="space-y-4">
                          {patientData.appointments
                            .filter(apt => apt.status === 'scheduled')
                            .map((appointment) => (
                              <Card key={appointment.id} className="bg-neutral-800 border-neutral-700">
                                <CardContent className="p-4">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h4 className="text-white font-medium">{appointment.doctorName}</h4>
                                      <p className="text-gray-400 text-sm">{format(new Date(appointment.date), 'MMMM dd, yyyy')}</p>
                                      {appointment.notes && (
                                        <p className="text-gray-400 mt-2 text-sm italic">{appointment.notes}</p>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-4">
                                      <Badge className="bg-green-800 text-white">Scheduled</Badge>
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        className="text-red-400 border-red-800 hover:bg-red-950 hover:text-red-300"
                                        onClick={() => handleCancelAppointment(appointment.id)}
                                      >
                                        <X size={16} className="mr-1" /> Cancel
                                      </Button>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-gray-400 mb-4">You don't have any appointments scheduled yet.</p>
                          <Button className="mindful-btn-primary">Book Your First Consultation</Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="history">
                  <Card className="dark-card">
                    <CardHeader>
                      <CardTitle>Medical History</CardTitle>
                      <CardDescription className="text-gray-400">
                        Keep track of your mental health journey
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="medicalHistory" className="text-gray-300">Your Medical History</Label>
                        <Textarea
                          id="medicalHistory"
                          value={medicalHistory}
                          onChange={(e) => setMedicalHistory(e.target.value)}
                          placeholder="Record your mental health history, past diagnoses, treatments, etc."
                          className="dark-input resize-none"
                          rows={8}
                        />
                        <Button 
                          className="mindful-btn-primary mt-2"
                          onClick={handleSaveMedicalHistory}
                        >
                          Save Medical History
                        </Button>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold text-gray-300 mb-4">Past Consultations</h3>
                        {patientData?.appointments && patientData.appointments.filter(apt => apt.status === 'completed').length > 0 ? (
                          <div className="space-y-4">
                            {patientData.appointments
                              .filter(apt => apt.status === 'completed')
                              .map((appointment) => (
                                <Card key={appointment.id} className="bg-neutral-800 border-neutral-700">
                                  <CardContent className="p-4">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <h4 className="text-white font-medium">{appointment.doctorName}</h4>
                                        <p className="text-gray-400 text-sm">{format(new Date(appointment.date), 'MMMM dd, yyyy')}</p>
                                        {appointment.notes && (
                                          <p className="text-gray-400 mt-2 text-sm">{appointment.notes}</p>
                                        )}
                                      </div>
                                      <Badge className="bg-blue-800 text-white">Completed</Badge>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                          </div>
                        ) : (
                          <p className="text-gray-400 text-center py-4">No past consultations found.</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="records">
                  <Card className="dark-card">
                    <CardHeader>
                      <CardTitle>Medical Records</CardTitle>
                      <CardDescription className="text-gray-400">
                        View and manage your mental health records
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-300 mb-4">Your Diagnoses</h3>
                          <Card className="bg-neutral-800 border-neutral-700">
                            <CardContent className="p-4 text-center">
                              <p className="text-gray-400 py-4">No diagnoses have been recorded yet. They will appear here after your doctor updates your records.</p>
                            </CardContent>
                          </Card>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold text-gray-300 mb-4">Treatment Plans</h3>
                          <Card className="bg-neutral-800 border-neutral-700">
                            <CardContent className="p-4 text-center">
                              <p className="text-gray-400 py-4">No treatment plans have been recorded yet. They will appear here after your doctor creates one.</p>
                            </CardContent>
                          </Card>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold text-gray-300 mb-4">Progress Notes</h3>
                          <Card className="bg-neutral-800 border-neutral-700">
                            <CardContent className="p-4 text-center">
                              <p className="text-gray-400 py-4">No progress notes have been recorded yet. Your doctor will update these after each session.</p>
                            </CardContent>
                          </Card>
                        </div>
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
                      
                      <div className="space-y-2">
                        <Label className="text-gray-300">Privacy Settings</Label>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="data-share" className="rounded border-gray-600" checked />
                          <Label htmlFor="data-share" className="text-gray-400 text-sm cursor-pointer">
                            Share my data only with my assigned healthcare providers
                          </Label>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-neutral-700">
                        <Button 
                          variant="destructive" 
                          className="bg-red-900 hover:bg-red-800 text-white"
                          onClick={() => {
                            toast({
                              title: "Account Action",
                              description: "To delete your account, please contact support for assistance.",
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
