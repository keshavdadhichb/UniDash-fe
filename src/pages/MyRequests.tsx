import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Link } from 'wouter';
import './MyRequests.css';

interface MyRequest {
  id: number;
  itemDescription: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  otp: string | null;
  deliveryLocationDetails: string;
  createdAt: string;
  delivererName: string | null;
}

const fetchMyRequests = async (): Promise<MyRequest[]> => {
  const { data } = await api.get('/api/my-requests');
  return data;
};

const MyRequests = () => {
  const { data: requests, isLoading, error } = useQuery({
    queryKey: ['my-requests'],
    queryFn: fetchMyRequests,
  });

  const getStatusInfo = (status: MyRequest['status']) => {
    switch (status) {
      case 'pending':
        return { text: 'Awaiting Deliverer', className: 'status-pending' };
      case 'in_progress':
        return { text: 'In Progress', className: 'status-in-progress' };
      case 'completed':
        return { text: 'Completed', className: 'status-completed' };
      case 'cancelled':
        return { text: 'Cancelled', className: 'status-cancelled' };
      default:
        return { text: 'Unknown', className: '' };
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <Link href="/dashboard" className="back-button">← Back to Dashboard</Link>
        <h2>My Delivery Requests</h2>
      </div>

      {isLoading && <p>Loading your requests...</p>}
      {error && <p className="error-message">Error fetching requests: {(error as Error).message}</p>}

      {requests && requests.length === 0 && (
        <p>You haven't made any delivery requests yet.</p>
      )}

      <div className="requests-list">
        {requests?.map((request) => {
          const statusInfo = getStatusInfo(request.status);

          return (
            <div key={request.id} className={`my-request-card ${statusInfo.className}`}>
              <div className="card-header">
                <h3>{request.itemDescription}</h3>
                <span className={`status-badge ${statusInfo.className}`}>{statusInfo.text}</span>
              </div>

              <div className="card-body">
                <p><strong>To:</strong> {request.deliveryLocationDetails}</p>
                <p><strong>Requested:</strong> {new Date(request.createdAt).toLocaleString()}</p>

                {/* Deliverer & OTP info if in progress */}
                {request.status === 'in_progress' && (
                  <>
                    {request.delivererName && (
                      <p><strong>Deliverer:</strong> {request.delivererName}</p>
                    )}
                    <div className="otp-display">
                      Your OTP: <span>{request.otp}</span>
                    </div>
                    <p className="otp-instruction">
                      Share this code with the deliverer upon receiving your item.
                    </p>
                  </>
                )}
              </div>

              {/* Cancel button only for pending */}
              {request.status === 'pending' && (
                <div className="card-footer">
                  <button disabled>Cancel Request</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyRequests;
