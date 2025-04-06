
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-mindful-highlight pt-16 pb-8">
      <div className="mindful-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-mindful-primary flex items-center justify-center">
                <span className="text-white font-bold">MG</span>
              </div>
              <span className="text-xl font-display font-semibold text-mindful-darkText">Mindful Grove</span>
            </Link>
            <p className="text-sm text-gray-600 mt-2">
              Providing accessible mental health support through AI triage and professional human care.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="https://www.instagram.com/akshay._.gurav" target="_blank" rel="noopener noreferrer" className="text-mindful-primary hover:text-mindful-secondary">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="https://www.linkedin.com/in/akshay--gurav/" target="_blank" rel="noopener noreferrer" className="text-mindful-primary hover:text-mindful-secondary">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-mindful-darkText">Services</h3>
            <ul className="space-y-2">
              <li><Link to="/services" className="text-gray-600 hover:text-mindful-primary transition-colors">AI Chat Support</Link></li>
              <li><Link to="/services" className="text-gray-600 hover:text-mindful-primary transition-colors">Video Consultations</Link></li>
              <li><Link to="/services" className="text-gray-600 hover:text-mindful-primary transition-colors">Professional Therapy</Link></li>
              <li><Link to="/services" className="text-gray-600 hover:text-mindful-primary transition-colors">Mental Health Resources</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-mindful-darkText">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-600 hover:text-mindful-primary transition-colors">About Us</Link></li>
              <li><Link to="/about" className="text-gray-600 hover:text-mindful-primary transition-colors">Our Team</Link></li>
              <li><Link to="/about" className="text-gray-600 hover:text-mindful-primary transition-colors">Careers</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-mindful-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-mindful-darkText">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-gray-600 hover:text-mindful-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-600 hover:text-mindful-primary transition-colors">Terms of Service</Link></li>
              <li><Link to="/accessibility" className="text-gray-600 hover:text-mindful-primary transition-colors">Accessibility</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-12 pt-8">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Mindful Grove. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
