import apiClient from "./baseService";

export const getContentDetails = async (contentType, contentId) => {
  return await apiClient.get(`/${contentType}/${contentId}`);
};

export const getContentCredits = async (contentType, contentId) => {
  return await apiClient.get(`/${contentType}/${contentId}/credits`);
};

export const getContentVideos = async (contentType, contentId) => {
  return await apiClient.get(`/${contentType}/${contentId}/videos`);
};

export const getContentRecommendations = async (contentType, contentId) => {
  return await apiClient.get(`/${contentType}/${contentId}/recommendations`);
};

export const getCategoryList = async (contentType, category, page) => {
  return await apiClient.get(
    `/${contentType}/${category}?language=en-US&page=${page}`
  );
};

export const getTrending = async () => {
  return await apiClient.get(`/trending/all/day`);
};



// Assuming apiClient is your Axios instance
apiClient.interceptors.request.use((config) => {
    const { baseURL, url, method, headers, params, data } = config;
  
    // Construct the full URL with baseURL and path
    const fullUrl = `${baseURL}${url}`;
    
    // Log the full API request details
    console.log("Intercepted API Request:");
    console.log("URL:", fullUrl);
    console.log("Method:", method);
    console.log("Headers:", headers);
    console.log("Params:", params);
    console.log("Body:", data);
  
    // Return the modified config or just the original config if no changes are needed
    return config;
  }, (error) => {
    // Handle errors before they are sent
    return Promise.reject(error);
  });
  