import { Publisher, OrderCancelledEvent, Subjects } from "@ansif__artickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled
}
