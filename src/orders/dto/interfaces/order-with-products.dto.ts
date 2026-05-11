import { OrderStatus } from "@prisma/client";

export interface OrderWithProductsDto {
    OrderItem: {
        productId: number,
        quantity: number,
        price: number,
        name: string

    }[],
    id: string,
    totalItems: number,
    totalAmount: number,
    status: OrderStatus,
    paid: boolean,
    paidAt: Date | null,
    createdAt: Date,
    updatedAt: Date,
}