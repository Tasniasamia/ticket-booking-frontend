import { z } from "zod";

// Backend CreateCheckoutRequest এর সব field required, তাই billing এর সবগুলোই লাগে।
export const bookingSchema = z.object({
  event_id: z.number().int().positive(),
  quantity: z.number().int().min(1, "Choose at least 1 ticket").max(10, "You can book up to 10 tickets at once"),
  payment_method: z.string().min(1, "Select a payment method"),
  customer_name: z.string().trim().min(2, "Enter your full name"),
  customer_email: z.email("Enter a valid email address"),
  customer_phone_number: z.string().trim().min(6, "Enter a valid phone number").max(20, "Phone number is too long"),
  customer_address: z.string().trim().min(5, "Enter your address"),
  country: z.string().trim().min(2, "Enter your country"),
  postcode: z.string().trim().min(3, "Enter your postcode").max(12, "Postcode is too long"),
});

export type BookingInput = z.infer<typeof bookingSchema>;
