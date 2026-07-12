import { PrismaClient, User, Prisma } from '@prisma/client';
import { IUserRepository } from '../interfaces/user-repository.interface';
import { prisma } from '../../config/db.config';

export class PrismaUserRepository implements IUserRepository {
  private db: PrismaClient;

  constructor(dbClient: PrismaClient = prisma) {
    this.db = dbClient;
  }

  async findById(id: string): Promise<User | null> {
    return this.db.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.db.user.findUnique({
      where: { email },
    });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.db.user.create({
      data,
    });
  }
}
