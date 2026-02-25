import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, LogOut, User } from 'lucide-react';
import { Button } from '../ui/Button';
import { motion } from 'framer-motion';

export const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-[64px] z-[100] glass border-b border-black/5 flex items-center">
      <div className="max-w-6xl mx-auto w-full px-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2 group">
              <motion.div
                whileHover={{ rotate: 10 }}
                className="bg-black p-1.5 rounded-lg text-white"
              >
                <ShieldCheck className="w-5 h-5" />
              </motion.div>
              <span className="font-bold text-[19px] text-black tracking-tight">LexGuard</span>
            </Link>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-8">
              <NavLink to="/dashboard" label="Product" />
              <NavLink to="/about" label="Vision" />
              <NavLink to="/pricing" label="Pricing" />
            </div>

            <div className="flex items-center gap-4 border-l border-black/10 pl-6 ml-2">
              {isAuthenticated() ? (
                <>
                  <div className="hidden md:flex items-center gap-2 text-[13px] font-bold text-[#86868b]">
                    <User className="w-3.5 h-3.5" />
                    <span>{user?.email.split('@')[0]}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="h-8 rounded-full text-xs font-bold hover:bg-black hover:text-white transition-all"
                  >
                    <LogOut className="w-3.5 h-3.5 mr-1" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <span className="text-[13px] font-semibold hover:text-[#06c] transition-colors cursor-pointer">Sign In</span>
                  </Link>
                  <Link to="/signup">
                    <Button className="h-8 px-4 rounded-full bg-black text-white text-xs font-bold hover:bg-black/80">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, label }: { to: string, label: string }) => (
  <Link to={to}>
    <span className="text-[13px] font-medium text-[#1d1d1f]/80 hover:text-black transition-colors">
      {label}
    </span>
  </Link>
);
