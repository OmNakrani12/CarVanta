import { http, HttpResponse } from 'msw';
import type { Vehicle } from '../../types';
const mockVehicles: Vehicle[] = [
  {
    id: 'vehicle-1',
    make: 'Toyota',
    model: 'RAV4',
    category: 'SUV',
    price: 30000,
    quantity: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'vehicle-2',
    make: 'Tesla',
    model: 'Model 3',
    category: 'Sedan',
    price: 45000,
    quantity: 0, // Out of stock for testing purchase disabled status
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const handlers = [
  // Authentication
  http.post('*/api/auth/login', async () => {
    return HttpResponse.json({
      success: true,
      message: 'Login successful',
      data: {
        token: 'mock-jwt-token',
        user: {
          id: 'user-1',
          name: 'Jane Doe',
          email: 'jane@example.com',
          role: 'USER',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
    });
  }),

  http.post('*/api/auth/register', async () => {
    return HttpResponse.json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: 'user-2',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'USER',
        },
      },
    });
  }),

  // Vehicle listings & Search
  http.get('*/api/vehicles', () => {
    return HttpResponse.json({
      success: true,
      message: 'Vehicles retrieved successfully',
      data: { vehicles: mockVehicles },
    });
  }),

  http.get('*/api/vehicles/search', ({ request }) => {
    const url = new URL(request.url);
    const make = url.searchParams.get('make');
    
    let filtered = [...mockVehicles];
    if (make) {
      filtered = filtered.filter(v => v.make.toLowerCase().includes(make.toLowerCase()));
    }
    
    return HttpResponse.json({
      success: true,
      message: 'Search results retrieved successfully',
      data: { vehicles: filtered },
    });
  }),

  // CRUD Admin and Transactions
  http.post('*/api/vehicles', async () => {
    return HttpResponse.json({
      success: true,
      message: 'Vehicle created successfully',
      data: {
        vehicle: {
          id: 'vehicle-3',
          make: 'Ford',
          model: 'F-150',
          category: 'Truck',
          price: 50000,
          quantity: 2,
        },
      },
    });
  }),

  http.put('*/api/vehicles/:id', async ({ params, request }) => {
    const body = (await request.json()) as any;
    return HttpResponse.json({
      success: true,
      message: 'Vehicle updated successfully',
      data: {
        vehicle: {
          id: params.id,
          make: body.make || 'Toyota',
          model: body.model || 'RAV4',
          category: body.category || 'SUV',
          price: body.price || 30000,
          quantity: body.quantity || 3,
        },
      },
    });
  }),

  http.delete('*/api/vehicles/:id', () => {
    return HttpResponse.json({
      success: true,
      message: 'Vehicle deleted successfully',
      data: {},
    });
  }),

  // Inventory Transaction
  http.post('*/api/vehicles/:id/purchase', () => {
    return HttpResponse.json({
      success: true,
      message: 'Vehicle purchased successfully',
      data: {
        purchase: {
          id: 'purchase-1',
          userId: 'user-1',
          vehicleId: 'vehicle-1',
          quantity: 1,
          purchaseDate: new Date().toISOString(),
        },
      },
    });
  }),

  http.post('*/api/vehicles/:id/restock', async ({ request }) => {
    const body = (await request.json()) as any;
    return HttpResponse.json({
      success: true,
      message: 'Vehicle restocked successfully',
      data: {
        vehicle: {
          id: 'vehicle-2',
          make: 'Tesla',
          model: 'Model 3',
          category: 'Sedan',
          price: 45000,
          quantity: body.quantity || 10,
        },
      },
    });
  }),
];
