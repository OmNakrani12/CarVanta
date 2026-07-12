import { PrismaClient, PurchaseHistory, Prisma } from '@prisma/client';
import { IPurchaseHistoryRepository } from '../interfaces/purchase-history-repository.interface';
import { prisma } from '../../config/db.config';

export class PrismaPurchaseHistoryRepository implements IPurchaseHistoryRepository {
  private db: PrismaClient;

  constructor(dbClient: PrismaClient = prisma) {
    this.db = dbClient;
  }

  async create(data: Prisma.PurchaseHistoryUncheckedCreateInput): Promise<PurchaseHistory> {
    return this.db.purchaseHistory.create({
      data,
    });
  }

  async findByUserId(userId: string): Promise<PurchaseHistory[]> {
    return this.db.purchaseHistory.findMany({
      where: { userId },
      include: {
        vehicle: true,
      },
      orderBy: { purchaseDate: 'desc' },
    });
  }

  async findByVehicleId(vehicleId: string): Promise<PurchaseHistory[]> {
    return this.db.purchaseHistory.findMany({
      where: { vehicleId },
      include: {
        user: true,
      },
      orderBy: { purchaseDate: 'desc' },
    });
  }

  async findAll(): Promise<PurchaseHistory[]> {
    return this.db.purchaseHistory.findMany({
      include: {
        user: true,
        vehicle: true,
      },
      orderBy: { purchaseDate: 'desc' },
    });
  }
}
