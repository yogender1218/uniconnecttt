import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";
import CreatePostForm from "@/components/CreatePostForm";
import PostCard from "@/components/PostCard";
import { StaggeredContainer } from "@/components/Animations";
import PersonCard from "@/components/dashboard/PersonCard";
import ActivityCard from "@/components/dashboard/ActivityCard";
import DiscoverCard from "@/components/dashboard/DiscoverCard";
import { discoverPosts, trendingTopics, peopleToFollow, followingActivities } from "@/data/dashboardData";
import { Separator } from "@/components/ui/separator";
import { getPosts, mockPosts, likePost, commentOnPost } from "@/services/mockPosts";

const DashboardTabs = ({
  activeSection,
  loading,
  error,
  posts = [], // Default to an empty array if posts is undefined
  likePost,
  commentOnPost,
  replyToComment,
  createPost,
  connectedPeople,
  handleConnectWithPerson,
  handleViewPersonProfile
}) => {
  const [postList, setPostList] = useState(posts.length > 0 ? posts : mockPosts);

  const handleCreatePost = async (content, hashtags, files) => {
    try {
      const newPost = await createPost(content, hashtags, files);
      setPostList([newPost, ...postList]); // Prepend new post
      toast.success("Post created successfully!");
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post");
    }
  };

  const handleLikePost = async (postId) => {
    const updatedPost = await likePost(postId);
    if (updatedPost) {
      setPostList(postList.map(post => post.id === postId ? updatedPost : post));
    }
  };

  const handleCommentOnPost = async (postId, comment) => {
    const updatedPost = await commentOnPost(postId, comment);
    if (updatedPost) {
      setPostList(postList.map(post => post.id === postId ? updatedPost : post));
    }
  };

  const renderTabContent = (tab) => {
    switch (tab) {
      case "discover":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Recommended for You</h3>
              <Button variant="link" size="sm" className="text-muted-foreground" onClick={() => toast.success("Showing all recommended content")}>
                See all
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {discoverPosts.map((post, index) => (
                <DiscoverCard key={index} {...post} />
              ))}
            </div>
            
            <Separator />
            
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Trending Topics</h3>
              <Button variant="link" size="sm" className="text-muted-foreground" onClick={() => toast.success("Showing more trending topics")}>
                View more
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {trendingTopics.map((topic, index) => (
                <Badge key={index} variant="secondary" className="text-sm py-1 px-3">
                  {topic}
                </Badge>
              ))}
            </div>
            
            <Separator />
            
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">People to Follow</h3>
              <Button variant="link" size="sm" className="text-muted-foreground" onClick={() => toast.success("Showing all people to follow")}>
                View all
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {peopleToFollow.map((person, index) => (
                <PersonCard 
                  key={index} 
                  {...person} 
                  id={`person-${index}`}
                  onClick={() => handleViewPersonProfile(person)}
                  onConnect={() => handleConnectWithPerson(`person-${index}`)}
                  isConnected={connectedPeople.includes(`person-${index}`)}
                />
              ))}
            </div>
          </div>
        );
      
      case "following":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Your Network</h3>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={() => toast.success("Finding people to connect with")}
              >
                <UserPlus size={14} />
                <span>Find People</span>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {followingActivities.map((activity, index) => (
                <ActivityCard 
                  key={index} 
                  person={activity.user}
                  activity={activity.action}
                  target={activity.target}
                  time={activity.time}
                  onView={() => handleViewPersonProfile(activity.user)}
                />
              ))}
            </div>
            
            <div className="flex justify-center mt-6">
              <Button 
                variant="outline"
                onClick={() => toast.success("Loading more activities")}
              >
                Load More
              </Button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  if (activeSection !== "home") {
    return null; // Will redirect in useEffect
  }

  const fetchPosts = async () => {
    try {
      const fetchedPosts = await getPosts();
      setPostList(fetchedPosts);
      toast.success("Posts fetched successfully");
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to fetch posts");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <Tabs defaultValue="feed">
      <TabsList className="w-full">
        <TabsTrigger value="feed" className="flex-1">Feed</TabsTrigger>
        <TabsTrigger value="discover" className="flex-1">Discover</TabsTrigger>
        <TabsTrigger value="following" className="flex-1">Following</TabsTrigger>
      </TabsList>
      <TabsContent value="feed" className="pt-4">
        <CreatePostForm onCreatePost={handleCreatePost} className="mb-6" />
        
        {loading ? (
          <div className="flex justify-center p-8">
            <p>Loading posts...</p>
          </div>
        ) : (
          <StaggeredContainer className="space-y-6" animation="fade" initialDelay={0.1} staggerDelay={0.15}>
            {postList.filter(post => post).map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={handleLikePost}
                onComment={handleCommentOnPost}
                onReplyToComment={replyToComment}
              />
            ))}
          </StaggeredContainer>
        )}

        {error && (
          <div className="text-center p-8 text-destructive">
            <p>{error}</p>
            <Button variant="outline" className="mt-2" onClick={fetchPosts}>
              Retry
            </Button>
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="discover" className="pt-4">
        {renderTabContent("discover")}
      </TabsContent>
      
      <TabsContent value="following" className="pt-4">
        {renderTabContent("following")}
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;