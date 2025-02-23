
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, UserRole } from "@/types/database";
import mockData from "@/data/db.json";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
  isSupe: boolean;
  isCitizen: boolean;
  canLikeContent: boolean;
  canComment: boolean;
  canPostIncident: boolean;
  canManageContent: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("supewatch_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    // First check localStorage for registered users
    const registeredUsers = JSON.parse(localStorage.getItem("supewatch_users") || "[]");
    const mockUsers = [...mockData.users, ...registeredUsers];
    const foundUser = mockUsers.find((u) => u.email === email);
    
    if (foundUser) {
      const typedUser: User = {
        ...foundUser,
        role: foundUser.role as UserRole
      };
      setUser(typedUser);
      localStorage.setItem("supewatch_user", JSON.stringify(typedUser));
    } else {
      throw new Error("Invalid credentials");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("supewatch_user");
  };

  const isAdmin = user?.role === "admin";
  const isSupe = user?.role === "supe";
  const isCitizen = user?.role === "citizen";
  
  const canLikeContent = Boolean(user);
  const canComment = Boolean(user);
  const canPostIncident = Boolean(user);
  const canManageContent = isAdmin;

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        logout, 
        isAdmin, 
        isSupe, 
        isCitizen,
        canLikeContent,
        canComment,
        canPostIncident,
        canManageContent
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
