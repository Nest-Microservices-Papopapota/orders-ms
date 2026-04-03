import { Injectable, Logger, OnModuleInit, Post } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client.js';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    private readonly logger = new Logger('OrdersService');
    
    constructor() {
        const pool = new Pool({connectionString: process.env.DATABASE_URL});
        const adapter = new PrismaPg(pool);
        super({ adapter });
    }
    async onModuleInit() {
        await this.$connect();
        this.logger.log('Connected to the database');
    }
}
