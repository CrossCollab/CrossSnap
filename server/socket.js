const GameInstance = require("./db/models/gameInstance");
const User = require("./db/models/user");
let roomInfo = {};
module.exports = io => {
  io.on("connection", socket => {
    socket.on("change puzzle", async msg => {
      socket.broadcast.to(msg.room).emit("change puzzle", msg.cell);
      try {
        if (!roomInfo[msg.room]) {
          roomInfo[msg.room] = { guesses: [], canRequest: true };
        }
        roomInfo[msg.room].guesses[msg.cell.index] = msg.cell;
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
    });

    socket.on("join", async function(payload) {
      const { gameId, userName, guesses } = payload;
      if (!roomInfo[gameId]) {
        roomInfo[gameId] = { ...roomInfo[gameId], users: [userName], guesses };
      } else if (!roomInfo[gameId].users.includes(userName)) {
        roomInfo[gameId].users.push(userName);
      }
      io.in(gameId).emit("new player", {
        userName,
        users: roomInfo[gameId].users
      });
      //on receiving the join message from client socket in CWScreen.js,
      //join the room requested (currently set to gameId value)

      socket.join(gameId, function() {});
    });

    socket.on("leave", async function(payload) {
      // console.log("user attempting to leave");
      // console.log(
      //   "user: ",
      //   payload.userId,
      //   "room: ",
      //   payload.room,
      //   "counter: ",
      //   payload.counter
      // );
      socket.leave(payload.room);
    });
  });
};
