
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import * as studentApi from "../services/studentApi";
import { useAuth } from "@/contexts/AuthContext";

export const usePosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Fetch all posts
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      let fetchedPosts;
      
      if (user?.type === "student") {
        // Use student-specific API for students
        fetchedPosts = await studentApi.listPosts();
      } else {
        // For other user types, use the mock API
        fetchedPosts = await fetch('/api/posts').then(res => res.json());
      }
      
      setPosts(fetchedPosts);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Failed to load posts. Please try again.");
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  }, [user?.type]);

  // Create a new post
  const createPost = useCallback(async (content, hashtags, files) => {
    try {
      // Create FormData to send files
      const formData = new FormData();
      formData.append("content", content);
      formData.append("hashtag", hashtags);
      
      // Add files if present
      if (files && files.length) {
        files.forEach((file, index) => {
          formData.append(`file${index}`, file);
        });
      }
      
      let newPost;
      
      if (user?.type === "student") {
        newPost = await studentApi.createPost(formData);
      } else {
        // Mock API for other user types
        newPost = {
          id: `post-${Date.now()}`,
          content,
          hashtags,
          author: user,
          createdAt: new Date().toISOString(),
          likes: 0,
          liked: false,
          comments: []
        };
      }
      
      setPosts(prevPosts => [newPost, ...prevPosts]);
      
      toast.success("Post created successfully!");
      
      return newPost;
    } catch (err) {
      console.error("Error creating post:", err);
      toast.error("Failed to create post");
      throw err;
    }
  }, [user]);

  // Like a post
  const likePost = useCallback(async (postId) => {
    try {
      // Optimistic update
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId 
            ? { 
                ...post, 
                likes: post.liked ? post.likes - 1 : post.likes + 1,
                liked: !post.liked 
              } 
            : post
        )
      );
      
      let result;
      
      if (user?.type === "student") {
        result = await studentApi.likePost(postId);
      } else {
        // Mock result for other user types
        result = { success: true };
      }
      
      if (!result.success && typeof result.success !== 'undefined') {
        // Revert if the API call fails
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post.id === postId 
              ? { 
                  ...post, 
                  likes: post.liked ? post.likes + 1 : post.likes - 1,
                  liked: !post.liked 
                } 
              : post
          )
        );
        
        toast.error("Failed to like post");
      }
    } catch (err) {
      console.error("Error liking post:", err);
      // Revert the optimistic update
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId 
            ? { 
                ...post, 
                likes: post.liked ? post.likes + 1 : post.likes - 1,
                liked: !post.liked 
              } 
            : post
        )
      );
      
      toast.error("Failed to like post");
    }
  }, [user?.type]);

  // Comment on a post
  const commentOnPost = useCallback(async (postId, content) => {
    try {
      let newComment;
      
      if (user?.type === "student") {
        newComment = await studentApi.commentOnPost(postId, content);
      } else {
        // Mock comment for other user types
        newComment = {
          id: `comment-${Date.now()}`,
          content,
          author: user,
          createdAt: new Date().toISOString(),
          replies: []
        };
      }
      
      // Update posts with the new comment
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId 
            ? { ...post, comments: [...(post.comments || []), newComment] } 
            : post
        )
      );
      
      toast.success("Comment added");
      
      return newComment;
    } catch (err) {
      console.error("Error commenting on post:", err);
      
      toast.error("Failed to add comment");
      
      throw err;
    }
  }, [user]);

  // Reply to a comment
  const replyToComment = useCallback(async (postId, commentId, content) => {
    try {
      // For now, we'll use a mock reply since the API doesn't support it yet
      const newReply = {
        id: `reply-${Date.now()}`,
        content,
        author: user,
        createdAt: new Date().toISOString()
      };
      
      // Update posts with the new reply
      setPosts(prevPosts => 
        prevPosts.map(post => {
          if (post.id !== postId) return post;
          
          return {
            ...post,
            comments: (post.comments || []).map(comment => {
              if (comment.id !== commentId) return comment;
              
              return {
                ...comment,
                replies: [...(comment.replies || []), newReply]
              };
            })
          };
        })
      );
      
      toast.success("Reply added");
      
      return newReply;
    } catch (err) {
      console.error("Error replying to comment:", err);
      
      toast.error("Failed to add reply");
      
      throw err;
    }
  }, [user]);

  // Connect with a user
  const connectWithUser = useCallback(async (userId) => {
    try {
      // Mock connection for now since the API doesn't support it yet
      const result = { success: true };
      
      toast.success("Connection request sent!");
      
      return result;
    } catch (err) {
      console.error("Error connecting with user:", err);
      
      toast.error("Failed to send connection request");
      
      throw err;
    }
  }, []);

  // Load posts on initial render
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Fetch dashboard data for students
  const fetchDashboardData = useCallback(async () => {
    if (user?.type !== "student") return;
    
    try {
      const dashboardData = await studentApi.getDashboardData();
      // Set posts from dashboard data
      if (dashboardData.posts_data) {
        setPosts(dashboardData.posts_data);
      }
      return dashboardData;
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      toast.error("Failed to load dashboard data");
    }
  }, [user?.type]);

  return {
    posts,
    loading,
    error,
    fetchPosts,
    createPost,
    likePost,
    commentOnPost,
    replyToComment,
    connectWithUser,
    fetchDashboardData
  };
};
