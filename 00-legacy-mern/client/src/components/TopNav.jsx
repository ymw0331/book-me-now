import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Menu, X, Home, User, LogOut, LogIn, UserPlus } from 'lucide-react';
import { Container } from './layout';
import { Button } from './ui';

const TopNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => ({ ...state }));
  const navigate = useNavigate();

  const logout = () => {
    dispatch({
      type: "LOGOUT",
      payload: null
    });
    localStorage.removeItem("auth");
    toast.success("Logout success");
    navigate("/login");
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    { to: "/", label: "Home", icon: Home, show: true },
    { to: "/dashboard", label: "Dashboard", icon: User, show: auth !== null }
  ];

  const authItems = auth 
    ? [{ onClick: logout, label: "Logout", icon: LogOut }]
    : [
        { to: "/login", label: "Login", icon: LogIn },
        { to: "/register", label: "Register", icon: UserPlus }
      ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md shadow-sm">
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <NavLink 
            to="/" 
            className="flex items-center space-x-2 text-xl font-bold text-primary-600 hover:text-primary-700 transition-colors"
          >
            <Home className="h-6 w-6" />
            <span>BookMe</span>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => 
              item.show && (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary-600 ${
                      isActive ? 'text-primary-600' : 'text-gray-700'
                    }`
                  }
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </NavLink>
              )
            )}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {authItems.map((item, index) => 
              item.to ? (
                <NavLink key={item.to} to={item.to}>
                  <Button 
                    variant={index === 0 ? "ghost" : "default"} 
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Button>
                </NavLink>
              ) : (
                <Button
                  key={item.label}
                  onClick={item.onClick}
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Button>
              )
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden border-t bg-white/95 backdrop-blur-md"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => 
                item.show && (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 rounded-md px-3 py-2 text-base font-medium transition-colors ${
                        isActive 
                          ? 'bg-primary-50 text-primary-600' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`
                    }
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </NavLink>
                )
              )}
              
              <div className="border-t pt-3 mt-3">
                {authItems.map((item) => 
                  item.to ? (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-3 rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </NavLink>
                  ) : (
                    <button
                      key={item.label}
                      onClick={item.onClick}
                      className="flex items-center space-x-3 rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors w-full text-left"
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </button>
                  )
                )}
              </div>
            </div>
          </motion.div>
        )}
      </Container>
    </nav>
  );
};

export default TopNav;