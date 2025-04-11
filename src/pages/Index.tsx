
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { isAuthenticated, userType } = useAuth();
  
  return (
    <MainLayout>
      <div className="bg-gradient-to-b from-neutral-900 to-neutral-800 text-white">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                <span className="text-mindful-primary">Healthcare</span> Made Accessible Through Technology
              </h1>
              <p className="text-xl mb-8 text-gray-300">
                Connecting patients and healthcare professionals with AI-powered tools for better mental wellbeing.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {isAuthenticated ? (
                  <Link to={userType === "doctor" ? "/doctor-dashboard" : "/dashboard"}>
                    <Button className="bg-mindful-primary hover:bg-mindful-secondary text-white px-8 py-6 text-lg">
                      Go to Dashboard
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/signup">
                      <Button className="bg-mindful-primary hover:bg-mindful-secondary text-white px-8 py-6 text-lg">
                        Get Started
                      </Button>
                    </Link>
                    <Link to="/login">
                      <Button variant="outline" className="border-mindful-primary text-mindful-primary hover:bg-mindful-primary/10 px-8 py-6 text-lg">
                        Login
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="w-full max-w-md bg-gradient-to-br from-mindful-primary/20 to-transparent p-1 rounded-2xl shadow-xl">
                <div className="bg-neutral-800/80 rounded-2xl p-6 backdrop-blur-xl">
                  <img 
                    src="/placeholder.svg" 
                    alt="Elysium AI Platform" 
                    className="w-full h-auto rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 bg-neutral-800/50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-neutral-700/50 backdrop-blur-sm p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-mindful-primary/20 hover:translate-y-[-5px]">
                <div className="w-14 h-14 bg-mindful-primary/20 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-mindful-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Professional Care</h3>
                <p className="text-gray-300">Connect with licensed mental health professionals who provide personalized care.</p>
              </div>
              <div className="bg-neutral-700/50 backdrop-blur-sm p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-mindful-primary/20 hover:translate-y-[-5px]">
                <div className="w-14 h-14 bg-mindful-primary/20 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-mindful-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">AI Support</h3>
                <p className="text-gray-300">Experience 24/7 AI-powered mental health support and resources.</p>
              </div>
              <div className="bg-neutral-700/50 backdrop-blur-sm p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-mindful-primary/20 hover:translate-y-[-5px]">
                <div className="w-14 h-14 bg-mindful-primary/20 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-mindful-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Digital Records</h3>
                <p className="text-gray-300">Keep your medical history secure and accessible in our digital platform.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to action */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Take Control of Your Mental Health?</h2>
            <p className="text-xl mb-8 text-gray-300">Join our platform today and take the first step towards better mental wellbeing.</p>
            {!isAuthenticated && (
              <Link to="/signup">
                <Button className="bg-mindful-primary hover:bg-mindful-secondary text-white px-8 py-6 text-lg">
                  Sign Up Now
                </Button>
              </Link>
            )}
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default Index;
