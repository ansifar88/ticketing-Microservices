import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from "@ansif__artickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
