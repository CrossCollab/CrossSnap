module.exports = io => {
  io.on("connection", socket => {
    console.log(socket.id, " has made a persistent connection to the server!");
    socket.on("change puzzle", msg => {
      console.log("in socket change puzzle");
      socket.to(msg.room).emit("change puzzle", msg.guesses);
    });

    socket.on("join", function(room) {
      //on receiving the join message from client socket in CWScreen.js,
      //join the room requested (currently set to gameId value)
      // console.log("join", room);
      socket.join(room, function() {
        // console.log("rooms: ", socket.rooms);
      });
    });
  });
};
