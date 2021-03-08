# NATS Streaming Server

NATS and NATS Streaming Server are two entirely different things.

docs for nats streaming server at [docs.nats.io](docs.nats.io)

this following article is a good read to know about nats/nats-streaming server and it's comparision with rabbitmq : [article](https://adam-kotwasinski.medium.com/rabbitmq-amqp-mostly-and-nats-nats-streaming-comparison-1f97753f1312)

when using `ts-node-dev` we need to supply `--rs` flag to have reloading by typing `rs` in the terminal for restart enable because allow to restart with `rs` line entered in stdio, **disabled by default**.

`queue group` - a queue group ensures that only one instance of the running service will get a event from the event bus and not all the instance of the same service listens it. This ensures the prevention of message duplication my multiple instance of a service get the event and prevents data duplication in the DB.

`setManualAckMode` - when set to `true` this is manual acknowledgement mode which will send the event processed message to the nats server only the condition is met which is manually described by us. then nats streaming server will send the same event to the same or different instance  of that (unacknowledged) service [this will happen till the aknowledgement message is received]

> ### Note:
> NATS Streaming Server only have 1000 channels by default. 
> we can change this number in settings