
import { useState, useEffect, useCallback } from "react";
import { api, Post, Comment } from "../services/api";
import { toast } from "sonner";

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all posts
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const fetchedPosts = await api.getPosts();
      setPosts(fetchedPosts);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Failed to load posts. Please try again.");
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new post
  const createPost = useCallback(async (content: string, hashtags: string) => {
    try {
      const newPost = await api.createPost(content, hashtags);
      setPosts(prevPosts => [newPost, ...prevPosts]);
      toast.success("Post created successfully!");
      return newPost;
    } catch (err) {
      console.error("Error creating post:", err);
      toast.error("Failed to create post");
      throw err;
    }
  }, []);

  // Like a post
  const likePost = useCallback(async (postId: string) => {
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
      
      const result = await api.likePost(postId);
      
      if (!result.success) {
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
  }, []);

  // Comment on a post
  const commentOnPost = useCallback(async (postId: string, content: string) => {
    try {
      const newComment = await api.commentPost(postId, content);
      
      // Update posts with the new comment
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId 
            ? { ...post, comments: [...post.comments, newComment] } 
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
  }, []);

  // Reply to a comment
  const replyToComment = useCallback(async (postId: string, commentId: string, content: string) => {
    try {
      const newReply = await api.replyToComment(postId, commentId, content);
      
      // Update posts with the new reply
      setPosts(prevPosts => 
        prevPosts.map(post => {
          if (post.id !== postId) return post;
          
          return {
            ...post,
            comments: post.comments.map(comment => {
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
  }, []);

  // Connect with a user
  const connectWithUser = useCallback(async (userId: string) => {
    try {
      const result = await api.connectWithUser(userId);
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

  return {
    posts,
    loading,
    error,
    fetchPosts,
    createPost,
    likePost,
    commentOnPost,
    replyToComment,
    connectWithUser
  };
};
