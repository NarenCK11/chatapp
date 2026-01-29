const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

// In-memory message store (replace with DB later)
let messages = [];

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // User joins chat
    socket.on("join", (name) => {
        socket.username = name;

        // Send chat history to new user
        socket.emit("chat-history", messages);

        // Broadcast join message
        io.emit("system", `${name} joined the chat`);
    });

    // Receive new message
    socket.on("send-message", (data) => {
        messages.push(data);
        io.emit("receive-message", data);
    });

    // User disconnects
    socket.on("disconnect", () => {
        if (socket.username) {
            io.emit("system", `${socket.username} left the chat`);
        }
        console.log("User disconnected:", socket.id);
    });
});

// Required for cloud hosting (Render, Railway, etc.)
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log("Server running on port", PORT);
});
