import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../model/ticket";
import mongoose from "mongoose";

it("return 404 if the ticket is not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const response = await request(app)
    .get(`/api/tickets/${id}`)
    .send()
    .expect(404);
});

it("returns ticket if the ticket is found", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", await global.signin())
    .send({
      title: "test title",
      price: 20,
    })
    .expect(201);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);
  expect(ticketResponse.body.title).toEqual("test title");
  expect(ticketResponse.body.price).toEqual(20);
});
