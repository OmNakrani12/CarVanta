import { Request, Response, NextFunction } from 'express';
import { VehicleService } from '../services/vehicle.service';
import { PrismaVehicleRepository } from '../repositories/prisma/vehicle.repository';

// Instantiate dependencies
const vehicleRepository = new PrismaVehicleRepository();
const vehicleService = new VehicleService(vehicleRepository);

export class VehicleController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { make, model, category, price, quantity } = req.body;
      const vehicle = await vehicleService.createVehicle({
        make,
        model,
        category,
        price,
        quantity,
      });

      res.status(201).json({
        success: true,
        message: 'Vehicle created successfully',
        data: { vehicle },
      });
    } catch (error) {
      next(error);
    }
  }

  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const vehicles = await vehicleService.getAllVehicles();
      res.status(200).json({
        success: true,
        message: 'Vehicles retrieved successfully',
        data: { vehicles },
      });
    } catch (error) {
      next(error);
    }
  }

  static async search(req: Request, res: Response, next: NextFunction) {
    try {
      const { make, model, category, minPrice, maxPrice } = req.query;

      const filters = {
        make: make ? String(make) : undefined,
        model: model ? String(model) : undefined,
        category: category ? String(category) : undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
      };

      const vehicles = await vehicleService.searchVehicles(filters);
      res.status(200).json({
        success: true,
        message: 'Search results retrieved successfully',
        data: { vehicles },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const vehicle = await vehicleService.getVehicleById(id);
      res.status(200).json({
        success: true,
        message: 'Vehicle retrieved successfully',
        data: { vehicle },
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const vehicle = await vehicleService.updateVehicle(id, updateData);

      res.status(200).json({
        success: true,
        message: 'Vehicle updated successfully',
        data: { vehicle },
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const vehicle = await vehicleService.deleteVehicle(id);

      res.status(200).json({
        success: true,
        message: 'Vehicle deleted successfully',
        data: { vehicle },
      });
    } catch (error) {
      next(error);
    }
  }
}
