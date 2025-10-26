import { Publisher, Subjects, TicketUpdatedEvent } from "@ansif__artickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
    
}