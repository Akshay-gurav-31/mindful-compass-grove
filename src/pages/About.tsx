
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const About = () => {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-mindful-primary text-white py-20">
        <div className="mindful-container text-center">
          <h1 className="hero-heading mb-6">About Mindful Grove</h1>
          <p className="text-xl max-w-3xl mx-auto">
            We're on a mission to make mental health support accessible, efficient, and personalized for everyone.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="section-padding bg-white">
        <div className="mindful-container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1721322800607-8c38375eef04" 
                alt="A comfortable space for mental health support" 
                className="rounded-lg shadow-md"
              />
            </div>
            <div className="space-y-6">
              <h2 className="section-heading text-mindful-darkText">Our Story</h2>
              <p className="text-gray-600">
                Mindful Grove was born from a simple observation: accessing mental health support should be straightforward, timely, and tailored to individual needs. Our founders recognized the challenges people face when seeking help—from determining the severity of their issues to finding the right professional and establishing effective communication.
              </p>
              <p className="text-gray-600">
                By combining cutting-edge AI technology with compassionate human expertise, we've created a platform that guides individuals through their mental health journey with care and efficiency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission & Values */}
      <section className="section-padding bg-mindful-warmNeutral">
        <div className="mindful-container">
          <div className="text-center mb-12">
            <h2 className="section-heading text-mindful-darkText">Our Mission & Values</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="border-l-4 border-l-mindful-primary shadow-md">
              <CardHeader>
                <CardTitle className="card-heading">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  To create a world where mental health support is accessible to everyone, removing barriers of time, distance, and uncertainty through innovative technology and compassionate care.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-mindful-secondary shadow-md">
              <CardHeader>
                <CardTitle className="card-heading">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We envision a future where seeking mental health support is as normal and stigma-free as any other healthcare service, empowering individuals to proactively manage their mental wellbeing.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="card-heading">Accessibility</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We believe mental health support should be available to everyone, regardless of location, schedule, or circumstances.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="card-heading">Compassion</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Every interaction on our platform is guided by empathy, understanding, and respect for individual experiences.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="card-heading">Innovation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We continuously explore new technologies and approaches to improve mental health support and outcomes.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="card-heading">Privacy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We uphold the highest standards of confidentiality and data protection in all our services.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="card-heading">Quality</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We're committed to providing evidence-based support and connecting users with qualified professionals.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="card-heading">Inclusivity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We create a welcoming environment for people of all backgrounds, identities, and experiences.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding bg-white">
        <div className="mindful-container">
          <div className="text-center mb-12">
            <h2 className="section-heading text-mindful-darkText mb-4">Meet Our Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The dedicated professionals behind Mindful Grove who are passionate about transforming mental health support.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-32 h-32 mx-auto rounded-full bg-mindful-blue mb-4"></div>
                <CardTitle>Shreyash Kumar</CardTitle>
                <p className="text-mindful-primary font-medium">Team Lead</p>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  With a background in psychology and technology, Shreyash leads our team with a vision for accessible mental healthcare.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-32 h-32 mx-auto rounded-full bg-mindful-blue mb-4"></div>
                <CardTitle>Vardhan Mudhiraj</CardTitle>
                <p className="text-mindful-primary font-medium">Team Lead</p>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Vardhan brings expertise in AI and machine learning to develop intelligent mental health support systems.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-32 h-32 mx-auto rounded-full bg-mindful-blue mb-4"></div>
                <CardTitle>Meghana Yegireddi</CardTitle>
                <p className="text-mindful-primary font-medium">Team Lead</p>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  As a clinical psychologist, Meghana ensures our platform delivers evidence-based mental health support.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-32 h-32 mx-auto rounded-full bg-mindful-blue mb-4"></div>
                <CardTitle>Akshay Gurav</CardTitle>
                <p className="text-mindful-primary font-medium">Team Lead</p>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Akshay oversees our technology infrastructure, ensuring secure and seamless experiences for users.
                </p>
                <div className="flex justify-center mt-4 space-x-3">
                  <a href="https://www.linkedin.com/in/akshay--gurav/" target="_blank" rel="noopener noreferrer" className="text-mindful-primary hover:text-mindful-secondary">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                  <a href="https://www.instagram.com/akshay._.gurav" target="_blank" rel="noopener noreferrer" className="text-mindful-primary hover:text-mindful-secondary">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default About;
