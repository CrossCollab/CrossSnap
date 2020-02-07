const GameInstance = require("./db/models/gameInstance");
const User = require("./db/models/user");
let roomInfo = {};
module.exports = io => {
  io.on("connection", socket => {
    socket.on("change puzzle", async msg => {
      socket.broadcast.to(msg.room).emit("change puzzle", msg.guesses);
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
    });

    socket.on("join", async function(payload) {
      console.log("joined", payload);
      const { gameId, userId } = payload;
      if (!roomInfo[gameId]) {
        roomInfo[gameId] = { ...roomInfo[gameId], users: [userId] };
      } else if (!roomInfo[gameId].users.includes(userId)) {
        roomInfo[gameId].users.push(userId);
      }
      console.log("roomInfo", roomInfo);
      const newUser = await User.findOne({ where: { id: userId } });

      const { firstName } = newUser;
      io.in(gameId).emit("new player", {
        firstName,
        users: roomInfo[gameId].users
      });
      //on receiving the join message from client socket in CWScreen.js,
      //join the room requested (currently set to gameId value)

      socket.join(gameId, function() {});
    });
  });
};
