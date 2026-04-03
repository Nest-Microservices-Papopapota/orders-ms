import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsPositive } from "class-validator";

export class PaginationDto {
    @IsOptional()
    @IsPositive()
    @IsNumber()
    @Type(() => Number)
    page: number = 1;
    
    @IsOptional()
    @IsPositive()
    @IsNumber()
    @Type(() => Number)
    limit: number = 10;
};