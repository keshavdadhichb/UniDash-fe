import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Link } from 'wouter';
import toast from 'react-hot-toast';
import './FindDeliveries.css'; // Make sure CSS is imported

// Define the shape of a single request from our API endpoint
interface AvailableRequest {
  id: number;
  itemDescription: string;
  estimatedPrice: number | null;
  deliveryLocationDetails: string;
  requesterName: string;
}

const fetchAvailableRequests = async (): Promise<AvailableRequest[]> => {
  const { data } = await api.get('/api/requests');
  return data;
};

const acceptDelivery = async (requestId: number) => {
  const { data } = await api.patch(`/api/requests/${requestId}/accept`);
  return data;
};

const FindDeliveries = () => {
  const queryClient = useQueryClient();

  const { data: requests, isLoading, error } = useQuery({
    queryKey: ['available-requests'],
    queryFn: fetchAvailableRequests,
  });

  const mutation = useMutation({
    mutationFn: acceptDelivery,
    onSuccess: (data) => {
      toast.success(`Delivery accepted! Your OTP is ${data.otp}`);
      // Refresh the list of available deliveries after one is accepted
      queryClient.invalidateQueries({ queryKey: ['available-requests'] });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || 'Failed to accept delivery.';
      toast.error(errorMessage);
    },
  });

  const handleAccept = (requestId: number) => {
    mutation.mutate(requestId);
  };

  return (
    <div className="page-container">
      <div className="page-header">
         <Link href="/dashboard" className="back-button">← Back to Dashboard</Link>
         <h2>Available Deliveries</h2>
      </div>

      {isLoading && <p>Loading available jobs...</p>}
      {error && <p className="error-message">Error fetching jobs: {error.message}</p>}
      
      {requests && requests.length === 0 && (
        <p>No available deliveries right now. Check back later!</p>
      )}

      <div className="requests-list">
        {requests?.map((request) => (
          <div key={request.id} className="request-card">
            <h3>{request.itemDescription}</h3>
            <p><strong>To:</strong> {request.deliveryLocationDetails}</p>
            <p><strong>From:</strong> {request.requesterName}</p>
            {request.estimatedPrice && <p><strong>Price:</strong> ~₹{request.estimatedPrice}</p>}
            <button
              className="accept-button"
              onClick={() => handleAccept(request.id)}
              disabled={mutation.isPending}
            >
              Accept Delivery
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FindDeliveries;