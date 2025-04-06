import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import MainLayout from "@/components/layout/MainLayout";

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [patientForm, setPatientForm] = useState({
    email: "",
    password: "",
  });

  const [doctorForm, setDoctorForm] = useState({
    email: "",
    password: "",
  });

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

    // Simulate login
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Login Successful",
        description: "Welcome back to Mindful Grove!",
      });
      navigate("/dashboard"); // Redirect to dashboard after successful login
    }, 1500);
  };

  const handleDoctorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate login
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Professional Login Successful",
        description: "Welcome back to the Mindful Grove professional portal!",
      });
      navigate("/dashboard"); // Redirect to dashboard after successful login
    }, 1500);
  };

  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-mindful-warmNeutral py-12">
        <div className="w-full max-w-md px-4">
          <Tabs defaultValue="patient" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="patient">Patient Login</TabsTrigger>
              <TabsTrigger value="doctor">Doctor Login</TabsTrigger>
            </TabsList>
            
            <TabsContent value="patient">
              <Card className="shadow-lg border-mindful-accent">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl font-bold text-center">Patient Login</CardTitle>
                  <CardDescription className="text-center">
                    Enter your credentials to access your account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePatientSubmit} className="space-y-4">
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
                      <div className="flex items-center justify-between">
                        <Label htmlFor="patient-password">Password</Label>
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
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="mindful-btn-primary w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Logging in..." : "Sign In"}
                    </Button>
                    <div className="text-center text-sm">
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
              <Card className="shadow-lg border-mindful-primary">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl font-bold text-center">Doctor Login</CardTitle>
                  <CardDescription className="text-center">
                    Login to your professional account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleDoctorSubmit} className="space-y-4">
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
                      <div className="flex items-center justify-between">
                        <Label htmlFor="doctor-password">Password</Label>
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
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="bg-mindful-primary hover:bg-mindful-secondary text-white w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Logging in..." : "Sign In"}
                    </Button>
                    <div className="text-center text-sm">
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
