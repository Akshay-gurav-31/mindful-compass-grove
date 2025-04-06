
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="mindful-container py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-mindful-primary flex items-center justify-center">
              <span className="text-white font-bold">MG</span>
            </div>
            <span className="text-xl font-display font-semibold text-mindful-darkText">Mindful Grove</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-mindful-darkText hover:text-mindful-primary transition-colors">Home</Link>
            <Link to="/about" className="text-mindful-darkText hover:text-mindful-primary transition-colors">About</Link>
            <Link to="/services" className="text-mindful-darkText hover:text-mindful-primary transition-colors">Services</Link>
            <Link to="/contact" className="text-mindful-darkText hover:text-mindful-primary transition-colors">Contact</Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login">
              <Button variant="outline" className="mindful-btn-outline">Login</Button>
            </Link>
            <Link to="/signup">
              <Button className="mindful-btn-primary">Sign Up</Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden text-mindful-darkText"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={cn(
          "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
          mobileMenuOpen ? "max-h-96 pt-4" : "max-h-0"
        )}>
          <div className="flex flex-col space-y-4 pb-4">
            <Link to="/" className="text-mindful-darkText hover:text-mindful-primary transition-colors">Home</Link>
            <Link to="/about" className="text-mindful-darkText hover:text-mindful-primary transition-colors">About</Link>
            <Link to="/services" className="text-mindful-darkText hover:text-mindful-primary transition-colors">Services</Link>
            <Link to="/contact" className="text-mindful-darkText hover:text-mindful-primary transition-colors">Contact</Link>
            <div className="flex flex-col space-y-2 pt-2">
              <Link to="/login">
                <Button variant="outline" className="mindful-btn-outline w-full">Login</Button>
              </Link>
              <Link to="/signup">
                <Button className="mindful-btn-primary w-full">Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
