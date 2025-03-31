
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in on initial load
  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");
      
      if (storedUser && storedToken) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Error parsing stored user", error);
          localStorage.removeItem("user");
          localStorage.removeItem("token");
        }
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = async (data) => {
    try {
      // Store the user data and token
      const userData = {
        id: data.id || data.user_id,
        name: data.name || data.username,
        email: data.email,
        type: data.user_type || data.type,
        profilePicture: data.profile_picture || null,
        // Add any other needed user properties
      };
      
      setUser(userData);
      setIsAuthenticated(true);
      
      // Save to localStorage
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", data.token);
      
      return true;
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Authentication failed");
      return false;
    }
  };

  const signup = async (data) => {
    try {
      // Process signup data
      const userData = {
        id: data.id || data.user_id,
        name: data.name || data.username,
        email: data.email,
        type: data.user_type,
        profilePicture: data.profile_picture || null,
      };
      
      setUser(userData);
      setIsAuthenticated(true);
      
      // Save to localStorage
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", data.token);
      
      return true;
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Registration failed");
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
  };

  const updateUserType = (type) => {
    const updatedUser = { ...user, type };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const updateProfile = (profileData) => {
    const updatedUser = { ...user, ...profileData };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    signup,
    logout,
    updateUserType,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
