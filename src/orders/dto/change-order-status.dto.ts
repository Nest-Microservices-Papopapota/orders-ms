import { IsEnum, IsUUID } from "class-validator";
import { OrderStatus } from "generated/prisma/enums";
import { orderStatusList } from "../enum";

export class ChangeOrderStatusDto {
    @IsUUID()
    id!: string;
    @IsEnum(orderStatusList,{
        message: `status must be one of the following values: ${orderStatusList.join(", ")}`
    })
    status!:OrderStatus;
}