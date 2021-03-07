import nats from 'node-nats-streaming';

console.clear();

// stan is the nats way of saying client
// ! when giving the client url for nats , http or https must be provided even if we're using inside
// ! k8s cluster service discovery via k8s service

const stan = nats.connect('ticketing', 'abc', {
  url: 'http://nats-srv:4222',
});

stan.on('connect', () => {
  console.log('Publisher connected to NATS');

  const data = JSON.stringify({
    id: '123',
    title: 'concert',
    price: 20,
  });

  stan.publish('ticket:created', data, () => {
    console.log('Event published');
  });
});
