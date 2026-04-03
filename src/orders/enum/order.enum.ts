import { OrderStatus } from "generated/prisma/enums";

export const orderStatusList = [
    OrderStatus.PENDING,
    OrderStatus.DELIVERED,
    OrderStatus.CANCELLED,
]