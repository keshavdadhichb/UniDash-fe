import { z } from 'zod';

export const requestDeliverySchema = z.object({
  itemDescription: z.string().min(3, "Please describe the item."),
  pickupLocation: z.string().min(3, "Please specify a pickup location."),
  requesterPhone: z.string().min(10, "A valid phone number is required."),

  // The main fix: Use a string union instead of a boolean.
  deliveryMethod: z.enum(['campus', 'hostel']),

  // Conditionally required fields
  hostelType: z.string().optional(),
  hostelBlock: z.string().optional(),
  hostelRoom: z.string().optional(),
  campusLocation: z.string().optional(),
  specialInstructions: z.string().optional(),
}).superRefine((data, ctx) => {
  // Updated logic to check the new deliveryMethod property
  if (data.deliveryMethod === 'hostel') {
    if (!data.hostelType) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Hostel type is required.", path: ["hostelType"]});
    if (!data.hostelBlock) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Block is required.", path: ["hostelBlock"]});
    if (!data.hostelRoom) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Room number is required.", path: ["hostelRoom"]});
  } else { // This means deliveryMethod is 'campus'
    if (!data.campusLocation) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "A campus location is required.", path: ["campusLocation"]});
  }
});

export type RequestDeliverySchema = z.infer<typeof requestDeliverySchema>;