import { Request, Response, NextFunction } from 'express';
import { InventoryService } from '../services/inventory.service';
import { PrismaVehicleRepository } from '../repositories/prisma/vehicle.repository';
import { PrismaPurchaseHistoryRepository } from '../repositories/prisma/purchase-history.repository';

// Instantiate dependencies
const vehicleRepository = new PrismaVehicleRepository();
const purchaseHistoryRepository = new PrismaPurchaseHistoryRepository();
const inventoryService = new InventoryService(vehicleRepository, purchaseHistoryRepository);

export class InventoryController {
  static async purchase(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: vehicleId } = req.params;
      const { quantity } = req.body;
      const userId = req.user?.id; // attached by authMiddleware

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User authentication required',
          errors: [],
        });
      }

      const purchaseRecord = await inventoryService.purchaseVehicle(
        userId,
        vehicleId,
        Number(quantity)
      );

      res.status(200).json({
        success: true,
        message: 'Vehicle purchased successfully',
        data: { purchase: purchaseRecord },
      });
    } catch (error) {
      next(error);
    }
  }

  static async restock(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: vehicleId } = req.params;
      const { quantity } = req.body;

      const vehicle = await inventoryService.restockVehicle(vehicleId, Number(quantity));

      res.status(200).json({
        success: true,
        message: 'Vehicle restocked successfully',
        data: { vehicle },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getPurchaseHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const userRole = req.user?.role;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User authentication required',
          errors: [],
        });
      }

      let purchases;
      if (userRole === 'ADMIN') {
        purchases = await purchaseHistoryRepository.findAll();
      } else {
        purchases = await purchaseHistoryRepository.findByUserId(userId);
      }

      res.status(200).json({
        success: true,
        message: 'Purchases retrieved successfully',
        data: { purchases },
      });
    } catch (error) {
      next(error);
    }
  }
}
