import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../model/ticket";

const createTicket = () => {
  return request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title:"concert",
      price :20,
    })
    .expect(201);
};

it(" can fetch a list of tickets", async () => {
  const ticketOne = await createTicket();
  const ticketTwo = await createTicket();
  const ticketThree = await createTicket();
 
    const response = await request(app)
        .get("/api/tickets")
        .send()
        .expect(200);
    expect(response.body.length).toEqual(3);

});
