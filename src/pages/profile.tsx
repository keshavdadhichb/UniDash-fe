import { useUser } from '../hooks/useUser';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import toast from 'react-hot-toast';
import { useLocation } from 'wouter';
import { Link } from 'wouter';
import './Profile.css';

interface UserStats {
  requestsCreated: number;
  deliveriesCompleted: number;
}

const fetchUserStats = async (): Promise<UserStats> => {
  const { data } = await api.get('/api/me/stats');
  return data;
};

const logout = async () => {
  await api.post('/auth/logout');
};

const Profile = () => {
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();
  const { data: user } = useUser();
  const { data: stats } = useQuery({
    queryKey: ['user-stats'],
    queryFn: fetchUserStats,
  });

  const mutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // Clear all user data from the cache
      queryClient.clear();
      // Redirect to login page
      navigate('/');
    },
    onError: () => {
      toast.error('Logout failed. Please try again.');
    },
  });

  return (
    <div className="page-container profile-container">
      {/* THIS HEADER IS NOW SIMPLIFIED */}
      <div className="profile-header">
        <h2>{user?.name}</h2>
        <p>{user?.email}</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>{stats?.requestsCreated ?? '...'}</h3>
          <p>Requests Made</p>
        </div>
        <div className="stat-card">
          <h3>{stats?.deliveriesCompleted ?? '...'}</h3>
          <p>Deliveries Completed</p>
        </div>
      </div>

      <div className="profile-actions">
        <h3>Quick Actions</h3>
        <div className="quick-links">
          <Link href="/request-delivery"><a>Request a Delivery</a></Link>
          <Link href="/find-deliveries"><a>Find Deliveries</a></Link>
          <Link href="/my-requests"><a>My Requests</a></Link>
          <Link href="/my-deliveries"><a>My Deliveries</a></Link>
        </div>
        <button onClick={() => mutation.mutate()} className="logout-button">
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Profile;