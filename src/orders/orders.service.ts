import { HttpStatus, Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { RpcException } from '@nestjs/microservices';
import { OrderPaginationDto } from './dto/order-pagination.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) { }

  create(createOrderDto: CreateOrderDto) {
    return this.prisma.order.create({ data: createOrderDto });
  }

  async findAll(orderPaginationDto: OrderPaginationDto) {
    const { status, page, limit } = orderPaginationDto;
    const totalOrders = await this.prisma.order.count({
      where: status ? { status } : undefined
    });

    const data = await this.prisma.order.findMany({
      where: status ? { status } : undefined,
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data,
      meta: {
        total: totalOrders,
        page,
        limit,
        lastPage: Math.ceil(totalOrders / limit)
      }
    }
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Order with id ${id} not found`,
      });
    }
    return order;
  }

  changeOrderStatus() {
    return `This action changes the status of an order`;
  }
}
