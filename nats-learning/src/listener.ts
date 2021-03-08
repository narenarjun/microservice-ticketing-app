import nats, { Message } from "node-nats-streaming";
import { randomBytes } from "crypto";

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

  // all the options to be set must be chained on to this message , as opposed to traditional object passing
  // ! don't use  the setdelivverallavailable options without considerations, because it'll dump all the event it has from the start to the service whenever service restarts
  // # when using setDurableName() option, setDeliverAllAvailable() must be set 
  const options = stan
    .subscriptionOptions()
    .setManualAckMode(true)
    .setDeliverAllAvailable()
    .setDurableName('order-service')

  const subscription = stan.subscribe(
    "ticket:created",
    "orders-service-queue-group",
    options
  );


  subscription.on("message", (msg: Message) => {
    const data = msg.getData();

    if (typeof data === "string") {
      console.log(`Received event #${msg.getSequence()}, with data: ${data}`);
    }

    //  this will send the acknowldgement message to the nats server
    msg.ack();
  });
});

process.on("SIGTERM", () => stan.close());
process.on("SIGTERM", () => stan.close());
