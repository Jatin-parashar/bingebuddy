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

export const getSearchedContent = async (queryString) => {
  return await apiClient.get(
    `/search/multi?query=${queryString}&include_adult=false&language=en-US&page=1`
  );
};