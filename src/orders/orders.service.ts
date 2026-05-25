import { HttpStatus, Inject, Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { OrderPaginationDto } from './dto/order-pagination.dto';
import { ChangeOrderStatusDto, PaidOrderDto } from './dto';
import { firstValueFrom } from 'rxjs';
import { NATS_SERVICE } from 'src/config';
import { OrderWithProductsDto } from './dto/interfaces/order-with-products.dto';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);
  constructor(
    private readonly prisma: PrismaService,
    @Inject(NATS_SERVICE) private readonly client: ClientProxy
  ) { }

  async create(createOrderDto: CreateOrderDto) {
    try {
      const productIds = createOrderDto.items.map(item => item.productId);
      const products: any[] = await firstValueFrom(
        this.client.send(
          { cmd: 'validate_products' },
          productIds
        )
      );
      // 2 cálculos de los valores
      const totalAmount = createOrderDto.items.reduce((acc, orderItem) => {
        const price = products.find(
          product => product.id === orderItem.productId
        )?.price || 0;

        return acc + (price * orderItem.quantity);
      }, 0)

      const totalItems = createOrderDto.items.reduce((acc, item) => acc + item.quantity, 0);
      // 3 creación de la orden
      const order = await this.prisma.order.create({
        data: {
          totalAmount,
          totalItems,
          OrderItem: {
            createMany: {
              data: createOrderDto.items.map((orderItem) => ({
                price: products.find(
                  product => product.id === orderItem.productId
                )?.price || 0,
                productId: orderItem.productId,
                quantity: orderItem.quantity
              }))
            }
          }
        },
        include: {
          OrderItem: {
            select: {
              productId: true,
              quantity: true,
              price: true,
            }
          }
        }
      });
      return {
        ...order,
        OrderItem: order.OrderItem.map((orderItem) => ({
          ...orderItem,
          name: products.find(product => product.id === orderItem.productId)?.name
        }))
      };
    } catch (error: any) {
      console.log(error.message);
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: error.message || 'Error validating products'
      });
    }
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
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        OrderItem: {
          select: {
            productId: true,
            quantity: true,
            price: true,
          }
        }
      }
    });

    const productIds = order?.OrderItem.map(item => item.productId);
    const products: any[] = await firstValueFrom(
      this.client.send(
        { cmd: 'validate_products' },
        productIds
      )
    );
    if (!order) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Order with id ${id} not found`,
      });
    }


    return {
      ...order,
      OrderItem: order.OrderItem.map((orderItem) => ({
        ...orderItem,
        name: products.find(product => product.id === orderItem.productId)?.name
      }))
    };
  }

  async changeOrderStatus(changeOrderStatusDto: ChangeOrderStatusDto) {
    const { id, status } = changeOrderStatusDto;
    const order = await this.findOne(id);
    if (order.status === status) {
      return order;
    }
    return await this.prisma.order.update({
      where: { id },
      data: { status }
    });
  }

  async createPaymentSession(order: OrderWithProductsDto) {
    try {
      const paymentSession = await firstValueFrom(
        this.client.send(
          'create.payment.session',
          {
            orderId: order.id,
            currency: 'usd',
            items: order.OrderItem.map(item => ({
              name: item.name,
              price: item.price,
              quantity: item.quantity,
            }))
          }
        )
      )
      return paymentSession;
    } catch (error: any) {
      return `Error: ${error.message}`;
    }
  }

  async paidOrder(paidOrderDto: PaidOrderDto) {

    this.logger.log({ paidOrderDto });

    const updatedOrder = await this.prisma.order.update({
      where: { id: paidOrderDto.orderId },
      data: {
        paid: true,
        paidAt: new Date(),
        status: OrderStatus.PAID,
        stripeChargeId: paidOrderDto.stripePaymentId,

        // relación
        orderReceipt: {
          create: {
            receiptUrl: paidOrderDto.receiptUrl
          }
        }
      }
    });
    return { ...updatedOrder };
  }
}
