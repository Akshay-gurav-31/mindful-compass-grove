
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import MainLayout from "@/components/layout/MainLayout";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const Chatbot = () => {
  const { toast } = useToast();
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sample bot responses for demo purposes
  const botResponses = [
    "I understand how you're feeling. Can you tell me more about that?",
    "That sounds challenging. Have you experienced this before?",
    "I'm here to help. What specific aspects of this are most troubling for you?",
    "Thank you for sharing that with me. How long have you been feeling this way?",
    "I think it might be helpful to connect you with one of our professionals. Would you like me to arrange that?",
    "Have you tried any coping strategies that have worked for you in the past?",
    "It's important to remember that you're not alone in these feelings.",
    "Would it help to talk about some self-care techniques that might be useful?",
    "I'm noticing that this might be something that requires more specialized support. Would you like me to help you find a therapist?",
    "How have these feelings been affecting your daily life?",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
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

    // Simulate bot thinking and response
    setTimeout(() => {
      const randomResponse =
        botResponses[Math.floor(Math.random() * botResponses.length)];
      
      const botMessage: Message = {
        id: messages.length + 2,
        text: randomResponse,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-220px)] bg-mindful-warmNeutral py-8">
        <div className="mindful-container flex flex-col space-y-8 max-w-4xl">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-mindful-darkText mb-4">AI Support Chat</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Chat with our AI assistant to get immediate support and guidance for your mental health concerns.
            </p>
          </div>

          <Card className="shadow-md flex flex-col h-[600px]">
            <CardContent className="flex flex-col h-full p-0">
              <div className="bg-mindful-primary text-white py-3 px-4 rounded-t-lg flex items-center">
                <div className="w-3 h-3 bg-mindful-accent rounded-full mr-2 animate-pulse"></div>
                <span>Mindful Grove Assistant</span>
                <span className="ml-auto text-sm opacity-80">Online</span>
              </div>
              
              <div className="flex-grow overflow-y-auto p-4 bg-white">
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
                            : "bg-mindful-accent text-mindful-darkText rounded-bl-none"
                        }`}
                      >
                        <p>{message.text}</p>
                        <div className={`text-xs mt-1 ${message.sender === "user" ? "text-mindful-accent" : "text-mindful-primary"}`}>
                          {formatTime(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-mindful-accent text-mindful-darkText rounded-lg rounded-bl-none p-3 max-w-xs sm:max-w-md">
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

              <div className="p-4 border-t">
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message here..."
                    className="flex-grow"
                  />
                  <Button type="submit" className="mindful-btn-primary">
                    Send
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <p className="text-sm text-gray-500 mb-4">
              Need more personalized help? Our professional therapists are available.
            </p>
            <Button
              onClick={() => 
                toast({
                  title: "Feature Coming Soon",
                  description: "Professional consultation booking will be available soon.",
                })
              }
              className="mindful-btn-secondary"
            >
              Connect with a Professional
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Chatbot;
