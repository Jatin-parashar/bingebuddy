import apiClient from "./baseService";

export const getContentDetails = async (contentType,contentId) =>{
    return await apiClient.get(`/${contentType}/${contentId}`);
}

export const getContentCredits = async (contentType,contentId) =>{
    return await apiClient.get(`/${contentType}/${contentId}/credits`);
}

export const getContentVideos = async (contentType,contentId) =>{
    return await apiClient.get(`/${contentType}/${contentId}/videos`);
}
