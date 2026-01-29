const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let messages = []; // temporary in-memory store

io.on("connection", (socket) => {
    console.log("User connected");

    // Send old messages to new user
    socket.emit("chat-history", messages);

    socket.on("send-message", (data) => {
        messages.push(data);
        io.emit("receive-message", data); // broadcast to all
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

server.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
