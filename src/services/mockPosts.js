let posts = [
  { 
    id: 1, 
    content: 'As a student, I find the new library resources incredibly useful for my research #student #library', 
    hashtags: ['#student', '#library'], 
    createdAt: new Date(), 
    likes: 3, 
    comments: ["Great resource!", "Thanks for sharing!"], 
    liked: false 
  },
  { 
    id: 2, 
    content: 'Investing in renewable energy is the future. #investor #greenenergy', 
    hashtags: ['#investor', '#greenenergy'], 
    createdAt: new Date(), 
    likes: 5, 
    comments: ["I agree!", "Well said."], 
    liked: false 
  },
  { 
    id: 3, 
    content: 'The latest research on quantum computing shows promising advancements. #professor #quantumcomputing', 
    hashtags: ['#professor', '#quantumcomputing'], 
    createdAt: new Date(), 
    likes: 7, 
    comments: ["Fascinating!", "Looking forward to more updates."], 
    liked: false 
  }
];
// Like a post
export const likePost = (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const post = posts.find((p) => p.id === id);
      if (post) {
        post.liked = !post.liked;
        post.likes += post.liked ? 1 : -1;
        resolve(post);
      } else {
        resolve(null);
      }
    }, 500);
  });
};

// Comment on a post
export const commentOnPost = (id, comment) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const post = posts.find((p) => p.id === id);
      if (post) {
        post.comments.push(comment);
        resolve(post);
      } else {
        resolve(null);
      }
    }, 500);
  });
};

// Mock posts for display
export const mockPosts = [
  { 
    id: 1, 
    content: 'As a student, I find the new library resources incredibly useful for my research #student #library', 
    hashtags: ['#student', '#library'], 
    createdAt: new Date(), 
    likes: 3, 
    comments: ["Great resource!", "Thanks for sharing!"], 
    liked: false 
  },
  { 
    id: 2, 
    content: 'Investing in renewable energy is the future. #investor #greenenergy', 
    hashtags: ['#investor', '#greenenergy'], 
    createdAt: new Date(), 
    likes: 5, 
    comments: ["I agree!", "Well said."], 
    liked: false 
  },
  { 
    id: 3, 
    content: 'The latest research on quantum computing shows promising advancements. #professor #quantumcomputing', 
    hashtags: ['#professor', '#quantumcomputing'], 
    createdAt: new Date(), 
    likes: 7, 
    comments: ["Fascinating!", "Looking forward to more updates."], 
    liked: false 
  }
];

let nextPostId = 3;

// Function to create a new post
export const createPost = (content, hashtags, files) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const newPost = {
        id: nextPostId++,
        content: content,
        user: "CurrentUser",
        likes: 0,
        comments: [],
        timestamp: new Date().toISOString(),
        hashtags: hashtags.split(',').map(tag => tag.trim()),
        media_files: files.map(file => ({
          url: URL.createObjectURL(file),
          type: file.type,
          name: file.name
        })),
        liked: false,
        createdAt: new Date()
      };
      posts.unshift(newPost); // Add to the beginning of the array
      mockPosts.unshift(newPost);
      resolve(newPost);
    }, 500);
  });
};

// Function to fetch all posts
export const getPosts = () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(posts), 1000);
  });
};