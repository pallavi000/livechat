import axios from "axios";

export const baseURL = "http://localhost:5000/api";

const AxiosInstance = axios.create({
  baseURL: baseURL,
});

AxiosInstance.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default AxiosInstance;
