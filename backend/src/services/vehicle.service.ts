import { IVehicleRepository } from '../repositories/interfaces/vehicle-repository.interface';
import { Prisma, Vehicle } from '@prisma/client';

export class VehicleService {
  private vehicleRepository: IVehicleRepository;

  constructor(vehicleRepository: IVehicleRepository) {
    this.vehicleRepository = vehicleRepository;
  }

  async createVehicle(data: Prisma.VehicleCreateInput): Promise<Vehicle> {
    return this.vehicleRepository.create(data);
  }

  async getVehicleById(id: string): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findById(id);
    if (!vehicle) {
      throw new Error('Vehicle not found');
    }
    return vehicle;
  }

  async getAllVehicles(): Promise<Vehicle[]> {
    return this.vehicleRepository.findAll();
  }

  async searchVehicles(filters: {
    make?: string;
    model?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<Vehicle[]> {
    return this.vehicleRepository.search(filters);
  }

  async updateVehicle(id: string, data: Prisma.VehicleUpdateInput): Promise<Vehicle> {
    // Check if vehicle exists first
    await this.getVehicleById(id);
    return this.vehicleRepository.update(id, data);
  }

  async deleteVehicle(id: string): Promise<Vehicle> {
    // Check if vehicle exists first
    await this.getVehicleById(id);
    return this.vehicleRepository.delete(id);
  }
}
