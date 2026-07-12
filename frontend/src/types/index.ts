export type Role = 'ADMIN' | 'USER';

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    createdAt: string;
    updatedAt: string;
}
export interface Vehicle {
  id: string;
  make: string;
  model: string;
  category: string;
  price: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
export interface ApiError {
    success: boolean;
    message: string;
    errors: Array<{
        field?: string;
        message: string;
    }>;
}
export interface AuthResponse {
    token: string;
    user: User;
}