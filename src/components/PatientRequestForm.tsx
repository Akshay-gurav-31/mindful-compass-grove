
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface PatientRequestFormProps {
  onRequestSent?: () => void;
}

export interface PatientRequestData {
  id: string;
  userId: string;
  patientName: string;
  patientId: string;
  message: string;
  severity: "low" | "medium" | "high";
  status: 'pending' | 'accepted' | 'rejected';
  date: Date;
  timestamp: string;
}

const PatientRequestForm = ({ onRequestSent }: PatientRequestFormProps) => {
  const { user, patientData } = useAuth();
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<"low" | "medium" | "high">("medium");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Create a new request object
    const newRequest: PatientRequestData = {
      id: `req-${Date.now()}`,
      userId: user?.id || 'anonymous',
      patientName: user?.name || 'Anonymous',
      patientId: user?.id || 'Not logged in',
      message,
      severity,
      status: 'pending' as const,
      date: new Date(),
      timestamp: new Date().toISOString()
    };

    // Create text representation of the request
    const requestText = `
PATIENT REQUEST DETAILS
======================
Date: ${new Date().toLocaleString()}
Patient: ${user?.name || 'Anonymous'}
Patient ID: ${user?.id || 'Not logged in'}
Urgency: ${severity.toUpperCase()}

Message:
${message}

======================
    `.trim();

    // Save to localStorage for record keeping
    const existingRequests = localStorage.getItem('patientRequests');
    const requests = existingRequests ? JSON.parse(existingRequests) : [];
    
    // Check for duplicate requests
    const isDuplicate = requests.some(
      (req: PatientRequestData) => 
        req.userId === newRequest.userId && 
        req.message === newRequest.message &&
        Math.abs(new Date(req.timestamp).getTime() - new Date(newRequest.timestamp).getTime()) < 300000 // Within 5 minutes
    );
    
    if (!isDuplicate) {
      requests.push(newRequest);
      localStorage.setItem('patientRequests', JSON.stringify(requests));
      
      // Also save to doctor's requests in localStorage if assigned doctor exists
      if (patientData?.doctor) {
        const doctorRequestsKey = `doctorRequests-${patientData.doctor}`;
        const existingDoctorRequests = localStorage.getItem(doctorRequestsKey);
        const doctorRequests = existingDoctorRequests ? JSON.parse(existingDoctorRequests) : [];
        doctorRequests.push(newRequest);
        localStorage.setItem(doctorRequestsKey, JSON.stringify(doctorRequests));
      }
      
      // Log the request instead of downloading
      console.log("Patient request saved:", newRequest);
      
      toast({
        title: "Request Sent",
        description: "Your request has been sent to available doctors.",
      });
      
      setMessage("");
      
      if (onRequestSent) {
        onRequestSent();
      }
    } else {
      toast({
        title: "Request Already Sent",
        description: "A similar request was recently submitted.",
      });
    }
    
    setIsSubmitting(false);
  };

  return (
    <Card className="dark-card bg-neutral-800 border-neutral-700">
      <CardHeader>
        <CardTitle className="text-white">Request Professional Help</CardTitle>
        <CardDescription className="text-gray-400">
          Describe your concern and a doctor will be assigned to help you
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="message" className="text-gray-300">
              Describe your concern
            </Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Please describe what you're experiencing..."
              className="h-32 bg-neutral-700 border-neutral-600 text-white"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="severity" className="text-gray-300">
              Urgency Level
            </Label>
            <Select 
              value={severity} 
              onValueChange={(value) => setSeverity(value as "low" | "medium" | "high")}
            >
              <SelectTrigger className="bg-neutral-700 border-neutral-600 text-white">
                <SelectValue placeholder="Select urgency level" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-700 border-neutral-600 text-white">
                <SelectItem value="low">Low - Can wait a few days</SelectItem>
                <SelectItem value="medium">Medium - Need help soon</SelectItem>
                <SelectItem value="high">High - Urgent assistance needed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-mindful-primary hover:bg-mindful-secondary text-white"
            disabled={isSubmitting || !message.trim()}
          >
            {isSubmitting ? "Sending..." : "Send Request"}
          </Button>
          
          <div className="text-xs text-gray-400 text-center">
            For emergencies requiring immediate intervention, please call emergency services.
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PatientRequestForm;
