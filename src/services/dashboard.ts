import api from "../lib/axiosInstance";

export const getDashboardService = async () => {
  const response = await api.get(`/api/users/stats`,);
  return response.data;
};
