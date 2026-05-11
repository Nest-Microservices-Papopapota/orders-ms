import { IsEnum, IsUUID } from "class-validator";
import { orderStatusList } from "../enum";
import { OrderStatus } from "@prisma/client";

export class ChangeOrderStatusDto {
    @IsUUID()
    id!: string;
    @IsEnum(orderStatusList,{
        message: `status must be one of the following values: ${orderStatusList.join(", ")}`
    })
    status!:OrderStatus;
}