import { Publisher, OrderCreatedEvent, Subjects } from "@ansif__artickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated
}
