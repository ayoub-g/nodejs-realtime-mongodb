const express = require("express");
const WatchBooking = require("./watchBooking");
const Consumer = require("./consumer");
const bookingEvents = require("./bookingEvents");
const app = express();
const server = require("http").createServer(app);
const { of, fromEvent } = require("rxjs");
const { map, switchMap, mergeMap } = require("rxjs/operators");
const port = 3000;

const io = require("socket.io");
const io$ = of(io(server));
let watchBookingMap = new Map();
const consumer = new Consumer("analytics", true);
// Stream of connections
const connections$ = io$.pipe(
  switchMap((io) =>
    fromEvent(io, "connection").pipe(map((client) => ({ io, client })))
  )
);

const disconnection$ = connections$.pipe(
  mergeMap(({ client }) =>
    fromEvent(client, "disconnect").pipe(map(() => client))
  )
);
const watchers$ = connections$.pipe(
  mergeMap(({ client }) =>
    fromEvent(client, bookingEvents.watching).pipe(
      map((payload) => ({ client, payload }))
    )
  )
);
connections$.subscribe(({ client }) => {
  console.log("connected: " + client.id);
});
disconnection$.subscribe(({ client }) => {
  console.log("disconnect: " + client.id);
});

watchers$.subscribe((client) => {
  const data = JSON.parse(client.payload);
  console.log("watching... ", data.consultantId);
  if (watchBookingMap.get(data.consultantId) === undefined) {
    var watchBooking = new WatchBooking(data.consultantId);

    watchBooking.initConsumer(consumer);
    watchBooking.watch();
    watchBookingMap.set(data.consultantId, watchBooking);
  }
});
//start server
server.listen(port);
