import { PurchaseHistory, Prisma } from '@prisma/client';

export interface IPurchaseHistoryRepository {
  create(data: Prisma.PurchaseHistoryUncheckedCreateInput): Promise<PurchaseHistory>;
  findByUserId(userId: string): Promise<PurchaseHistory[]>;
  findByVehicleId(vehicleId: string): Promise<PurchaseHistory[]>;
  findAll(): Promise<PurchaseHistory[]>;
}
