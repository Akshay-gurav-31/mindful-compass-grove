
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import MainLayout from "@/components/layout/MainLayout";

const Signup = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [patientForm, setPatientForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false
  });

  const [doctorForm, setDoctorForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    specialization: "",
    licenseNumber: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false
  });

  const handlePatientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setPatientForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDoctorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setDoctorForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCheckboxChange = (checked: boolean, type: 'patient' | 'doctor') => {
    if (type === 'patient') {
      setPatientForm(prev => ({ ...prev, agreeTerms: checked }));
    } else {
      setDoctorForm(prev => ({ ...prev, agreeTerms: checked }));
    }
  };

  const handlePatientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (patientForm.password !== patientForm.confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please ensure your passwords match",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate signup
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Account Created",
        description: "Welcome to Mindful Grove! You can now log in.",
      });
    }, 1500);
  };

  const handleDoctorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (doctorForm.password !== doctorForm.confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please ensure your passwords match",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate signup
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Professional Application Submitted",
        description: "Thank you for applying. We'll review your credentials and contact you shortly.",
      });
    }, 1500);
  };

  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-mindful-warmNeutral py-12">
        <div className="w-full max-w-md px-4">
          <Tabs defaultValue="patient" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="patient">Patient Signup</TabsTrigger>
              <TabsTrigger value="doctor">Doctor Signup</TabsTrigger>
            </TabsList>
            
            <TabsContent value="patient">
              <Card className="shadow-lg border-mindful-accent">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl font-bold text-center">Create Patient Account</CardTitle>
                  <CardDescription className="text-center">
                    Enter your information to create an account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePatientSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="patient-firstName">First Name</Label>
                        <Input
                          id="patient-firstName"
                          name="firstName"
                          value={patientForm.firstName}
                          onChange={handlePatientChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="patient-lastName">Last Name</Label>
                        <Input
                          id="patient-lastName"
                          name="lastName"
                          value={patientForm.lastName}
                          onChange={handlePatientChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="patient-email">Email</Label>
                      <Input
                        id="patient-email"
                        name="email"
                        type="email"
                        placeholder="name@example.com"
                        value={patientForm.email}
                        onChange={handlePatientChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="patient-password">Password</Label>
                      <Input
                        id="patient-password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        value={patientForm.password}
                        onChange={handlePatientChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="patient-confirmPassword">Confirm Password</Label>
                      <Input
                        id="patient-confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        value={patientForm.confirmPassword}
                        onChange={handlePatientChange}
                        required
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="patient-terms" 
                        checked={patientForm.agreeTerms}
                        onCheckedChange={(checked) => handleCheckboxChange(checked as boolean, 'patient')}
                        required
                      />
                      <Label htmlFor="patient-terms" className="text-sm font-medium leading-none">
                        I agree to the{" "}
                        <Link to="/terms" className="text-mindful-primary hover:text-mindful-secondary">
                          terms of service
                        </Link>{" "}
                        and{" "}
                        <Link to="/privacy" className="text-mindful-primary hover:text-mindful-secondary">
                          privacy policy
                        </Link>
                      </Label>
                    </div>
                    <Button 
                      type="submit" 
                      className="mindful-btn-primary w-full"
                      disabled={isSubmitting || !patientForm.agreeTerms}
                    >
                      {isSubmitting ? "Creating Account..." : "Create Account"}
                    </Button>
                    <div className="text-center text-sm">
                      Already have an account?{" "}
                      <Link to="/login" className="text-mindful-primary hover:text-mindful-secondary font-medium">
                        Sign in
                      </Link>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="doctor">
              <Card className="shadow-lg border-mindful-primary">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl font-bold text-center">Professional Registration</CardTitle>
                  <CardDescription className="text-center">
                    Join our network of mental health professionals
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleDoctorSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="doctor-firstName">First Name</Label>
                        <Input
                          id="doctor-firstName"
                          name="firstName"
                          value={doctorForm.firstName}
                          onChange={handleDoctorChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="doctor-lastName">Last Name</Label>
                        <Input
                          id="doctor-lastName"
                          name="lastName"
                          value={doctorForm.lastName}
                          onChange={handleDoctorChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="doctor-email">Professional Email</Label>
                      <Input
                        id="doctor-email"
                        name="email"
                        type="email"
                        placeholder="doctor@example.com"
                        value={doctorForm.email}
                        onChange={handleDoctorChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="doctor-specialization">Specialization</Label>
                      <Input
                        id="doctor-specialization"
                        name="specialization"
                        placeholder="e.g., Clinical Psychologist, Psychiatrist"
                        value={doctorForm.specialization}
                        onChange={handleDoctorChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="doctor-licenseNumber">License Number</Label>
                      <Input
                        id="doctor-licenseNumber"
                        name="licenseNumber"
                        placeholder="Your professional license number"
                        value={doctorForm.licenseNumber}
                        onChange={handleDoctorChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="doctor-password">Password</Label>
                      <Input
                        id="doctor-password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        value={doctorForm.password}
                        onChange={handleDoctorChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="doctor-confirmPassword">Confirm Password</Label>
                      <Input
                        id="doctor-confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        value={doctorForm.confirmPassword}
                        onChange={handleDoctorChange}
                        required
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="doctor-terms" 
                        checked={doctorForm.agreeTerms}
                        onCheckedChange={(checked) => handleCheckboxChange(checked as boolean, 'doctor')}
                        required
                      />
                      <Label htmlFor="doctor-terms" className="text-sm font-medium leading-none">
                        I agree to the{" "}
                        <Link to="/terms" className="text-mindful-primary hover:text-mindful-secondary">
                          terms of service
                        </Link>{" "}
                        and{" "}
                        <Link to="/privacy" className="text-mindful-primary hover:text-mindful-secondary">
                          privacy policy
                        </Link>
                      </Label>
                    </div>
                    <Button 
                      type="submit" 
                      className="bg-mindful-primary hover:bg-mindful-secondary text-white w-full"
                      disabled={isSubmitting || !doctorForm.agreeTerms}
                    >
                      {isSubmitting ? "Submitting Application..." : "Submit Application"}
                    </Button>
                    <div className="text-center text-sm">
                      Already registered?{" "}
                      <Link to="/login" className="text-mindful-primary hover:text-mindful-secondary font-medium">
                        Sign in
                      </Link>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default Signup;
