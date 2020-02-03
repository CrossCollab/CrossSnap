module.exports = io => {
  io.on("connection", socket => {
    console.log(socket.id, " has made a persistent connection to the server!");
    socket.on("change puzzle", puzzle => {
      socket.broadcast.emit("change puzzle", puzzle);
    });

    socket.on("join", function(room) {
      //on receiving the join message from client socket in CWScreen.js,
      //join the room requested (current set to gameId value)
      console.log("join", room);

      socket.join(room, function() {
        console.log("rooms: ", socket.rooms);
      });
    });
  });
};
