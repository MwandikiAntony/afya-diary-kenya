import axios from "axios";

const API_URL = "http://localhost:5000/api/mental-health";

export const logMood = async (data) => {
  return axios.post(`${API_URL}/log`, data);
};

export const getMoodHistory = async (userId) => {
  return axios.get(`${API_URL}/${userId}`);
};
