const express = require("express");
const app = express();

const server = require("http").Server(app);
const io = require("socket.io")(server);
const { v4: uuidv4 } = require("uuid");
const port = process.env.PORT||8080;
app.set("view engine", "ejs");
app.use(express.static("public"));

console.log(process.env.PORT)
server.listen(port, () => {
  console.log("Server is liten in port ");
});

app.get("/", async (req, res) => {
  res.redirect(`${uuidv4()}`);
});
app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).broadcast.emit("user-connected", userId);

    socket.on("disconnect", () => {
      socket.to(roomId).broadcast.emit("user-disconnected", userId);
    });
    console.log(roomId, userId);
  });
});
