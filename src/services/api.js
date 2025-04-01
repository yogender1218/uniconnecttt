
// Dummy API service for demonstration
import { toast } from "sonner";

export const api = {
  // 🔹 Portfolio API
  getPortfolio: async () => {
    try {
      const response = await fetch(`${BASE_URL}/portfolio`);
      if (!response.ok) throw new Error("Failed to fetch portfolio data");
      return await response.json();
    } catch (error) {
      console.error("Error fetching portfolio:", error);
      throw error;
    }
  },

  updatePortfolio: async (portfolioId, data) => {
    try {
      const response = await fetch(`${BASE_URL}/portfolio/${portfolioId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update portfolio");
      return await response.json();
    } catch (error) {
      console.error("Error updating portfolio:", error);
      throw error;
    }
  },

  addPortfolio: async (newPortfolio) => {
    try {
      const response = await fetch(`${BASE_URL}/portfolio`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPortfolio),
      });
      if (!response.ok) throw new Error("Failed to add portfolio");
      return await response.json();
    } catch (error) {
      console.error("Error adding portfolio:", error);
      throw error;
    }
  },

  deletePortfolio: async (portfolioId) => {
    try {
      const response = await fetch(`${BASE_URL}/portfolio/${portfolioId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete portfolio");
      return await response.json();
    } catch (error) {
      console.error("Error deleting portfolio:", error);
      throw error;
    }
  },

  // 🔹 Courses API
  getCourses: async () => {
    try {
      const response = await fetch(`${BASE_URL}/courses`);
      if (!response.ok) throw new Error("Failed to fetch courses");
      return await response.json();
    } catch (error) {
      console.error("Error fetching courses:", error);
      throw error;
    }
  },

  updateCourse: async (courseId, data) => {
    try {
      const response = await fetch(`${BASE_URL}/courses/${courseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update course");
      return await response.json();
    } catch (error) {
      console.error("Error updating course:", error);
      throw error;
    }
  },

  addCourse: async (newCourse) => {
    try {
      const response = await fetch(`${BASE_URL}/courses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCourse),
      });
      if (!response.ok) throw new Error("Failed to add course");
      return await response.json();
    } catch (error) {
      console.error("Error adding course:", error);
      throw error;
    }
  },

  deleteCourse: async (courseId) => {
    try {
      const response = await fetch(`${BASE_URL}/courses/${courseId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete course");
      return await response.json();
    } catch (error) {
      console.error("Error deleting course:", error);
      throw error;
    }
  },
};

// Mock database
const mockUsers = [
  {
    id: "user1",
    name: "John Doe",
    email: "john@example.com",
    type: "student",
    profile: {
      university: "Stanford University",
      degree: "Computer Science",
      graduation_year: 2024,
      skills: "React, TypeScript, Node.js"
    }
  },
  {
    id: "user2",
    name: "Jane Smith",
    email: "jane@example.com",
    type: "professor",
    profile: {
      company: "MIT",
      industry: "Computer Science",
      work_experience: "10 years",
      expertise_areas: "Machine Learning, AI"
    }
  },
  {
    id: "user3",
    name: "Bob Johnson",
    email: "bob@example.com",
    type: "investor",
    profile: {
      investment_firm: "Tech Ventures",
      investment_categories: "EdTech, AI, Blockchain",
      min_investment: 50000,
      max_investment: 500000,
      stage_of_interest: "Seed, Series A"
    }
  }
];

// Mock delay function
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// API functions
export const fetchUserById = async (userId) => {
  await delay(500);
  const user = mockUsers.find(u => u.id === userId);
  if (!user) throw new Error("User not found");
  return user;
};

export const fetchUsersByType = async (type) => {
  await delay(800);
  return mockUsers.filter(u => u.type === type);
};

export const fetchUsersByIds = async (userIds) => {
  await delay(600);
  return mockUsers.filter(u => userIds.includes(u.id));
};

export const searchUsers = async (query) => {
  await delay(700);
  const lowercaseQuery = query.toLowerCase();
  return mockUsers.filter(
    u => u.name.toLowerCase().includes(lowercaseQuery) || 
         u.email.toLowerCase().includes(lowercaseQuery)
  );
};

export const updateStudentProfile = async (profileData) => {
  await delay(1000);
  console.log("Updating student profile:", profileData);
  
  // In a real app, this would make an API call
  // For the demo, we'll just return success
  return {
    success: true,
    university: profileData.university,
    degree: profileData.degree,
    graduation_year: profileData.graduation_year,
    skills: profileData.skills,
    linkedin: profileData.linkedin,
    portfolio: profileData.portfolio
  };
};

export const updateProfessorProfile = async (profileData) => {
  await delay(1000);
  console.log("Updating professor profile:", profileData);
  
  return {
    success: true,
    company: profileData.company,
    industry: profileData.industry,
    work_experience: profileData.work_experience,
    expertise_areas: profileData.expertise_areas,
    open_for_mentorship: profileData.open_for_mentorship,
    availability: profileData.availability
  };
};

export const updateInvestorProfile = async (profileData) => {
  await delay(1000);
  console.log("Updating investor profile:", profileData);
  
  return {
    success: true,
    investment_firm: profileData.investment_firm,
    investment_categories: profileData.investment_categories,
    min_investment: profileData.min_investment,
    max_investment: profileData.max_investment,
    stage_of_interest: profileData.stage_of_interest
  };
};

// Mock data for components
export const fetchStudentProfile = async () => {
  await delay(800);
  return {
    university: "Stanford University",
    degree: "Computer Science",
    graduation_year: 2024,
    skills: "React, TypeScript, Node.js"
  };
};

export const fetchProfessorProfile = async () => {
  await delay(800);
  return {
    company: "MIT",
    industry: "Computer Science",
    work_experience: "10 years",
    expertise_areas: "Machine Learning, AI",
    open_for_mentorship: true
  };
};

export const fetchInvestorProfile = async () => {
  await delay(800);
  return {
    investment_firm: "Tech Ventures",
    investment_categories: "EdTech, AI, Blockchain",
    min_investment: 50000,
    max_investment: 500000,
    stage_of_interest: "Seed, Series A"
  };
};

export const fetchProjects = async () => {
  await delay(700);
  return [
    {
      id: "proj1",
      title: "AI Learning Platform",
      description: "An educational platform that uses AI to personalize learning experiences",
      progress: 75,
      collaborators: 4,
      dueDate: "2023-12-15"
    },
    {
      id: "proj2",
      title: "Research Paper on Quantum Computing",
      description: "A comprehensive study on quantum computing applications in cryptography",
      progress: 40,
      collaborators: 2,
      dueDate: "2024-03-20"
    },
    {
      id: "proj3",
      title: "Sustainable Energy Startup",
      description: "A startup focused on developing new solar energy technologies",
      progress: 25,
      collaborators: 5,
      dueDate: "2024-06-30"
    }
  ];
};

export const fetchAnalyticsData = async () => {
  await delay(600);
  return [
    {
      name: "Jan",
      posts: 4,
      engagement: 13,
      connections: 2
    },
    {
      name: "Feb",
      posts: 3,
      engagement: 9,
      connections: 1
    },
    {
      name: "Mar",
      posts: 5,
      engagement: 17,
      connections: 3
    },
    {
      name: "Apr",
      posts: 7,
      engagement: 25,
      connections: 4
    },
    {
      name: "May",
      posts: 6,
      engagement: 20,
      connections: 2
    },
    {
      name: "Jun",
      posts: 9,
      engagement: 30,
      connections: 5
    }
  ];
};

export const fetchNotifications = async () => {
  await delay(500);
  return [
    {
      id: "notif1",
      title: "New Connection",
      description: "Jane Smith has accepted your connection request",
      time: "10 minutes ago",
      read: false
    },
    {
      id: "notif2",
      title: "Project Update",
      description: "AI Learning Platform project has been updated with new milestones",
      time: "2 hours ago",
      read: false
    },
    {
      id: "notif3",
      title: "Research Paper Published",
      description: "Your research paper has been published in the Digital Library",
      time: "1 day ago",
      read: true
    }
  ];
};

export const fetchRecommendedUsers = async () => {
  await delay(800);
  return [
    {
      id: "rec1",
      name: "Alice Johnson",
      role: "PhD Candidate",
      type: "student",
      mutualConnections: 3,
      isConnected: false
    },
    {
      id: "rec2",
      name: "Robert Chen",
      role: "Associate Professor",
      type: "professor",
      mutualConnections: 1,
      isConnected: false
    },
    {
      id: "rec3",
      name: "Sarah Williams",
      role: "Angel Investor",
      type: "investor",
      mutualConnections: 2,
      isConnected: true
    }
  ];
};

export const fetchRecentActivity = async () => {
  await delay(700);
  return [
    {
      id: "act1",
      person: {
        name: "Jane Smith",
        avatar: null
      },
      activity: "published a new paper on",
      target: "Machine Learning Applications",
      time: "2 hours ago"
    },
    {
      id: "act2",
      person: {
        name: "Bob Johnson",
        avatar: null
      },
      activity: "invested in",
      target: "EdTech Startup XYZ",
      time: "1 day ago"
    },
    {
      id: "act3",
      person: {
        name: "Alice Johnson",
        avatar: null
      },
      activity: "completed a course on",
      target: "Advanced React Development",
      time: "3 days ago"
    }
  ];
};

export const fetchResources = async () => {
  await delay(600);
  return [
    {
      id: "res1",
      title: "Introduction to AI",
      type: "Course",
      author: "Robert Chen",
      rating: 4.8
    },
    {
      id: "res2",
      title: "Blockchain Technology Applications",
      type: "Research Paper",
      author: "Jane Smith",
      rating: 4.5
    },
    {
      id: "res3",
      title: "Startup Funding Strategies",
      type: "E-Book",
      author: "Bob Johnson",
      rating: 4.7
    },
    {
      id: "res4",
      title: "Web Development Masterclass",
      type: "Video Series",
      author: "Alice Johnson",
      rating: 4.9
    }
  ];
};

export const fetchDiscoverItems = async () => {
  await delay(800);
  return [
    {
      id: "disc1",
      title: "AI and the Future of Education",
      author: "Robert Chen",
      type: "Research Paper",
      image: null,
      tags: ["AI", "Education", "Future"]
    },
    {
      id: "disc2",
      title: "Sustainable Energy Innovation",
      author: "Green Tech Inc.",
      type: "Startup",
      image: null,
      tags: ["Energy", "Sustainability", "Innovation"]
    },
    {
      id: "disc3",
      title: "Blockchain for Financial Inclusion",
      author: "Sarah Williams",
      type: "Project",
      image: null,
      tags: ["Blockchain", "Finance", "Inclusion"]
    }
  ];
};

export const connectWithUser = async (userId) => {
  await delay(1000);
  console.log("Connecting with user:", userId);
  
  // Simulate success
  toast.success("Connection request sent successfully");
  return { success: true };
};

export const createPost = async (content, hashtags) => {
  await delay(1500);
  console.log("Creating post:", { content, hashtags });
  
  // Simulate success
  return { success: true, postId: "post" + Math.random().toString(36).substr(2, 9) };
};

export const fetchUserCourses = async () => {
  await delay(700);
  return [
    {
      id: "course1",
      title: "Introduction to AI",
      instructor: "Robert Chen",
      progress: 75,
      status: "Active",
      duration: 12 // hours
    },
    {
      id: "course2",
      title: "Data Science Fundamentals",
      instructor: "Jane Smith",
      progress: 100,
      status: "Completed",
      duration: 10 // hours
    },
    {
      id: "course3",
      title: "Blockchain Technology",
      instructor: "Bob Johnson",
      progress: 30,
      status: "Active",
      duration: 8 // hours
    }
  ];
};


