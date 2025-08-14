import axios from 'axios';

export const api = axios.create({
  // Use Vite's syntax for environment variables
  baseURL: import.meta.env.VITE_API_BASE_URL, 
  withCredentials: true,
});