
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import MainLayout from "@/components/layout/MainLayout";
import { Loader2, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PatientRequestForm from "@/components/PatientRequestForm";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const Chatbot = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi there! I'm your mental health assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Keywords that might indicate a serious issue requiring professional help
  const seriousKeywords = ["suicide", "kill", "die", "end my life", "severe", "emergency", "extreme", "unbearable", "hopeless", "intense pain", "crisis"];
  
  // Check if message contains any serious keywords
  const containsSeriousKeywords = (message: string) => {
    const lowercaseMsg = message.toLowerCase();
    return seriousKeywords.some(keyword => lowercaseMsg.includes(keyword));
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Check if message contains serious keywords
    const hasSeriousContent = containsSeriousKeywords(input);

    try {
      // Call to Groq API
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer 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"
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: "You are a compassionate mental health assistant at Mindful Grove. Provide supportive, thoughtful responses to people experiencing mental health challenges. Never diagnose, but guide users toward professional help when appropriate. Keep responses concise and under 150 words."
            },
            ...messages.map(msg => ({
              role: msg.sender === "user" ? "user" : "assistant",
              content: msg.text
            })),
            {
              role: "user",
              content: input
            }
          ]
        })
      });

      const data = await response.json();
      
      if (data.choices && data.choices[0]) {
        const botResponse = data.choices[0].message.content;
        
        const botMessage: Message = {
          id: messages.length + 2,
          text: botResponse,
          sender: "bot",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, botMessage]);

        // If serious content was detected, suggest professional help
        if (hasSeriousContent) {
          setTimeout(() => {
            const recommendationMessage: Message = {
              id: messages.length + 3,
              text: "I notice you might be dealing with something serious. Would you like to connect with one of our professional therapists? They're better equipped to help with these concerns.",
              sender: "bot",
              timestamp: new Date(),
            };
            setMessages((prev) => [...prev, recommendationMessage]);
          }, 1000);
        }
      } else {
        throw new Error("Invalid response from AI");
      }
    } catch (error) {
      console.error("Error calling Groq API:", error);
      
      // Fallback message if API fails
      const fallbackMessage: Message = {
        id: messages.length + 2,
        text: "I'm sorry, I'm having trouble connecting right now. Please try again later or contact one of our mental health professionals for immediate assistance.",
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, fallbackMessage]);
      
      toast({
        title: "Connection Error",
        description: "Could not connect to our AI service. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsTyping(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleRequestSent = () => {
    setShowRequestForm(false);
    toast({
      title: "Request Sent Successfully",
      description: "A therapist will review your request and contact you soon.",
    });
  };

  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-220px)] bg-neutral-900 py-8 text-white">
        <div className="mindful-container flex flex-col space-y-8 max-w-4xl">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">AI Support Chat</h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Chat with our AI assistant to get immediate support and guidance for your mental health concerns.
            </p>
          </div>

          {showRequestForm ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Request Professional Help</h2>
                <Button 
                  variant="outline" 
                  className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800"
                  onClick={() => setShowRequestForm(false)}
                >
                  Back to Chat
                </Button>
              </div>
              <PatientRequestForm onRequestSent={handleRequestSent} />
            </div>
          ) : (
            <Card className="shadow-md flex flex-col h-[600px] bg-neutral-800 border-neutral-700">
              <CardContent className="flex flex-col h-full p-0">
                <div className="bg-mindful-primary text-white py-3 px-4 rounded-t-lg flex items-center">
                  <div className="w-3 h-3 bg-mindful-accent rounded-full mr-2 animate-pulse"></div>
                  <span>Mindful Grove Assistant</span>
                  <span className="ml-auto text-sm opacity-80">Online</span>
                </div>
                
                <div className="flex-grow overflow-y-auto p-4 bg-neutral-800">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.sender === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-xs sm:max-w-md rounded-lg p-3 ${
                            message.sender === "user"
                              ? "bg-mindful-primary text-white rounded-br-none"
                              : "bg-neutral-700 text-white rounded-bl-none"
                          }`}
                        >
                          <p>{message.text}</p>
                          <div className={`text-xs mt-1 ${message.sender === "user" ? "text-green-200" : "text-gray-400"}`}>
                            {formatTime(message.timestamp)}
                          </div>
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-neutral-700 text-white rounded-lg rounded-bl-none p-3 max-w-xs sm:max-w-md">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-mindful-primary rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-mindful-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                            <div className="w-2 h-2 bg-mindful-primary rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                <div className="p-4 border-t border-neutral-700">
                  <form onSubmit={handleSendMessage} className="flex space-x-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Type your message here..."
                      className="flex-grow bg-neutral-700 border-neutral-600 text-white"
                      disabled={isTyping}
                    />
                    <Button 
                      type="submit" 
                      className="mindful-btn-primary"
                      disabled={isTyping}
                    >
                      {isTyping ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send"}
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="text-center">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                onClick={() => setShowRequestForm(true)}
                className="mindful-btn-secondary flex items-center gap-2"
              >
                <AlertTriangle className="h-4 w-4" />
                Connect with a Professional
              </Button>
              
              <Button
                onClick={() => navigate('/dashboard')}
                variant="outline"
                className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Go to Dashboard
              </Button>
            </div>
            
            <p className="text-sm text-gray-400 mt-4">
              If you're experiencing a mental health emergency, please call emergency services immediately.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Chatbot;
