import request from "supertest";
import { app } from "../../app";

it("returns a 404 if the ticket is found", async () => {
  await request(app).get("/api/tickets/asfaiyfssafd").send().expect(404);
});

it("returns the ticket if the ticket is found", async () => {
  const title = "lkashdiewh";
  const price = 47;

  const responce = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title,
      price,
    })
    .expect(201);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${responce.body.id}`)
    .send()
    .expect(200);

  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
});
