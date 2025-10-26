import {
  PaymentCreatedEvent,
  Publisher,
  Subjects,
} from "@ansif__artickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
