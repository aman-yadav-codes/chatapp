const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let chatHistory = []; // Stores chat history

app.use(express.static("public")); // Serve static files from the 'public' folder

io.on("connection", (socket) => {
  console.log("A user connected");

  // Send chat history to the new user
  socket.emit("chatHistory", chatHistory);

  // Handle incoming chat messages
  socket.on("chatMessage", (msg) => {
    const message = { user: socket.id, text: msg };
    chatHistory.push(message); // Add message to chat history

    // Broadcast the message to all users
    io.emit("chatMessage", message);
  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// new comment added
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
