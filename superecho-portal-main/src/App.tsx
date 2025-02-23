import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import News from "./pages/News";
import Incidents from "./pages/Incidents";
import SupeProfile from "./pages/SupeProfile";
import AdminSupes from "./pages/AdminSupes";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-supe-dark text-white">
          <Navbar />
          <main className="container mx-auto px-4 pt-20">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/news" element={<News />} />
              <Route path="/incidents" element={<Incidents />} />
              <Route path="/supe/:id" element={<SupeProfile />} />
              <Route path="/admin/supes" element={<AdminSupes />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
        <Toaster />
        <Sonner />
      </BrowserRouter>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
