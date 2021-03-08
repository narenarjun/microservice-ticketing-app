import nats from "node-nats-streaming";
import { randomBytes } from "crypto";
import { TicketCreatedListener } from "./events/ticket-created-listener";

console.clear();

// ! here we're randomly generating client ids for connection to nats streaming serve
// ! by using randombytes function

const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://nats-srv:4222",
});

stan.on("connect", () => {
  console.log("Listener connected to NATS");

  // ! setting up graceful shutdown that is to be sent to nats server from the client
  stan.on("close", () => {
    console.log("NATS connection closed!");
    process.exit();
  });

  new TicketCreatedListener(stan).listen();
});

process.on("SIGTERM", () => stan.close());
process.on("SIGTERM", () => stan.close());
