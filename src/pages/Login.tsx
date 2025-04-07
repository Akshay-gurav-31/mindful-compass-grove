
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get the user type from location state (if redirected from signup)
  const defaultTab = location.state?.userType || "patient";

  const [patientForm, setPatientForm] = useState({
    email: "",
    password: "",
  });

  const [doctorForm, setDoctorForm] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handlePatientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPatientForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDoctorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDoctorForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePatientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate login (in a real app, this would be an API call)
    setTimeout(() => {
      setIsSubmitting(false);
      
      // Create a mock user for demo purposes
      const user = {
        id: "p123",
        email: patientForm.email,
        name: patientForm.email.split('@')[0],
        type: 'patient' as const,
      };
      
      login(user);
      
      toast({
        title: "Login Successful",
        description: "Welcome back to Mindful Grove!",
      });
      
      navigate("/dashboard");
    }, 1500);
  };

  const handleDoctorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate login
    setTimeout(() => {
      setIsSubmitting(false);
      
      // Create a mock user for demo purposes
      const user = {
        id: "d456",
        email: doctorForm.email,
        name: "Dr. " + doctorForm.email.split('@')[0],
        type: 'doctor' as const,
      };
      
      login(user);
      
      toast({
        title: "Professional Login Successful",
        description: "Welcome back to the Mindful Grove professional portal!",
      });
      
      navigate("/dashboard");
    }, 1500);
  };

  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-neutral-900 py-12">
        <div className="w-full max-w-md px-4">
          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-neutral-800">
              <TabsTrigger value="patient" className="data-[state=active]:bg-mindful-primary data-[state=active]:text-white">Patient Login</TabsTrigger>
              <TabsTrigger value="doctor" className="data-[state=active]:bg-mindful-primary data-[state=active]:text-white">Doctor Login</TabsTrigger>
            </TabsList>
            
            <TabsContent value="patient">
              <Card className="shadow-lg border-mindful-accent bg-neutral-800 text-white">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl font-bold text-center">Patient Login</CardTitle>
                  <CardDescription className="text-center text-gray-400">
                    Enter your credentials to access your account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePatientSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="patient-email" className="text-gray-300">Email</Label>
                      <Input
                        id="patient-email"
                        name="email"
                        type="email"
                        placeholder="name@example.com"
                        value={patientForm.email}
                        onChange={handlePatientChange}
                        required
                        className="bg-neutral-700 border-neutral-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="patient-password" className="text-gray-300">Password</Label>
                        <Link 
                          to="/reset-password" 
                          className="text-sm text-mindful-primary hover:text-mindful-secondary"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <Input
                        id="patient-password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        value={patientForm.password}
                        onChange={handlePatientChange}
                        required
                        className="bg-neutral-700 border-neutral-600 text-white"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="mindful-btn-primary w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Logging in..." : "Sign In"}
                    </Button>
                    <div className="text-center text-sm text-gray-400">
                      Don't have an account?{" "}
                      <Link to="/signup" className="text-mindful-primary hover:text-mindful-secondary font-medium">
                        Sign up
                      </Link>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="doctor">
              <Card className="shadow-lg border-mindful-primary bg-neutral-800 text-white">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl font-bold text-center">Doctor Login</CardTitle>
                  <CardDescription className="text-center text-gray-400">
                    Login to your professional account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleDoctorSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="doctor-email" className="text-gray-300">Professional Email</Label>
                      <Input
                        id="doctor-email"
                        name="email"
                        type="email"
                        placeholder="doctor@example.com"
                        value={doctorForm.email}
                        onChange={handleDoctorChange}
                        required
                        className="bg-neutral-700 border-neutral-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="doctor-password" className="text-gray-300">Password</Label>
                        <Link 
                          to="/reset-password" 
                          className="text-sm text-mindful-primary hover:text-mindful-secondary"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <Input
                        id="doctor-password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        value={doctorForm.password}
                        onChange={handleDoctorChange}
                        required
                        className="bg-neutral-700 border-neutral-600 text-white"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="bg-mindful-primary hover:bg-mindful-secondary text-white w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Logging in..." : "Sign In"}
                    </Button>
                    <div className="text-center text-sm text-gray-400">
                      Not registered as a doctor?{" "}
                      <Link to="/doctor-signup" className="text-mindful-primary hover:text-mindful-secondary font-medium">
                        Apply here
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

export default Login;
