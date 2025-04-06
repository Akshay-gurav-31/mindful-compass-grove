
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import MainLayout from "@/components/layout/MainLayout";

const Services = () => {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-mindful-primary text-white py-20">
        <div className="mindful-container text-center">
          <h1 className="hero-heading mb-6">Our Services</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Comprehensive mental health support designed around your individual needs.
          </p>
        </div>
      </section>

      {/* AI Chat Support */}
      <section className="section-padding bg-white">
        <div className="mindful-container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 order-2 md:order-1">
              <h2 className="section-heading text-mindful-darkText">AI Chat Support</h2>
              <p className="text-gray-600">
                Our AI-powered chatbot provides immediate mental health support, helping to identify your needs and guiding you through initial steps.
              </p>
              <ul className="space-y-2 text-gray-600 list-disc list-inside">
                <li>Available 24/7 for immediate support</li>
                <li>Helps identify your mental health needs</li>
                <li>Provides resources for common concerns</li>
                <li>Assists with finding the right professional help</li>
                <li>Completely confidential and secure</li>
              </ul>
              <div className="pt-2">
                <Link to="/signup">
                  <Button className="mindful-btn-primary">Try AI Chat</Button>
                </Link>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden shadow-xl order-1 md:order-2">
              <img 
                src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7" 
                alt="Woman using laptop for AI mental health chat" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Video Consultations */}
      <section className="section-padding bg-mindful-warmNeutral">
        <div className="mindful-container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="rounded-lg overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" 
                alt="Woman in virtual therapy session" 
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="space-y-6">
              <h2 className="section-heading text-mindful-darkText">Video Consultations</h2>
              <p className="text-gray-600">
                Connect face-to-face with mental health professionals through our secure video platform, providing the personal touch of in-person therapy from the comfort of your home.
              </p>
              <ul className="space-y-2 text-gray-600 list-disc list-inside">
                <li>Secure, HIPAA-compliant video platform</li>
                <li>Schedule sessions at your convenience</li>
                <li>Connect with therapists specializing in your specific needs</li>
                <li>Access therapy from anywhere with internet connection</li>
                <li>Options for both scheduled and urgent consultations</li>
              </ul>
              <div className="pt-2">
                <Link to="/signup">
                  <Button className="mindful-btn-primary">Book Video Session</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Therapy */}
      <section className="section-padding bg-white">
        <div className="mindful-container">
          <div className="text-center mb-12">
            <h2 className="section-heading text-mindful-darkText mb-4">Professional Therapy</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our network includes licensed therapists, counselors, and mental health specialists covering a wide range of expertise.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="card-heading">Individual Therapy</CardTitle>
                <CardDescription>One-on-one sessions focused on your needs</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Personalized therapy sessions addressing your specific mental health concerns, goals, and challenges.
                </p>
                <ul className="space-y-1 text-gray-600 list-disc list-inside mb-6">
                  <li>Depression and anxiety</li>
                  <li>Trauma and PTSD</li>
                  <li>Life transitions</li>
                  <li>Grief and loss</li>
                  <li>Stress management</li>
                </ul>
                <Link to="/signup">
                  <Button variant="outline" className="mindful-btn-outline w-full">Learn More</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="card-heading">Couples Therapy</CardTitle>
                <CardDescription>Strengthen your relationship</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Improve communication, resolve conflicts, and build a healthier relationship with professional guidance.
                </p>
                <ul className="space-y-1 text-gray-600 list-disc list-inside mb-6">
                  <li>Communication skills</li>
                  <li>Conflict resolution</li>
                  <li>Rebuilding trust</li>
                  <li>Intimacy issues</li>
                  <li>Parenting conflicts</li>
                </ul>
                <Link to="/signup">
                  <Button variant="outline" className="mindful-btn-outline w-full">Learn More</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="card-heading">Specialized Treatment</CardTitle>
                <CardDescription>Targeted approaches for specific needs</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Evidence-based therapeutic approaches for specific mental health conditions and challenges.
                </p>
                <ul className="space-y-1 text-gray-600 list-disc list-inside mb-6">
                  <li>Cognitive Behavioral Therapy (CBT)</li>
                  <li>Dialectical Behavior Therapy (DBT)</li>
                  <li>EMDR for trauma</li>
                  <li>Mindfulness-based therapies</li>
                  <li>Solution-focused therapy</li>
                </ul>
                <Link to="/signup">
                  <Button variant="outline" className="mindful-btn-outline w-full">Learn More</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Mental Health Resources */}
      <section className="section-padding bg-mindful-highlight">
        <div className="mindful-container">
          <div className="text-center mb-12">
            <h2 className="section-heading text-mindful-darkText mb-4">Mental Health Resources</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Access self-help tools, educational content, and community support to enhance your mental wellbeing.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-mindful-accent flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-mindful-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <CardTitle className="card-heading">Self-Help Library</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">
                  Articles, guides, and worksheets on various mental health topics.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-mindful-accent flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-mindful-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <CardTitle className="card-heading">Video Workshops</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">
                  Educational videos on mental health skills and wellbeing practices.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-mindful-accent flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-mindful-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <CardTitle className="card-heading">Support Groups</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">
                  Virtual groups for shared experiences and peer support.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-mindful-accent flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-mindful-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <CardTitle className="card-heading">Assessment Tools</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">
                  Self-assessment questionnaires to track your mental wellbeing.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-mindful-primary text-white">
        <div className="mindful-container text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-6">Start Your Mental Health Journey Today</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Take the first step towards better mental health with Mindful Grove's supportive services.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/signup">
              <Button className="bg-white text-mindful-primary hover:bg-mindful-accent hover:text-mindful-primary transition-colors">
                Sign Up Now
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" className="border-white text-white hover:bg-white/10 transition-colors">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Services;
