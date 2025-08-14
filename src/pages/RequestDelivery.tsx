import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { requestDeliverySchema } from '../lib/schemas';
import type { RequestDeliverySchema } from '../lib/schemas';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import toast from 'react-hot-toast';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import './RequestDelivery.css';

// Helper to generate block letters
const generateBlocks = (start: string, end: string, exclude: string[]) => {
  const result = [];
  for (let i = start.charCodeAt(0); i <= end.charCodeAt(0); i++) {
    const char = String.fromCharCode(i);
    if (!exclude.includes(char)) {
      result.push(char);
    }
  }
  return result;
};

const mensBlocks = generateBlocks('A', 'T', ['I', 'O']);
const ladiesBlocks = generateBlocks('A', 'J', ['I']);

const createRequest = async (data: any) => {
  const response = await api.post('/api/requests', data);
  return response.data;
};

const RequestDelivery = () => {
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();

  const {
    register, handleSubmit, control, watch, setValue,
    formState: { errors },
  } = useForm<RequestDeliverySchema>({
    resolver: zodResolver(requestDeliverySchema),
    defaultValues: { deliveryMethod: 'campus' },
  });

  const deliveryMethod = watch('deliveryMethod');
  const hostelType = watch('hostelType');

  const mutation = useMutation({
    mutationFn: createRequest,
    onSuccess: () => {
      toast.success('Delivery request created successfully!');
      queryClient.invalidateQueries({ queryKey: ['my-requests'] });
      navigate('/my-requests');
    },
    onError: (error) => {
      toast.error(error.message || 'An error occurred.');
    },
  });

  const onSubmit = (data: RequestDeliverySchema) => {
    const deliveryLocationType = data.deliveryMethod;
    const deliveryLocationDetails = data.deliveryMethod === 'hostel'
      ? `${data.hostelType}, ${data.hostelBlock} Block, Room ${data.hostelRoom}`
      : data.campusLocation!;

    const submissionData = { ...data, deliveryLocationType, deliveryLocationDetails };
    mutation.mutate(submissionData);
  };

  const fieldAnimation = {
    initial: { opacity: 0, height: 0 },
    animate: { opacity: 1, height: 'auto' },
    exit: { opacity: 0, height: 0 },
    transition: { duration: 0.3 }
  };

  return (
    <motion.div className="page-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="page-header">
        <button onClick={() => navigate('/dashboard')} className="back-button">← Back</button>
        <h2>Create New Delivery Request</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="request-form" noValidate>
        <div className="form-step">
          <h3>1. What are we delivering?</h3>
          <div className="form-group">
            <label htmlFor="itemDescription">Short description of the item*</label>
            <input id="itemDescription" {...register('itemDescription')} placeholder="e.g., Medium Amazon Box" />
            {errors.itemDescription && <p className="error-message">{errors.itemDescription.message}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="pickupLocation">Where should we pick it up from?*</label>
            <input id="pickupLocation" {...register('pickupLocation')} placeholder="e.g., Main Gate Parcel Office" />
            {errors.pickupLocation && <p className="error-message">{errors.pickupLocation.message}</p>}
          </div>
        </div>

        <div className="form-step">
          <h3>2. Where should we deliver it to?</h3>
          <div className="delivery-toggle">
            <button type="button" onClick={() => setValue('deliveryMethod', 'campus')} className={deliveryMethod === 'campus' ? 'active' : ''}>Campus Location</button>
            <button type="button" onClick={() => setValue('deliveryMethod', 'hostel')} className={deliveryMethod === 'hostel' ? 'active' : ''}>Hostel Room</button>
          </div>

          <AnimatePresence mode="wait">
            {deliveryMethod === 'campus' ? (
              <motion.div key="campus" {...fieldAnimation}>
                <div className="form-group">
                  <label htmlFor="campusLocation">Select a campus location*</label>
                  <select id="campusLocation" {...register('campusLocation')}>
                    <option value="">Choose a location...</option>
                    <option value="Main Gate">Main Gate</option>
                    <option value="Library">Library</option>
                    <option value="SJT Food Court">SJT Food Court</option>
                    <option value="TT Food Court">TT Food Court</option>
                  </select>
                  {errors.campusLocation && <p className="error-message">{errors.campusLocation.message}</p>}
                </div>
              </motion.div>
            ) : (
              <motion.div key="hostel" {...fieldAnimation} className="hostel-fields">
                <div className="form-group">
                  <label>Hostel Type*</label>
                  <Controller name="hostelType" control={control} render={({ field }) => (
                    <div className="radio-group-pills">
                      <button type="button" onClick={() => field.onChange("Men's Hostel")} className={field.value === "Men's Hostel" ? 'active' : ''}>Men's</button>
                      <button type="button" onClick={() => field.onChange("Ladies' Hostel")} className={field.value === "Ladies' Hostel" ? 'active' : ''}>Ladies'</button>
                    </div>
                  )} />
                  {errors.hostelType && <p className="error-message">{errors.hostelType.message}</p>}
                </div>
                <div className="form-group">
                  <label htmlFor="hostelBlock">Block*</label>
                  <select id="hostelBlock" {...register('hostelBlock')} disabled={!hostelType}>
                    <option value="">Select block...</option>
                    {hostelType === "Men's Hostel" && mensBlocks.map(b => <option key={b} value={b}>{b}</option>)}
                    {hostelType === "Ladies' Hostel" && ladiesBlocks.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                  {errors.hostelBlock && <p className="error-message">{errors.hostelBlock.message}</p>}
                </div>
                <div className="form-group">
                  <label htmlFor="hostelRoom">Room Number*</label>
                  <input id="hostelRoom" {...register('hostelRoom')} placeholder="e.g., 404" />
                  {errors.hostelRoom && <p className="error-message">{errors.hostelRoom.message}</p>}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="form-step">
          <h3>3. Final Details</h3>
          <div className="form-group">
            <label htmlFor="requesterPhone">Your Contact Number*</label>
            <input id="requesterPhone" type="tel" {...register('requesterPhone')} />
            {errors.requesterPhone && <p className="error-message">{errors.requesterPhone.message}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="specialInstructions">Additional Details (Optional)</label>
            <textarea id="specialInstructions" {...register('specialInstructions')} placeholder="e.g., It's fragile, please call me when you reach the block." />
          </div>
        </div>

        <button type="submit" className="submit-button" disabled={mutation.isPending}>
          {mutation.isPending ? 'Placing Request...' : 'Confirm and Place Request'}
        </button>
      </form>
    </motion.div>
  );
};

export default RequestDelivery;