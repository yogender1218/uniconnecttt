
// Student specific API endpoints
const BASE_URL = "https://uniconnectbackend.onrender.com"; // Updated to the real API URL

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Helper function for authenticated API calls
const authenticatedFetch = async (url, options = {}) => {
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${getAuthToken()}`
  };
  
  const response = await fetch(url, {
    ...options,
    headers
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};

// Posts APIs
export const createPost = async (formData) => {
  const response = await fetch(`${BASE_URL}/api/posts/create/`, {
    method: 'POST',
    body: formData,
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`
    }
  });
  
  if (!response.ok) {
    throw new Error("Failed to create post");
  }
  
  return response.json();
};

export const listPosts = async () => {
  return authenticatedFetch(`${BASE_URL}/api/posts/list/`);
};

export const likePost = async (postId) => {
  const formData = new FormData();
  formData.append('post_id', postId);
  
  return authenticatedFetch(`${BASE_URL}/api/posts/like/`, {
    method: 'POST',
    body: formData
  });
};

export const commentOnPost = async (postId, content) => {
  const formData = new FormData();
  formData.append('post_id', postId);
  formData.append('content', content);
  
  return authenticatedFetch(`${BASE_URL}/api/posts/comment/`, {
    method: 'POST',
    body: formData
  });
};

// Startup APIs
export const createStartup = async (startupData) => {
  return authenticatedFetch(`${BASE_URL}/api/startups/create/`, {
    method: 'POST',
    body: startupData
  });
};

export const listStartups = async () => {
  return authenticatedFetch(`${BASE_URL}/api/startups/list/`);
};

export const voteStartup = async (startupId) => {
  const formData = new FormData();
  formData.append('startup_id', startupId);
  
  return authenticatedFetch(`${BASE_URL}/api/startups/vote/`, {
    method: 'POST',
    body: formData
  });
};

// Dashboard data
export const getDashboardData = async () => {
  return authenticatedFetch(`${BASE_URL}/api/dashboard/`);
};
