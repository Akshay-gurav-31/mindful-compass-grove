
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import MainLayout from "@/components/layout/MainLayout";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Message Sent",
        description: "Thank you for reaching out. We'll respond shortly.",
      });
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    }, 1500);
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-mindful-primary text-white py-20">
        <div className="mindful-container text-center">
          <h1 className="hero-heading mb-6">Contact Us</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Have questions or need assistance? We're here to help. Reach out to our team.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="section-padding bg-white">
        <div className="mindful-container">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="space-y-8">
              <div>
                <h2 className="section-heading text-mindful-darkText mb-6">Get in Touch</h2>
                <p className="text-gray-600 mb-6">
                  We'd love to hear from you. Whether you have questions about our services, need support, or are interested in partnerships, our team is ready to assist.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <Card className="border-l-4 border-l-mindful-primary">
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold mb-2">General Inquiries</h3>
                    <p className="text-gray-600 mb-1">Email: info@mindfulgrove.com</p>
                    <p className="text-gray-600">Phone: (555) 123-4567</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-mindful-secondary">
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold mb-2">Support</h3>
                    <p className="text-gray-600 mb-1">Email: support@mindfulgrove.com</p>
                    <p className="text-gray-600">Phone: (555) 987-6543</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-mindful-blue">
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold mb-2">Partnerships</h3>
                    <p className="text-gray-600 mb-1">Email: partners@mindfulgrove.com</p>
                    <p className="text-gray-600">Phone: (555) 456-7890</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-mindful-accent">
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold mb-2">Media Inquiries</h3>
                    <p className="text-gray-600 mb-1">Email: media@mindfulgrove.com</p>
                    <p className="text-gray-600">Phone: (555) 234-5678</p>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">Office Hours</h3>
                <p className="text-gray-600 mb-1">Monday - Friday: 9:00 AM - 6:00 PM EST</p>
                <p className="text-gray-600">Saturday: 10:00 AM - 2:00 PM EST</p>
                <p className="text-gray-600">Sunday: Closed</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">Follow Us</h3>
                <div className="flex space-x-4">
                  <a href="https://www.linkedin.com/in/akshay--gurav/" target="_blank" rel="noopener noreferrer" className="text-mindful-primary hover:text-mindful-secondary">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                  <a href="https://www.instagram.com/akshay._.gurav" target="_blank" rel="noopener noreferrer" className="text-mindful-primary hover:text-mindful-secondary">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            <div>
              <Card className="shadow-md">
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-semibold mb-6">Send Us a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Your Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="What is this regarding?"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Your message..."
                        rows={5}
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="mindful-btn-primary w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-mindful-warmNeutral">
        <div className="mindful-container">
          <div className="text-center mb-12">
            <h2 className="section-heading text-mindful-darkText mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about our services.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="shadow-sm">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-2">How quickly can I connect with a mental health professional?</h3>
                <p className="text-gray-600">
                  Depending on availability and urgency, you can typically connect with a professional within 24-48 hours of completing our matching process.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-2">Is my information kept confidential?</h3>
                <p className="text-gray-600">
                  Yes, we adhere to strict privacy standards. All your personal information and conversations are encrypted and kept confidential.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-2">What types of mental health issues do you support?</h3>
                <p className="text-gray-600">
                  Our platform supports a wide range of mental health concerns including anxiety, depression, stress, trauma, relationship issues, and more.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-2">Can I use my insurance for services?</h3>
                <p className="text-gray-600">
                  Many of our professionals accept insurance. During the matching process, we can help you find providers who work with your insurance plan.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-2">How do the AI chat and human professional services work together?</h3>
                <p className="text-gray-600">
                  Our AI chat provides initial support and helps identify your needs. Based on this assessment, we can connect you with the right human professional for more in-depth support.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-2">What if I'm not satisfied with my matched professional?</h3>
                <p className="text-gray-600">
                  Your satisfaction is important to us. If you're not comfortable with your matched professional, we'll help you find a better fit at no additional cost.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Contact;
