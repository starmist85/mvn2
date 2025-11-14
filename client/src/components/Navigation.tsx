import { APP_LOGO, APP_TITLE } from "@/const";
import { Link, useLocation } from "wouter";
import { User, LogOut } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useState } from "react";
import LoginModal from "./LoginModal";

export default function Navigation() {
  const { user, loading, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [, navigate] = useLocation();

  const handleLoginClick = () => {
    if (user) {
      navigate("/admin");
    } else {
      setShowLoginModal(true);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo and Title */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src={APP_LOGO} alt={APP_TITLE} className="h-12 w-auto" />
            <span className="text-xl font-bold hidden sm:inline">{APP_TITLE}</span>
          </Link>

          {/* Menu Links */}
          <div className="flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover:text-accent transition-colors">
              Home
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-accent transition-colors">
              About
            </Link>
            <Link href="/releases" className="text-sm font-medium hover:text-accent transition-colors">
              Releases
            </Link>
            <Link href="/news" className="text-sm font-medium hover:text-accent transition-colors">
              News
            </Link>
            
            {/* Login/Logout Button */}
            {user ? (
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-muted rounded-full transition-colors flex items-center justify-center h-10 w-10"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleLoginClick}
                className="p-2 hover:bg-muted rounded-full transition-colors flex items-center justify-center h-10 w-10"
                title="Login"
              >
                <User className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </nav>
      
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
    </>
  );
}
