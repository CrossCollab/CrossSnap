const GameInstance = require("./db/models/gameInstance");
let roomInfo = {};
module.exports = io => {
  io.on("connection", socket => {
    // console.log(socket.id, " has made a persistent connection to the server!");
    socket.on("change puzzle", async msg => {
      try {
        if (!roomInfo[msg.room]) {
          roomInfo[msg.room] = { guesses: [], canRequest: true };
        }
        roomInfo[msg.room].guesses = msg.guesses;
        if (roomInfo[msg.room].canRequest === undefined) {
          roomInfo[msg.room].canRequest = true;
        }
        if (roomInfo[msg.room].canRequest) {
          const game = await GameInstance.findOne({
            where: { id: msg.room }
          });
          const updatedGame = await game.update({
            guesses: roomInfo[msg.room].guesses
          });
          roomInfo[msg.room].canRequest = false;

          setTimeout(function() {
            roomInfo[msg.room].canRequest = true;
          }, 1000);
        }
      } catch (err) {
        console.log(err);
      }
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
