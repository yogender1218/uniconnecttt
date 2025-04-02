
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
import StartupButton from "../components/StartupButton";
import StartupInvestor from "../components/StartupInvestor";

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
    connectWithUser,
    fetchDashboardData 
  } = usePosts();
  
  const [activeSection, setActiveSection] = useState("home");
  const [isAllNotificationsOpen, setIsAllNotificationsOpen] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isProjectDetailsOpen, setIsProjectDetailsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isCoursesOpen, setIsCoursesOpen] = useState(false);
  const [isManageCoursesOpen, setIsManageCoursesOpen] = useState(false);
  const [isPortfolioOpen, setIsPortfolioOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [professorCourses, setProfessorCourses] = useState([]);
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [connectedPeople, setConnectedPeople] = useState([]);
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
  
  // State for student startups
  const [startups, setStartups] = useState([]);
  const [myStartups, setMyStartups] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Fetch dashboard data for student users
  useEffect(() => {
    const loadDashboardData = async () => {
      if (user?.type === 'student' && isAuthenticated) {
        try {
          const dashboardData = await fetchDashboardData();
          if (dashboardData) {
            // Set student-specific data
            if (dashboardData.my_startups) {
              setMyStartups(dashboardData.my_startups);
            }
            if (dashboardData.startups_data) {
              setStartups(dashboardData.startups_data);
            }
          }
        } catch (err) {
          console.error("Error loading dashboard data:", err);
          toast.error("Failed to load dashboard data");
        }
      }
    };
    
    loadDashboardData();
  }, [user?.type, isAuthenticated, fetchDashboardData]);

  useEffect(() => {
    // Load courses for students
    const loadStudentCourses = async () => {
      if (user?.type === 'student') {
        try {
          // For now we'll use mock data since the API doesn't provide courses yet
          const fetchedCourses = [
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
          // For now we'll use mock data
          const fetchedCourses = [
            {
              id: "pc1",
              title: "Advanced Machine Learning",
              description: "Deep dive into neural networks and reinforcement learning",
              students: 42,
              progress: 68,
              lessons: 16
            },
            {
              id: "pc2",
              title: "Data Structures and Algorithms",
              description: "Fundamental computer science concepts and implementations",
              students: 78,
              progress: 85,
              lessons: 24
            },
            {
              id: "pc3",
              title: "Web Development Fundamentals",
              description: "Building modern web applications with React",
              students: 56,
              progress: 72,
              lessons: 18
            }
          ];
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
          // For now we'll use mock data
          const fetchedPortfolio = [
            {
              id: "inv1",
              companyName: "TechEd Solutions",
              investmentDate: "Jan 15, 2023",
              amount: 150000,
              performance: 12.5,
              status: "positive"
            },
            {
              id: "inv2",
              companyName: "AI Research Labs",
              investmentDate: "Mar 22, 2023",
              amount: 250000,
              performance: -3.2,
              status: "negative"
            },
            {
              id: "inv3",
              companyName: "Blockchain Academy",
              investmentDate: "Nov 10, 2022",
              amount: 100000,
              performance: 8.7,
              status: "positive"
            }
          ];
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
  const handleConnectWithPerson = async (personId) => {
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
  const handleViewPersonProfile = (person) => {
    setSelectedPerson(person);
    setIsUserProfileOpen(true);
  };

  const handleCreatePost = async (content, hashtags, files) => {
    try {
      await createPost(content, hashtags, files);
      toast.success("Post created successfully!");
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post");
    }
  };

  const handleCreateProject = (projectData) => {
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

  const handleViewProject = (project) => {
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
            commentOnPost={commentOnPost}
            replyToComment={replyToComment}
            createPost={handleCreatePost}
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
          <StartupButton></StartupButton>
          <StartupInvestor></StartupInvestor>
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
