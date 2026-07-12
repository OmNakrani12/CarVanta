import { z } from 'zod';

// register schema
export const registerSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z.string().trim().email('Must be a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  role: z.enum(['ADMIN', 'USER']).default('USER'),
});

export type RegisterInput = z.infer<typeof registerSchema>;

//login schema
export const loginSchema = z.object({
  email: z.string().trim().email('Must be a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const vehicleSchema = z.object({
  make: z.string().trim().min(1, 'Make is required'),
  model: z.string().trim().min(1, 'Model is required'),
  category: z.string().trim().min(1, 'Category is required'),
  price: z.preprocess(
    (val) => Number(val),
    z.number().positive('Price must be greater than 0')
  ),
  quantity: z.preprocess(
    (val) => Number(val),
    z.number().int().nonnegative('Quantity must be 0 or more')
  ),
});
export type VehicleInput = z.infer<typeof vehicleSchema>;

export const restockSchema = z.object({
  quantity: z.preprocess(
    (val) => Number(val),
    z.number().int().positive('Restock quantity must be greater than 0')
  ),
});

export type RestockInput = z.infer<typeof restockSchema>;



