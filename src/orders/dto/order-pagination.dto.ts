import { IsEnum, IsOptional } from "class-validator";
import { PaginationDto } from "src/common";
import { orderStatusList } from "../enum";
import { OrderStatus } from "@prisma/client";

export class OrderPaginationDto extends PaginationDto {
    @IsOptional()
    @IsEnum(orderStatusList,{
        message: `status must be one of the following values: ${orderStatusList.join(", ")}`
    })
    status?: OrderStatus;

}