import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { NatsModule } from 'src/transport/nats.module';

@Module({
  controllers: [OrdersController],
  providers: [
    OrdersService,
    PrismaService
  ],
  imports: [
    PrismaModule,
    NatsModule
  ],
})
export class OrdersModule { }
