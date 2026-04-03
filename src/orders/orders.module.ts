import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [OrdersController],
  providers: [
    OrdersService,
    PrismaService
  ],
  imports: [PrismaModule],
})
export class OrdersModule {}
