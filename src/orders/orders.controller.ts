import { Controller, NotImplementedException, ParseUUIDPipe } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderPaginationDto } from './dto/order-pagination.dto';
import { ChangeOrderStatusDto, PaidOrderDto } from './dto';
import type { OrderWithProductsDto } from './dto/interfaces/order-with-products.dto';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @MessagePattern({ cmd: 'create_order' })
  async create(
    @Payload() createOrderDto: CreateOrderDto
  ) {
    const order: OrderWithProductsDto = await this.ordersService.create(createOrderDto);
    const paymentSession = await this.ordersService.createPaymentSession(order);
    return { order, paymentSession };
  }

  @MessagePattern({ cmd: 'find_all_orders' })
  findAll(
    @Payload() orderPaginationDto: OrderPaginationDto
  ) {
    return this.ordersService.findAll(orderPaginationDto);
  }

  @MessagePattern({ cmd: 'find_one_order' })
  findOne(
    @Payload('id', ParseUUIDPipe) id: string
  ) {
    return this.ordersService.findOne(id);
  }

  @MessagePattern({ cmd: 'change_order_status' })
  changeOrderStatus(
    @Payload() changeOrderStatusDto: ChangeOrderStatusDto
  ) {
    return this.ordersService.changeOrderStatus(changeOrderStatusDto);
  }

  @EventPattern('payment.succeeded')
  paidOrder(
    @Payload() paidOrderDto: PaidOrderDto
  ) {
    return this.ordersService.paidOrder(paidOrderDto);
  }
}
