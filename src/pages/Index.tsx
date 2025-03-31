
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import UserTypeSelector from "@/components/UserTypeSelector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { FadeIn, SlideIn, StaggeredContainer } from "@/components/Animations";
import { ChevronRight, ArrowRight } from "lucide-react";

const Index = () => {
  const { login, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }
    
    setIsLoading(true);
    try {
      await login(email, password);
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserTypeSelected = () => {
    navigate("/dashboard");
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[80vh] py-10">
        {isAuthenticated && !user?.type ? (
          <UserTypeSelector onSelect={handleUserTypeSelected} />
        ) : isAuthenticated && user?.type ? (
          <div className="text-center">
            <FadeIn>
              <h1 className="heading-lg mb-4">Welcome back!</h1>
              <p className="subtitle mb-8 max-w-xl mx-auto">
                You're already logged in as a {user.type}. Continue to your dashboard to see your latest updates.
              </p>
              <Button
                size="lg"
                className="flex items-center gap-2"
                onClick={() => navigate("/dashboard")}
              >
                Go to Dashboard
                <ArrowRight size={18} />
              </Button>
            </FadeIn>
          </div>
        ) : (
          <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <SlideIn className="flex flex-col items-start">
              <h1 className="heading-lg mb-4">
                Connect, Share, Discuss
              </h1>
              <p className="subtitle mb-8 max-w-xl">
                A platform designed for students, professors, and investors to share knowledge, insights, and opportunities. Sign in to start your journey.
              </p>
              <form onSubmit={handleLogin} className="w-full max-w-md space-y-4">
                <div>
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12"
                  />
                </div>
                <div>
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12"
                  />
                </div>
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
                <p className="text-sm text-center text-muted-foreground">
                  (For demo, enter any email/password)
                </p>
              </form>
              <div className="flex justify-between items-center mt-8 w-full max-w-md">
                <StaggeredContainer 
                  className="flex gap-4" 
                  animation="fade" 
                  staggerDelay={0.1}
                >
                  <UserTypeChip type="student" />
                  <UserTypeChip type="professor" />
                  <UserTypeChip type="investor" />
                </StaggeredContainer>
              </div>
            </SlideIn>
            
            <div className="hidden lg:flex justify-center">
              <FadeIn delay={0.3}>
                <div className="relative">
                  <div className="w-96 h-96 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/40 backdrop-blur-3xl animate-float"></div>
                  <div className="absolute -bottom-4 -right-4 w-72 h-72 rounded-3xl bg-gradient-to-tr from-primary/30 to-primary/10 backdrop-blur-3xl animate-float" style={{ animationDelay: "1s" }}></div>
                  <div className="absolute -top-4 -left-4 w-60 h-60 rounded-3xl bg-gradient-to-bl from-primary/20 to-primary/5 backdrop-blur-3xl animate-float" style={{ animationDelay: "2s" }}></div>
                </div>
              </FadeIn>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

interface UserTypeChipProps {
  type: "student" | "professor" | "investor";
}

const UserTypeChip: React.FC<UserTypeChipProps> = ({ type }) => {
  const getTypeInfo = () => {
    switch (type) {
      case "student":
        return { label: "For Students" };
      case "professor":
        return { label: "For Professors" };
      case "investor":
        return { label: "For Investors" };
      default:
        return { label: type };
    }
  };
  
  const { label } = getTypeInfo();
  
  return (
    <div className="flex items-center gap-1 text-xs rounded-full bg-primary/10 py-1 px-3 text-primary font-medium">
      <span>{label}</span>
      <ChevronRight size={14} />
    </div>
  );
};

export default Index;
