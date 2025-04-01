// Student-specific API endpoints
const BASE_URL = "https://uniconnectbackend.onrender.com"; // Updated to the real API URL


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
