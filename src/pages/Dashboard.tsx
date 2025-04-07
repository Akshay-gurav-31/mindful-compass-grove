
import { useState, useEffect, useRef } from "react";
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
import { User, Settings, Calendar as CalendarIcon, Clock, FileText, LogOut, X, Check, Upload, Download, Eye, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

interface AppointmentProps {
  id: string;
  doctorName: string;
  doctorId: string;
  date: Date;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

interface MedicalRecord {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'text';
  uploadDate: Date;
  url: string;
}

const Dashboard = () => {
  const { user, patientData, updateUserProfile, logout, addAppointment, cancelAppointment } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    age: user?.age || "",
    address: user?.address || "",
    bio: user?.bio || ""
  });
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [appointmentNote, setAppointmentNote] = useState<string>("");
  const [medicalHistory, setMedicalHistory] = useState<string>(patientData?.medicalHistory || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Medical records state
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([
    {
      id: "rec1",
      name: "Blood Test Results.pdf",
      type: "pdf",
      uploadDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      url: "#"
    },
    {
      id: "rec2",
      name: "Brain Scan.jpg",
      type: "image",
      uploadDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      url: "#"
    }
  ]);
  
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
        age: user.age || "",
        address: user.address || "",
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
      age: profileForm.age,
      address: profileForm.address,
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
  
  const handleUploadRecord = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      let fileType: 'pdf' | 'image' | 'text' = 'pdf';
      
      if (file.type.includes('image')) {
        fileType = 'image';
      } else if (file.type.includes('text')) {
        fileType = 'text';
      }
      
      const newRecord: MedicalRecord = {
        id: `rec-${Date.now()}`,
        name: file.name,
        type: fileType,
        uploadDate: new Date(),
        url: URL.createObjectURL(file)
      };
      
      setMedicalRecords(prev => [...prev, newRecord]);
      
      toast({
        title: "File Uploaded",
        description: `${file.name} has been uploaded successfully.`
      });
    }
    
    // Clear the input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  const handleDeleteRecord = (recordId: string) => {
    setMedicalRecords(prev => prev.filter(rec => rec.id !== recordId));
    
    toast({
      title: "Record Deleted",
      description: "The medical record has been deleted."
    });
  };
  
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive"
      });
      return;
    }
    
    // Simple validation for demo
    if (newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long.",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, you would call an API to update the password
    toast({
      title: "Password Updated",
      description: "Your password has been changed successfully."
    });
    
    // Clear password fields
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
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
                          <div className="space-y-2">
                            <Label htmlFor="age" className="text-gray-300">Age</Label>
                            <Input
                              id="age"
                              name="age"
                              type="number"
                              value={profileForm.age}
                              onChange={handleProfileChange}
                              className="dark-input"
                            />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="address" className="text-gray-300">Address</Label>
                            <Input
                              id="address"
                              name="address"
                              value={profileForm.address}
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
                      <CardTitle>Your Appointments</CardTitle>
                      <CardDescription className="text-gray-400">
                        Manage your scheduled sessions
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="upcoming" className="w-full">
                        <TabsList className="mb-4 bg-neutral-700">
                          <TabsTrigger value="upcoming" className="data-[state=active]:bg-green-600">
                            Upcoming
                          </TabsTrigger>
                          <TabsTrigger value="past" className="data-[state=active]:bg-blue-600">
                            Past
                          </TabsTrigger>
                          <TabsTrigger value="cancelled" className="data-[state=active]:bg-red-600">
                            Cancelled
                          </TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="upcoming">
                          {patientData?.appointments && patientData.appointments.filter(apt => apt.status === 'scheduled').length > 0 ? (
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
                              <p className="text-gray-400 mb-4">You don't have any upcoming appointments.</p>
                              <Button className="mindful-btn-primary">Book an Appointment</Button>
                            </div>
                          )}
                        </TabsContent>
                        
                        <TabsContent value="past">
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
                            <p className="text-gray-400 text-center py-8">No past appointments found.</p>
                          )}
                        </TabsContent>
                        
                        <TabsContent value="cancelled">
                          {patientData?.appointments && patientData.appointments.filter(apt => apt.status === 'cancelled').length > 0 ? (
                            <div className="space-y-4">
                              {patientData.appointments
                                .filter(apt => apt.status === 'cancelled')
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
                                        <Badge className="bg-red-800 text-white">Cancelled</Badge>
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))}
                            </div>
                          ) : (
                            <p className="text-gray-400 text-center py-8">No cancelled appointments found.</p>
                          )}
                        </TabsContent>
                      </Tabs>
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
                        Upload and manage your medical documents
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-6">
                        <div className="bg-neutral-800 border-2 border-dashed border-neutral-600 rounded-lg p-8 text-center">
                          <Upload className="h-10 w-10 text-neutral-500 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-white mb-2">Upload Medical Records</h3>
                          <p className="text-gray-400 mb-4">Drag and drop files here or click the button below</p>
                          <Button 
                            onClick={handleUploadRecord}
                            className="mindful-btn-primary"
                          >
                            <Upload size={16} className="mr-2" /> Upload Files
                          </Button>
                          <input 
                            type="file" 
                            ref={fileInputRef} 
                            className="hidden" 
                            onChange={handleFileChange}
                          />
                          <p className="text-xs text-gray-500 mt-2">Supported formats: PDF, JPG, PNG, TXT</p>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Your Medical Records</h3>
                        {medicalRecords.length > 0 ? (
                          <div className="space-y-4">
                            {medicalRecords.map(record => (
                              <Card key={record.id} className="bg-neutral-800 border-neutral-700">
                                <CardContent className="p-4">
                                  <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                      {record.type === 'pdf' && <FileText className="text-red-400" size={20} />}
                                      {record.type === 'image' && <Upload className="text-blue-400" size={20} />}
                                      {record.type === 'text' && <FileText className="text-green-400" size={20} />}
                                      <div>
                                        <h4 className="text-white font-medium">{record.name}</h4>
                                        <p className="text-sm text-gray-400">Uploaded on {format(new Date(record.uploadDate), 'MMM dd, yyyy')}</p>
                                      </div>
                                    </div>
                                    <div className="flex gap-2">
                                      <Button variant="outline" size="sm" className="text-blue-400 border-blue-800">
                                        <Eye size={16} className="mr-1" /> View
                                      </Button>
                                      <Button variant="outline" size="sm" className="text-green-400 border-green-800">
                                        <Download size={16} className="mr-1" /> Download
                                      </Button>
                                      <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="text-red-400 border-red-800"
                                        onClick={() => handleDeleteRecord(record.id)}
                                      >
                                        <Trash2 size={16} className="mr-1" /> Delete
                                      </Button>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 bg-neutral-800 rounded-lg">
                            <p className="text-gray-400">You haven't uploaded any medical records yet.</p>
                          </div>
                        )}
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
                    <CardContent className="space-y-8">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">Change Password</h3>
                        <form onSubmit={handlePasswordChange} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="old-password" className="text-gray-300">Current Password</Label>
                            <Input
                              id="old-password"
                              type="password"
                              value={oldPassword}
                              onChange={(e) => setOldPassword(e.target.value)}
                              className="dark-input"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="new-password" className="text-gray-300">New Password</Label>
                            <Input
                              id="new-password"
                              type="password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              className="dark-input"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="confirm-password" className="text-gray-300">Confirm New Password</Label>
                            <Input
                              id="confirm-password"
                              type="password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              className="dark-input"
                              required
                            />
                          </div>
                          <Button type="submit" className="mindful-btn-primary">
                            Update Password
                          </Button>
                        </form>
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">Notification Settings</h3>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="email-notify" className="rounded border-gray-600" defaultChecked />
                            <Label htmlFor="email-notify" className="text-gray-400 text-sm cursor-pointer">
                              Receive email notifications about appointments
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="sms-notify" className="rounded border-gray-600" defaultChecked />
                            <Label htmlFor="sms-notify" className="text-gray-400 text-sm cursor-pointer">
                              Receive SMS reminders for upcoming appointments
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="updates-notify" className="rounded border-gray-600" />
                            <Label htmlFor="updates-notify" className="text-gray-400 text-sm cursor-pointer">
                              Receive product updates and newsletters
                            </Label>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">Privacy Settings</h3>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="data-share" className="rounded border-gray-600" defaultChecked />
                            <Label htmlFor="data-share" className="text-gray-400 text-sm cursor-pointer">
                              Share my data only with my assigned healthcare providers
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="anonymous-data" className="rounded border-gray-600" />
                            <Label htmlFor="anonymous-data" className="text-gray-400 text-sm cursor-pointer">
                              Allow anonymous data usage for service improvement
                            </Label>
                          </div>
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
