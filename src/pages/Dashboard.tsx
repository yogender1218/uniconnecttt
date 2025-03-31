
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import UserTypeSelector from "@/components/UserTypeSelector";
import { usePosts } from "@/hooks/usePosts";
import { FadeIn, SlideIn } from "@/components/Animations";
import { toast } from "sonner";
import { 
  Home, UserCheck, Users, TrendingUp, 
  BookOpen, GraduationCap
} from "lucide-react";

// Import the refactored dashboard components
import SidebarNav from "@/components/dashboard/SidebarNav";
import DashboardTabs from "@/components/dashboard/DashboardTabs";
import NotificationsSection from "@/components/dashboard/NotificationsSection";
import AnalyticsSection from "@/components/dashboard/AnalyticsSection";
import ProjectsSection from "@/components/dashboard/ProjectsSection";
import ResourcesSection from "@/components/dashboard/ResourcesSection";
import HelpSection from "@/components/dashboard/HelpSection";
import RoleSpecificContent from "@/components/dashboard/RoleSpecificContent";

// Import modals
import UserProfileModal from "@/components/UserProfileModal";
import CoursesModal from "@/components/student/CoursesModal";
import ManageCoursesModal from "@/components/professor/ManageCoursesModal";
import PortfolioModal from "@/components/investor/PortfolioModal";

import { api, Comment, Post, Reply } from "@/services/api";

const analyticsData = [
  { name: "Jan", posts: 4, engagement: 30, connections: 8 },
  { name: "Feb", posts: 7, engagement: 48, connections: 12 },
  { name: "Mar", posts: 5, engagement: 62, connections: 15 },
  { name: "Apr", posts: 8, engagement: 75, connections: 21 },
  { name: "May", posts: 12, engagement: 87, connections: 29 },
  { name: "Jun", posts: 10, engagement: 80, connections: 34 },
];

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { 
    posts, 
    loading, 
    error, 
    createPost, 
    likePost, 
    commentOnPost,
    replyToComment,
    connectWithUser 
  } = usePosts();
  
  const [activeSection, setActiveSection] = useState("home");
  const [isAllNotificationsOpen, setIsAllNotificationsOpen] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isProjectDetailsOpen, setIsProjectDetailsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isCoursesOpen, setIsCoursesOpen] = useState(false);
  const [isManageCoursesOpen, setIsManageCoursesOpen] = useState(false);
  const [isPortfolioOpen, setIsPortfolioOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<any>(null);
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [professorCourses, setProfessorCourses] = useState([]);
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [connectedPeople, setConnectedPeople] = useState<string[]>([]);
  const [userProjects, setUserProjects] = useState([
    {
      id: "1",
      title: "Machine Learning Research",
      description: "Neural network optimization for pattern recognition",
      progress: 75,
      collaborators: 4,
      dueDate: "Dec 15, 2023",
    },
    {
      id: "2",
      title: "Data Visualization Tool",
      description: "Interactive dashboard for complex data sets",
      progress: 45,
      collaborators: 2,
      dueDate: "Jan 10, 2024",
    },
    {
      id: "3",
      title: "Blockchain Implementation",
      description: "Secure transaction system for educational credentials",
      progress: 20,
      collaborators: 5,
      dueDate: "Feb 28, 2024",
    }
  ]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Load courses for students
    const loadStudentCourses = async () => {
      if (user?.type === 'student') {
        try {
          const fetchedCourses = await api.getStudentCourses();
          setCourses(fetchedCourses);
        } catch (err) {
          console.error("Error fetching courses:", err);
        }
      }
    };

    // Load courses for professors
    const loadProfessorCourses = async () => {
      if (user?.type === 'professor') {
        try {
          const fetchedCourses = await api.getProfessorCourses();
          setProfessorCourses(fetchedCourses);
        } catch (err) {
          console.error("Error fetching professor courses:", err);
        }
      }
    };

    // Load portfolio for investors
    const loadInvestorPortfolio = async () => {
      if (user?.type === 'investor') {
        try {
          const fetchedPortfolio = await api.getInvestorPortfolio();
          setPortfolioItems(fetchedPortfolio);
        } catch (err) {
          console.error("Error fetching portfolio:", err);
        }
      }
    };

    loadStudentCourses();
    loadProfessorCourses();
    loadInvestorPortfolio();
  }, [user?.type]);

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  if (!user?.type) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[80vh]">
          <UserTypeSelector />
        </div>
      </Layout>
    );
  }

  const getTypeIcon = () => {
    switch (user.type) {
      case "student":
        return <GraduationCap size={20} />;
      case "professor":
        return <BookOpen size={20} />;
      case "investor":
        return <TrendingUp size={20} />;
      default:
        return <Home size={20} />;
    }
  };

  // Handle connecting with people
  const handleConnectWithPerson = async (personId: string) => {
    try {
      await connectWithUser(personId);
      setConnectedPeople(prev => [...prev, personId]);
      toast.success("Connection request sent!");
    } catch (error) {
      console.error("Error connecting with user:", error);
      toast.error("Failed to connect with user");
    }
  };

  // Handle viewing a person's profile
  const handleViewPersonProfile = (person: any) => {
    setSelectedPerson(person);
    setIsUserProfileOpen(true);
  };

  const handleCreatePost = async (content: string, hashtags: string) => {
    try {
      await createPost(content, hashtags);
      toast.success("Post created successfully!");
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post");
    }
  };

  const handleCreateProject = (projectData: any) => {
    const newProject = {
      id: `${userProjects.length + 1}`,
      title: projectData.title,
      description: projectData.description,
      progress: 0,
      collaborators: 1,
      dueDate: projectData.dueDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    };
    
    setUserProjects([newProject, ...userProjects]);
  };

  const handleViewProject = (project: any) => {
    setSelectedProject(project);
    setIsProjectDetailsOpen(true);
  };

  const handleViewAllNotifications = () => {
    setIsAllNotificationsOpen(true);
  };

  const handleViewAllResources = () => {
    setIsResourcesOpen(true);
  };

  const handleContactSupport = () => {
    setIsHelpOpen(true);
  };

  // Adapters to handle TypeScript type mismatches
  const handlePostComment = async (postId: string, content: string): Promise<void> => {
    await commentOnPost(postId, content);
  };

  const handleReplyToComment = async (postId: string, commentId: string, content: string): Promise<void> => {
    await replyToComment(postId, commentId, content);
  };

  const handleCreatePostWrapper = async (content: string, hashtags: string): Promise<void> => {
    await createPost(content, hashtags);
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case "home":
        return (
          <DashboardTabs 
            activeSection={activeSection}
            loading={loading}
            error={error}
            posts={posts}
            likePost={likePost}
            commentOnPost={handlePostComment}
            replyToComment={handleReplyToComment}
            createPost={handleCreatePostWrapper}
            connectedPeople={connectedPeople}
            handleConnectWithPerson={handleConnectWithPerson}
            handleViewPersonProfile={handleViewPersonProfile}
          />
        );
        
      case "notifications":
        return (
          <NotificationsSection 
            isAllNotificationsOpen={isAllNotificationsOpen}
            setIsAllNotificationsOpen={setIsAllNotificationsOpen}
            handleViewAllNotifications={handleViewAllNotifications}
          />
        );
        
      case "analytics":
        return (
          <AnalyticsSection analyticsData={analyticsData} />
        );
        
      case "projects":
        return (
          <ProjectsSection 
            userProjects={userProjects}
            handleCreateProject={handleCreateProject}
            selectedProject={selectedProject}
            isProjectDetailsOpen={isProjectDetailsOpen}
            setIsProjectDetailsOpen={setIsProjectDetailsOpen}
            handleViewProject={handleViewProject}
          />
        );
        
      case "resources":
        return (
          <ResourcesSection 
            isResourcesOpen={isResourcesOpen}
            setIsResourcesOpen={setIsResourcesOpen}
            handleViewAllResources={handleViewAllResources}
          />
        );
        
      case "help":
        return (
          <HelpSection 
            isHelpOpen={isHelpOpen}
            setIsHelpOpen={setIsHelpOpen}
            handleContactSupport={handleContactSupport}
          />
        );
      
      default:
        return (
          <div className="text-center py-10">
            <h3 className="text-xl font-semibold mb-2">Select a section</h3>
            <p className="text-muted-foreground">
              Choose a section from the sidebar to view its content.
            </p>
          </div>
        );
    }
  };

  return (
    <Layout>
      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar Navigation */}
        <div className="col-span-12 md:col-span-3 lg:col-span-2 space-y-4">
          <SidebarNav 
            userName={user?.name || "User"} 
            userType={user?.type || "student"} 
            activeSection={activeSection} 
            setActiveSection={setActiveSection}
            typeIcon={getTypeIcon()}
          />
        </div>
        
        {/* Main Content */}
        <div className="col-span-12 md:col-span-9 lg:col-span-7 space-y-6">
          <SlideIn>
            <div className="glass-card p-5 rounded-xl backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  {getTypeIcon()}
                </div>
                <div>
                  <h2 className="text-xl font-semibold">
                    Welcome, {user?.name || "User"}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Your {user?.type || "dashboard"}
                  </p>
                </div>
              </div>
              
              {renderActiveSection()}
            </div>
          </SlideIn>
        </div>
        
        {/* Right Sidebar - Role-specific Content */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
          <FadeIn delay={0.2} className="hidden lg:block">
            <RoleSpecificContent 
              userType={user?.type || "student"}
              setIsCoursesOpen={setIsCoursesOpen}
              setIsManageCoursesOpen={setIsManageCoursesOpen}
              setIsPortfolioOpen={setIsPortfolioOpen}
            />
          </FadeIn>
        </div>
      </div>

      {/* Modals */}
      <UserProfileModal
        user={selectedPerson}
        open={isUserProfileOpen}
        onOpenChange={setIsUserProfileOpen}
      />

      <CoursesModal 
        open={isCoursesOpen} 
        onOpenChange={setIsCoursesOpen}
        courses={courses}
      />

      <ManageCoursesModal 
        open={isManageCoursesOpen} 
        onOpenChange={setIsManageCoursesOpen}
        courses={professorCourses}
      />

      <PortfolioModal 
        open={isPortfolioOpen} 
        onOpenChange={setIsPortfolioOpen}
        portfolioItems={portfolioItems}
      />
    </Layout>
  );
};

export default Dashboard;
