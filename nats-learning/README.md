# NATS Streaming Server

NATS and NATS Streaming Server are two entirely different things.

docs for nats streaming server at [docs.nats.io](docs.nats.io)

this following article is a good read to know about nats/nats-streaming server and it's comparision with rabbitmq : [article](https://adam-kotwasinski.medium.com/rabbitmq-amqp-mostly-and-nats-nats-streaming-comparison-1f97753f1312)

when using `ts-node-dev` we need to supply `--rs` flag to have reloading by typing `rs` in the terminal for restart enable because allow to restart with `rs` line entered in stdio, **disabled by default**.