// services/startupAPI.js

let startups = [];  // 📦 Yahi humara local database hai, apne dil ka treasure!

// 🖋️ Nayi startup entry save karne ke liye
export const submitStartup = async (formData) => {
  try {
    startups.push({
      ...formData,
      studentName: 'Anonymous'  // Ya jo bhi chaho default
    });
    console.log('🌱 Startup added locally:', formData);
    return { message: 'Startup submitted successfully!' };
  } catch (error) {
    console.error('❌ Failed to submit startup locally:', error);
    throw '⚠️ Failed to submit startup';
  }
};

// 📖 Sabhi startups ko lane ke liye
export const getStartups = async () => {
  return startups;
};
