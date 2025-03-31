
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

type UserType = "student" | "professor" | "investor" | null;

// Student profile fields
interface StudentProfile {
  university?: string;
  degree?: string;
  graduation_year?: number;
  skills?: string;
  bio?: string;
  linkedin?: string;
  portfolio?: string;
}

// Professor profile fields
interface ProfessorProfile {
  university?: string;
  department?: string;
  specialization?: string;
  publications?: number;
  bio?: string;
  work_experience?: string;
  company?: string;
  industry?: string;
  linkedin?: string;
  portfolio?: string;
  expertise_areas?: string;
  open_for_mentorship?: boolean;
  availability?: string;
}

// Investor profile fields
interface InvestorProfile {
  company?: string;
  position?: string;
  investment_focus?: string;
  portfolio_size?: string;
  bio?: string;
  investment_firm?: string;
  investment_categories?: string;
  min_investment?: number;
  max_investment?: number;
  stage_of_interest?: string;
  linkedin?: string;
  portfolio?: string;
}

// Combined profile type using discriminated union
interface BaseProfile {
  type: UserType;
}

interface StudentProfileWithType extends StudentProfile, BaseProfile {
  type: "student";
}

interface ProfessorProfileWithType extends ProfessorProfile, BaseProfile {
  type: "professor";
}

interface InvestorProfileWithType extends InvestorProfile, BaseProfile {
  type: "investor";
}

type UserProfile = StudentProfileWithType | ProfessorProfileWithType | InvestorProfileWithType;

interface User {
  id: string;
  name: string;
  email: string;
  token: string;
  type: UserType;
  profile?: UserProfile;
  avatarUrl?: string;
  coverUrl?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  selectUserType: (type: UserType) => void;
  updateProfile: (profileData: Partial<StudentProfile | ProfessorProfile | InvestorProfile>) => void;
  updateProfileImage: (type: 'avatar' | 'cover', url: string) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved user data in localStorage
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Failed to parse saved user:", error);
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    // Simulate a login API call
    setLoading(true);
    
    try {
      // This would normally be an API call
      // For demo, we're creating a mock user
      const mockUser: User = {
        id: "user-123",
        name: email.split("@")[0],
        email,
        token: "mock-token-" + Math.random().toString(36).substring(2),
        type: null, // User type will be selected later
      };
      
      setUser(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));
      toast.success("Login successful!");
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed. Please try again.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast.info("You have been logged out");
  };

  const selectUserType = (type: UserType) => {
    if (!user) return;
    
    // Initialize default profile based on user type
    let profile: any = { type };
    
    switch (type) {
      case "student":
        profile = {
          type,
          university: "",
          degree: "",
          graduation_year: undefined,
          skills: "",
          bio: "",
          linkedin: "",
          portfolio: ""
        };
        break;
      case "professor":
        profile = {
          type,
          university: "",
          department: "",
          specialization: "",
          publications: 0,
          bio: "",
          work_experience: "",
          company: "",
          industry: "",
          linkedin: "",
          portfolio: "",
          expertise_areas: "",
          open_for_mentorship: true,
          availability: ""
        };
        break;
      case "investor":
        profile = {
          type,
          company: "",
          position: "",
          investment_focus: "",
          portfolio_size: "",
          bio: "",
          investment_firm: "",
          investment_categories: "",
          min_investment: 0,
          max_investment: 0,
          stage_of_interest: "",
          linkedin: "",
          portfolio: ""
        };
        break;
    }
    
    // Set default avatar and cover images based on user type
    let avatarUrl = "/placeholder.svg";
    let coverUrl = "/placeholder.svg";
    
    const updatedUser = { 
      ...user, 
      type, 
      profile,
      avatarUrl,
      coverUrl 
    };
    
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    toast.success(`You're now using the dashboard as a ${type}`);
  };

  const updateProfile = (profileData: Partial<StudentProfile | ProfessorProfile | InvestorProfile>) => {
    if (!user || !user.type || !user.profile) return;
    
    const updatedUser = { 
      ...user, 
      profile: {
        ...user.profile,
        ...profileData
      }
    };
    
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    toast.success("Profile updated successfully");
  };

  const updateProfileImage = (type: 'avatar' | 'cover', url: string) => {
    if (!user) return;
    
    const updatedUser = { 
      ...user
    };
    
    if (type === 'avatar') {
      updatedUser.avatarUrl = url;
    } else {
      updatedUser.coverUrl = url;
    }
    
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    toast.success(`${type === 'avatar' ? 'Profile' : 'Cover'} image updated successfully`);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        selectUserType,
        updateProfile,
        updateProfileImage,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
