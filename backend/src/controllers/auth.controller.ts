import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { PrismaUserRepository } from '../repositories/prisma/user.repository';

const userRepository = new PrismaUserRepository();
const authService = new AuthService(userRepository);

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password, role } = req.body;
      const user = await authService.register({
        name,
        email,
        password,
        role,
      });

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
