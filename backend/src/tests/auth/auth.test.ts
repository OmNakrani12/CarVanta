import { prismaMock } from '../helpers/prisma-mock';
import request from 'supertest';
import app from '../../app';
import bcrypt from 'bcrypt';

describe('Auth API Endpoints', () => {
  const dummyUser = {
    id: 'user-uuid-123',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'hashedpassword123',
    role: 'USER' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully and return 201', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      prismaMock.user.create.mockResolvedValue(dummyUser);

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toBeDefined();
      expect(response.body.data.user.email).toBe('john@example.com');
      expect(response.body.data.user.password).toBeUndefined();
    });

    it('should fail registration if email is already registered and return 400', async () => {
      prismaMock.user.findUnique.mockResolvedValue(dummyUser);

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Email already registered');
    });

    it('should fail registration if validation fields are invalid and return 400', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: '',
          email: 'not-an-email',
          password: '123',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.errors.length).toBeGreaterThan(0);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should log in successfully and return a JWT with user data and 200', async () => {
      const plainPassword = 'password123';
      const hash = await bcrypt.hash(plainPassword, 10);
      const userWithRealHash = { ...dummyUser, password: hash };

      prismaMock.user.findUnique.mockResolvedValue(userWithRealHash);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'john@example.com',
          password: plainPassword,
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.user.email).toBe('john@example.com');
      expect(response.body.data.user.password).toBeUndefined();
    });

    it('should reject login if password is incorrect and return 401', async () => {
      const plainPassword = 'password123';
      const hash = await bcrypt.hash(plainPassword, 10);
      const userWithRealHash = { ...dummyUser, password: hash };

      prismaMock.user.findUnique.mockResolvedValue(userWithRealHash);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'john@example.com',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid email or password');
    });

    it('should reject login if email does not exist and return 401', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});
