import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      description: "Come back soon!",
    });
  };

  return (
    <nav className="glass-panel fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary">SupeWatch</span>
          </Link>

          <div className="flex items-center space-x-6">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/news" className="nav-link">News</Link>
            <Link to="/incidents" className="nav-link">Incidents</Link>
            {isAdmin && (
              <Link to="/admin/supes" className="nav-link">Manage Supes</Link>
            )}
            
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-300">
                  Welcome, {user.username}
                </span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="default" size="sm">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
