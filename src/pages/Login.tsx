
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
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPasswordPatient, setShowPasswordPatient] = useState(false);
  const [showPasswordDoctor, setShowPasswordDoctor] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  
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

  const togglePasswordVisibility = (type: 'patient' | 'doctor') => {
    if (type === 'patient') {
      setShowPasswordPatient(!showPasswordPatient);
    } else {
      setShowPasswordDoctor(!showPasswordDoctor);
    }
  };

  const handlePatientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!patientForm.email || !patientForm.password) {
      toast({
        title: "Login Failed",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);

    try {
      const { data, error } = await login(patientForm.email, patientForm.password);
      
      setIsSubmitting(false);
      
      if (error) {
        console.error("Login error:", error);
        let errorMessage = error.message || "Invalid email or password. Please try again.";
        
        // Handle specific errors with more user-friendly messages
        if (errorMessage.includes("Email not confirmed")) {
          errorMessage = "Please check your email and confirm your account, or try again.";
        } else if (errorMessage.includes("Invalid login credentials")) {
          errorMessage = "The email or password you entered is incorrect.";
        }
        
        toast({
          title: "Login Failed",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }
      
      if (data?.user) {
        setLoginSuccess(true);
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } else {
        toast({
          title: "Login Failed",
          description: "Could not authenticate. Please try again.",
          variant: "destructive",
        });
      }
    } catch (err) {
      setIsSubmitting(false);
      console.error("Unexpected login error:", err);
      toast({
        title: "Login Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDoctorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!doctorForm.email || !doctorForm.password) {
      toast({
        title: "Login Failed",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);

    try {
      const { data, error } = await login(doctorForm.email, doctorForm.password);
      
      setIsSubmitting(false);
      
      if (error) {
        console.error("Login error:", error);
        let errorMessage = error.message || "Invalid email or password. Please try again.";
        
        // Handle specific errors with more user-friendly messages
        if (errorMessage.includes("Email not confirmed")) {
          errorMessage = "Please check your email and confirm your account, or try again.";
        } else if (errorMessage.includes("Invalid login credentials")) {
          errorMessage = "The email or password you entered is incorrect.";
        }
        
        toast({
          title: "Login Failed",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }
      
      if (data?.user) {
        setLoginSuccess(true);
        setTimeout(() => {
          navigate("/doctor-dashboard");
        }, 1500);
      } else {
        toast({
          title: "Login Failed",
          description: "Could not authenticate. Please try again.",
          variant: "destructive",
        });
      }
    } catch (err) {
      setIsSubmitting(false);
      console.error("Unexpected login error:", err);
      toast({
        title: "Login Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-gradient-to-b from-neutral-900 to-neutral-800 py-12">
        <div className="w-full max-w-md px-4">
          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-neutral-800/50 backdrop-blur-sm shadow-lg">
              <TabsTrigger value="patient" className="data-[state=active]:bg-mindful-primary data-[state=active]:text-white transition-all duration-300">Patient Login</TabsTrigger>
              <TabsTrigger value="doctor" className="data-[state=active]:bg-mindful-primary data-[state=active]:text-white transition-all duration-300">Doctor Login</TabsTrigger>
            </TabsList>
            
            <TabsContent value="patient" className="space-y-4 animate-fade-in">
              <Card className="shadow-xl border-mindful-accent bg-neutral-800/80 backdrop-blur-sm text-white overflow-hidden rounded-lg transition-all duration-300 hover:shadow-mindful-primary/20">
                <CardHeader className="space-y-1 bg-gradient-to-r from-mindful-primary/10 to-transparent">
                  <CardTitle className="text-2xl font-bold text-center">Patient Login</CardTitle>
                  <CardDescription className="text-center text-gray-400">
                    Enter your credentials to access your account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePatientSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="patient-email" className="text-gray-300">Email</Label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                          <User size={18} />
                        </div>
                        <Input
                          id="patient-email"
                          name="email"
                          type="email"
                          placeholder="name@example.com"
                          value={patientForm.email}
                          onChange={handlePatientChange}
                          required
                          className="bg-neutral-700 border-neutral-600 text-white pl-10 focus:border-mindful-primary focus:ring-mindful-primary/20"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="patient-password" className="text-gray-300">Password</Label>
                        <Link 
                          to="/reset-password" 
                          className="text-sm text-mindful-primary hover:text-mindful-secondary transition-colors"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                          <Lock size={18} />
                        </div>
                        <Input
                          id="patient-password"
                          name="password"
                          type={showPasswordPatient ? "text" : "password"}
                          placeholder="••••••••"
                          value={patientForm.password}
                          onChange={handlePatientChange}
                          required
                          className="bg-neutral-700 border-neutral-600 text-white pl-10 pr-10 focus:border-mindful-primary focus:ring-mindful-primary/20"
                        />
                        <button 
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                          onClick={() => togglePasswordVisibility('patient')}
                        >
                          {showPasswordPatient ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      className="mindful-btn-primary w-full transition-all duration-300 hover:shadow-lg hover:shadow-mindful-primary/20"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <div className="h-5 w-5 rounded-full border-2 border-t-transparent border-white animate-spin mr-2"></div>
                          Logging in...
                        </div>
                      ) : "Sign In"}
                    </Button>
                    <div className="text-center text-sm text-gray-400">
                      Don't have an account?{" "}
                      <Link to="/signup" className="text-mindful-primary hover:text-mindful-secondary font-medium transition-colors">
                        Sign up
                      </Link>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="doctor" className="space-y-4 animate-fade-in">
              <Card className="shadow-xl border-mindful-primary bg-neutral-800/80 backdrop-blur-sm text-white overflow-hidden rounded-lg transition-all duration-300 hover:shadow-mindful-primary/20">
                <CardHeader className="space-y-1 bg-gradient-to-r from-mindful-primary/10 to-transparent">
                  <CardTitle className="text-2xl font-bold text-center">Doctor Login</CardTitle>
                  <CardDescription className="text-center text-gray-400">
                    Login to your professional account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleDoctorSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="doctor-email" className="text-gray-300">Professional Email</Label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                          <User size={18} />
                        </div>
                        <Input
                          id="doctor-email"
                          name="email"
                          type="email"
                          placeholder="doctor@example.com"
                          value={doctorForm.email}
                          onChange={handleDoctorChange}
                          required
                          className="bg-neutral-700 border-neutral-600 text-white pl-10 focus:border-mindful-primary focus:ring-mindful-primary/20"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="doctor-password" className="text-gray-300">Password</Label>
                        <Link 
                          to="/reset-password" 
                          className="text-sm text-mindful-primary hover:text-mindful-secondary transition-colors"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                          <Lock size={18} />
                        </div>
                        <Input
                          id="doctor-password"
                          name="password"
                          type={showPasswordDoctor ? "text" : "password"}
                          placeholder="••••••••"
                          value={doctorForm.password}
                          onChange={handleDoctorChange}
                          required
                          className="bg-neutral-700 border-neutral-600 text-white pl-10 pr-10 focus:border-mindful-primary focus:ring-mindful-primary/20"
                        />
                        <button 
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                          onClick={() => togglePasswordVisibility('doctor')}
                        >
                          {showPasswordDoctor ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      className="bg-mindful-primary hover:bg-mindful-secondary text-white w-full transition-all duration-300 hover:shadow-lg hover:shadow-mindful-primary/20"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <div className="h-5 w-5 rounded-full border-2 border-t-transparent border-white animate-spin mr-2"></div>
                          Logging in...
                        </div>
                      ) : "Sign In"}
                    </Button>
                    <div className="text-center text-sm text-gray-400">
                      Not registered as a doctor?{" "}
                      <Link to="/doctor-signup" className="text-mindful-primary hover:text-mindful-secondary font-medium transition-colors">
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

      {/* Success Dialog */}
      <Dialog open={loginSuccess} onOpenChange={setLoginSuccess}>
        <DialogContent className="bg-neutral-800 text-white border-mindful-primary">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center">Login Successful!</DialogTitle>
            <DialogDescription className="text-center text-gray-300">
              Welcome back to Mindful Grove. Redirecting you to your dashboard...
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-4">
            <div className="h-8 w-8 rounded-full border-2 border-t-transparent border-mindful-primary animate-spin"></div>
          </div>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Login;
