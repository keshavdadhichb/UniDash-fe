import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

// Define the shape of our user data
interface User {
  id: number;
  name: string;
  email: string;
  avatarUrl: string;
}

async function fetchUser() {
  const { data } = await api.get<{ user: User }>('/api/me');
  return data.user;
}

export function useUser() {
  return useQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
    retry: false, // Don't retry on failure (e.g., 401 Unauthorized)
  });
}