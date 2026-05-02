import { OrderStatus } from "generated/prisma/enums"

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