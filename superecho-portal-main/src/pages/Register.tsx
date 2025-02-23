
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { UserRole } from "@/types/database";

export default function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("citizen");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create new user object
    const newUser = {
      id: `user${Date.now()}`,
      username,
      email,
      password, // In a real app, this should be hashed
      role,
      createdAt: new Date().toISOString(),
    };

    // Get existing users from localStorage or initialize empty array
    const existingUsers = JSON.parse(localStorage.getItem("supewatch_users") || "[]");
    
    // Check if email already exists
    if (existingUsers.some((user: any) => user.email === email)) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: "Email already exists",
      });
      return;
    }

    // Add new user to array and save back to localStorage
    existingUsers.push(newUser);
    localStorage.setItem("supewatch_users", JSON.stringify(existingUsers));

    toast({
      title: "Registration successful",
      description: "Please login to continue",
    });
    navigate("/login");
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <Card className="w-full max-w-md p-6 bg-supe">
        <h2 className="text-2xl font-bold text-center mb-6">Register for SupeWatch</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Username</label>
            <Input
              required
              className="input-field"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              required
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <Input
              type="password"
              required
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Role</label>
            <select
              className="w-full input-field"
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
            >
              <option value="citizen">Citizen</option>
              <option value="supe">Supe</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <Button type="submit" className="w-full btn-primary">
            Register
          </Button>
          <p className="text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Login here
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
}
