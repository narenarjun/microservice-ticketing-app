import mongoose from "mongoose";
import { app } from "./app";
import { TicketCreatedListener } from "./events/listeners/ticket-created-listener";
import { TicketUpdatedListener } from "./events/listeners/ticket-updated-listener";
import { natsWrapper } from "./nats-wrapper";

// mongoose connection
const start = async () => {
  if (!process.env.JWTSECRET) {
    throw new Error("JWTSECRET must be defined");
  }
  try {
    // ! values for the nats client must be extracted to be used via environment variables
    // ? nats client id (second value), will be great if we set it to the value of the pod name its running
    await natsWrapper.connect(
      "ticketing",
      "orders-service",
      "http://nats-srv:4222"
    );

    // ? Graceful shutdown for NATS streaming server
    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed!");
      process.exit();
    });

    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    new TicketCreatedListener(natsWrapper.client).listen();
    new TicketUpdatedListener(natsWrapper.client).listen();
    // ! this must be changed to use environment variable
    await mongoose.connect("mongodb://orders-mongo-srv:27017/orders", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("Connected to MongoDb");
  } catch (err) {
    console.error(err);
  }
  app.listen(4002, () => {
    console.log("Auth service listening on Port 4002!");
  });
};

start();
