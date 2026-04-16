import { Type } from "class-transformer";
import { IsInt, IsNumber, IsPositive } from "class-validator";

export class OrderItemDto {
    
    @IsNumber()
    @IsPositive()
    productId!: number;

    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    price!: number;

    @IsNumber()
    @IsInt()
    @IsPositive()
    @Type(() => Number)
    quantity!: number;
}