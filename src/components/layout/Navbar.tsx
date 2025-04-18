
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { UserCircle, LogOut, MessageSquare, Calendar, Video, ShoppingBag } from "lucide-react";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout, userType } = useAuth();
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-background shadow-md sticky top-0 z-50 text-foreground border-b border-border">
      <div className="elysium-container py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-md bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-white font-bold">EA</span>
            </div>
            <span className="text-xl font-display font-semibold text-foreground">Elysium AI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link>
            <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">About</Link>
            <Link to="/services" className="text-muted-foreground hover:text-primary transition-colors">Services</Link>
            <Link to="/shop" className="text-muted-foreground hover:text-primary transition-colors">Shop</Link>
            <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link>
            
            {/* Show AI Support link only for patients or non-logged in users */}
            {(!isAuthenticated || userType === 'patient') && (
              <Link to="/chatbot" className="text-muted-foreground hover:text-primary transition-colors">AI Support</Link>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to={userType === 'doctor' ? "/doctor-dashboard" : "/dashboard"} 
                  className="flex items-center space-x-2 text-muted-foreground hover:text-primary"
                >
                  <UserCircle size={20} />
                  <span>{user?.name || 'Profile'}</span>
                </Link>
                <Button 
                  variant="outline" 
                  className="border-muted hover:bg-muted hover:text-foreground"
                  onClick={handleLogout}
                >
                  <LogOut size={16} className="mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" className="border-muted text-muted-foreground hover:bg-muted hover:text-foreground">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button className="elysium-btn-primary">Sign Up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden text-foreground"
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
            <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link>
            <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">About</Link>
            <Link to="/services" className="text-muted-foreground hover:text-primary transition-colors">Services</Link>
            <Link to="/shop" className="text-muted-foreground hover:text-primary transition-colors">Shop</Link>
            <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link>
            
            {/* Show AI Support link only for patients or non-logged in users */}
            {(!isAuthenticated || userType === 'patient') && (
              <Link to="/chatbot" className="text-muted-foreground hover:text-primary transition-colors">AI Support</Link>
            )}
            
            {isAuthenticated ? (
              <div className="flex flex-col space-y-2 pt-2">
                <Link 
                  to={userType === 'doctor' ? "/doctor-dashboard" : "/dashboard"}
                  className="flex items-center space-x-2 text-muted-foreground hover:text-primary"
                >
                  <UserCircle size={20} />
                  <span>{user?.name || 'Profile'}</span>
                </Link>
                <Button 
                  variant="outline" 
                  className="border-muted text-muted-foreground hover:bg-muted hover:text-foreground w-full"
                  onClick={handleLogout}
                >
                  <LogOut size={16} className="mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2 pt-2">
                <Link to="/login">
                  <Button variant="outline" className="border-muted text-muted-foreground hover:bg-muted hover:text-foreground w-full">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button className="elysium-btn-primary w-full">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
