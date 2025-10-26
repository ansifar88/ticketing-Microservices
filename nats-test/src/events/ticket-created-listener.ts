import { Message } from "node-nats-streaming";
import { Listener } from "./base-listener";
import { TicketCreatedEvent } from "./ticket-created-event";
import { Subjects } from "./subjects";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = "payment-service-queue-group";

  onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    console.log("Ticket created event data:", data);
    // Process the event data here
    console.log(data.id);
    console.log(data.title);
    console.log(data.price);
    
    msg.ack();
  }
}
