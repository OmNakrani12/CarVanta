import { prismaMock } from '../helpers/prisma-mock';
import request from 'supertest';
import app from '../../app';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.config';

describe('Inventory API Endpoints', () => {
  const adminToken = jwt.sign(
    { id: 'admin-123', email: 'admin@dealership.com', role: 'ADMIN' },
    env.JWT_SECRET
  );

  const userToken = jwt.sign(
    { id: 'user-123', email: 'user@dealership.com', role: 'USER' },
    env.JWT_SECRET
  );

  const dummyVehicle = {
    id: 'vehicle-uuid-1',
    make: 'Honda',
    model: 'Civic',
    category: 'Sedan',
    price: 25000,
    quantity: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const dummyPurchase = {
    id: 'purchase-uuid-1',
    userId: 'user-123',
    vehicleId: 'vehicle-uuid-1',
    quantity: 1,
    purchaseDate: new Date(),
  };

  describe('POST /api/vehicles/:id/purchase', () => {
    it('should purchase a vehicle successfully, reduce stock, record purchase, and return 200', async () => {
      // Mock checking vehicle
      prismaMock.vehicle.findUnique.mockResolvedValue(dummyVehicle);
      // Mock vehicle stock reduction
      prismaMock.vehicle.update.mockResolvedValue({
        ...dummyVehicle,
        quantity: 1,
      });
      // Mock purchase history entry creation
      prismaMock.purchaseHistory.create.mockResolvedValue(dummyPurchase);

      const response = await request(app)
        .post(`/api/vehicles/${dummyVehicle.id}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          quantity: 1,
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.purchase).toBeDefined();
      expect(response.body.data.purchase.userId).toBe('user-123');
    });

    it('should reject purchase if quantity is zero or negative and return 400', async () => {
      const response = await request(app)
        .post(`/api/vehicles/${dummyVehicle.id}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          quantity: 0,
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Validation failed');
    });

    it('should reject purchase if stock is insufficient and return 400', async () => {
      prismaMock.vehicle.findUnique.mockResolvedValue(dummyVehicle);

      const response = await request(app)
        .post(`/api/vehicles/${dummyVehicle.id}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          quantity: 5, // higher than stock of 2
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Insufficient vehicle stock');
    });
  });

  describe('POST /api/vehicles/:id/restock', () => {
    it('should allow ADMIN to restock vehicle and return 200', async () => {
      prismaMock.vehicle.findUnique.mockResolvedValue(dummyVehicle);
      prismaMock.vehicle.update.mockResolvedValue({
        ...dummyVehicle,
        quantity: 10,
      });

      const response = await request(app)
        .post(`/api/vehicles/${dummyVehicle.id}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          quantity: 8,
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.vehicle.quantity).toBe(10);
    });

    it('should forbid USER from restocking vehicle and return 403', async () => {
      const response = await request(app)
        .post(`/api/vehicles/${dummyVehicle.id}/restock`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          quantity: 8,
        });

      expect(response.status).toBe(403);
    });
  });
});
