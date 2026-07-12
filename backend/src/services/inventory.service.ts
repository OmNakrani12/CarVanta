import { IVehicleRepository } from '../repositories/interfaces/vehicle-repository.interface';
import { IPurchaseHistoryRepository } from '../repositories/interfaces/purchase-history-repository.interface';
import { Vehicle, PurchaseHistory } from '@prisma/client';

export class InventoryService {
  private vehicleRepository: IVehicleRepository;
  private purchaseHistoryRepository: IPurchaseHistoryRepository;

  constructor(
    vehicleRepository: IVehicleRepository,
    purchaseHistoryRepository: IPurchaseHistoryRepository
  ) {
    this.vehicleRepository = vehicleRepository;
    this.purchaseHistoryRepository = purchaseHistoryRepository;
  }

  async purchaseVehicle(
    userId: string,
    vehicleId: string,
    quantity: number
  ): Promise<PurchaseHistory> {
    if (quantity <= 0) {
      throw new Error('Quantity must be greater than zero');
    }

    const vehicle = await this.vehicleRepository.findById(vehicleId);
    if (!vehicle) {
      throw new Error('Vehicle not found');
    }

    if (vehicle.quantity < quantity) {
      throw new Error('Insufficient vehicle stock');
    }

    // Decrement vehicle quantity
    const newQuantity = vehicle.quantity - quantity;
    await this.vehicleRepository.update(vehicleId, { quantity: newQuantity });

    // Record purchase history
    return this.purchaseHistoryRepository.create({
      userId,
      vehicleId,
      quantity,
    });
  }

  async restockVehicle(vehicleId: string, quantity: number): Promise<Vehicle> {
    if (quantity <= 0) {
      throw new Error('Restock quantity must be greater than zero');
    }

    const vehicle = await this.vehicleRepository.findById(vehicleId);
    if (!vehicle) {
      throw new Error('Vehicle not found');
    }

    const newQuantity = vehicle.quantity + quantity;
    return this.vehicleRepository.update(vehicleId, { quantity: newQuantity });
  }
}
