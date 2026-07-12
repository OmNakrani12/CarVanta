import { PrismaClient, Vehicle, Prisma } from '@prisma/client';
import { IVehicleRepository } from '../interfaces/vehicle-repository.interface';
import { prisma } from '../../config/db.config';

export class PrismaVehicleRepository implements IVehicleRepository {
  private db: PrismaClient;

  constructor(dbClient: PrismaClient = prisma) {
    this.db = dbClient;
  }

  async findById(id: string): Promise<Vehicle | null> {
    return this.db.vehicle.findUnique({
      where: { id },
    });
  }

  async findAll(): Promise<Vehicle[]> {
    return this.db.vehicle.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async search(filters: {
    make?: string;
    model?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<Vehicle[]> {
    const where: Prisma.VehicleWhereInput = {};

    if (filters.make) {
      where.make = { contains: filters.make, mode: 'insensitive' };
    }
    if (filters.model) {
      where.model = { contains: filters.model, mode: 'insensitive' };
    }
    if (filters.category) {
      where.category = { contains: filters.category, mode: 'insensitive' };
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.price = {};
      if (filters.minPrice !== undefined) {
        where.price.gte = filters.minPrice;
      }
      if (filters.maxPrice !== undefined) {
        where.price.lte = filters.maxPrice;
      }
    }

    return this.db.vehicle.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: Prisma.VehicleCreateInput): Promise<Vehicle> {
    return this.db.vehicle.create({
      data,
    });
  }

  async update(id: string, data: Prisma.VehicleUpdateInput): Promise<Vehicle> {
    return this.db.vehicle.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Vehicle> {
    return this.db.vehicle.delete({
      where: { id },
    });
  }
}
