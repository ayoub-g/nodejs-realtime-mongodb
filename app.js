const express = require("express");
const watchCart = require("./watchCart");
const app = express();
const server = require("http").createServer(app);
const { of, fromEvent } = require("rxjs");
const { map, switchMap } = require("rxjs/operators");
const port = 3000;
const io = require("socket.io");

const io$ = of(io(server));

//io.on("connection", () => console.log("user connected"));

// Stream of connections
const connection$ = io$.pipe(
  switchMap((io) =>
    fromEvent(io, "connection").pipe(map((client) => ({ io, client })))
  )
);

//Stream of watcher
const watchers$ = io$.pipe(
  switchMap((io) =>
    fromEvent(io, "connection").pipe(map((client) => ({ io, client })))
  )
);

app.use(express.json({ limit: "20mb" }));
app.use(
  express.urlencoded({
    limit: "20mb",
    extended: true,
    parameterLimit: 3000,
  })
);
watchCart();
app.get("/watch", (req, res) => {
  res.sendFile(__dirname + "/static/index.html");
  console.log("/watch");
});
//start server
server.listen(port);
connection$.subscribe(({ client }) => {
  console.log("connected: ", client.id);
});
