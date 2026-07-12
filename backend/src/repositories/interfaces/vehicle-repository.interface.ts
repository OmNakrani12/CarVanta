import { Vehicle, Prisma } from '@prisma/client';

export interface IVehicleRepository {
  findById(id: string): Promise<Vehicle | null>;
  findAll(): Promise<Vehicle[]>;
  search(filters: {
    make?: string;
    model?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<Vehicle[]>;
  create(data: Prisma.VehicleCreateInput): Promise<Vehicle>;
  update(id: string, data: Prisma.VehicleUpdateInput): Promise<Vehicle>;
  delete(id: string): Promise<Vehicle>;
}
