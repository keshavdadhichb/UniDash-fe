import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Link } from 'wouter';
import toast from 'react-hot-toast';
import './MyDeliveries.css';

interface MyDelivery {
  id: number;
  itemDescription: string;
  deliveryLocationDetails: string;
  requesterName: string;
  requesterPhone: string;
}

const fetchMyDeliveries = async (): Promise<MyDelivery[]> => {
  const { data } = await api.get('/api/my-deliveries');
  return data;
};

const completeDelivery = async ({ requestId, otp }: { requestId: number; otp: string }) => {
  const { data } = await api.post(`/api/requests/${requestId}/complete`, { otp });
  return data;
};

const DeliveryCard = ({ delivery }: { delivery: MyDelivery }) => {
  const [otp, setOtp] = useState('');
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: completeDelivery,
    onSuccess: () => {
      toast.success('Delivery marked as complete!');
      // Keep both views in sync
      queryClient.invalidateQueries({ queryKey: ['my-deliveries'] });
      queryClient.invalidateQueries({ queryKey: ['my-requests'] });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || 'Failed to complete delivery.';
      toast.error(errorMessage);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 4) {
      toast.error('Please enter a 4-digit OTP.');
      return;
    }
    mutation.mutate({ requestId: delivery.id, otp });
  };

  return (
    <div className="delivery-card">
      <h3>{delivery.itemDescription}</h3>
      <p><strong>Deliver To:</strong> {delivery.deliveryLocationDetails}</p>
      <p><strong>Requester:</strong> {delivery.requesterName}</p>
      <p>
        <strong>Requester Phone:</strong>{' '}
        <a href={`tel:${delivery.requesterPhone}`}>{delivery.requesterPhone}</a>
      </p>
      <form onSubmit={handleSubmit} className="otp-form">
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter 4-digit OTP"
          maxLength={4}
          required
        />
        <button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Completing...' : 'Complete Delivery'}
        </button>
      </form>
    </div>
  );
};

const MyDeliveries = () => {
  const { data: deliveries, isLoading, error } = useQuery({
    queryKey: ['my-deliveries'],
    queryFn: fetchMyDeliveries,
  });

  return (
    <div className="page-container">
      <div className="page-header">
        <Link href="/dashboard" className="back-button">← Back to Dashboard</Link>
        <h2>My Active Deliveries</h2>
      </div>

      {isLoading && <p>Loading your deliveries...</p>}
      {error && <p className="error-message">Error: {(error as Error).message}</p>}

      {deliveries && deliveries.length === 0 && (
        <p>You have no active deliveries.</p>
      )}

      <div className="deliveries-list">
        {deliveries?.map((delivery) => (
          <DeliveryCard key={delivery.id} delivery={delivery} />
        ))}
      </div>
    </div>
  );
};

export default MyDeliveries;
