import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  //passwordReset: any;

  constructor(private configService: ConfigService) {
    const pool = new Pool({
      connectionString: configService.getOrThrow<string>('DATABASE_URL'),
    });
    const adapter = new PrismaPg(pool);
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
    console.log("Database Connected ✅");
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}