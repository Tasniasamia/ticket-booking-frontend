import axios from "axios";
import { getToken } from "./session";

const baseURL = process.env.NEXT_PUBLIC_API_URL; 
export const publicApi = axios.create({ baseURL, timeout: 15000 });
export const api = axios.create({ baseURL, timeout: 15000 });
api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
