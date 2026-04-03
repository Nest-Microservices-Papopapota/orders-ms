import { IsBoolean, IsEnum, IsNumber, IsOptional, IsPositive } from 'class-validator';
import { orderStatusList } from '../enum/order.enum';
import { OrderStatus } from 'generated/prisma/enums';

export class CreateOrderDto {
    @IsNumber()
    @IsPositive()
    totalAmount!: number;
    @IsPositive()
    @IsNumber()
    totalItems!: number;
    @IsEnum(orderStatusList, {
        message: `Status must be one of the following: ${orderStatusList.join(', ')}`
    })
    @IsOptional()
    status: OrderStatus = OrderStatus.PENDING;
    @IsBoolean()
    @IsOptional()
    paid: boolean = false;
}
