const GameInstance = require("./db/models/gameInstance");
const User = require("./db/models/user");
let roomInfo = {};
module.exports = io => {
  io.on("connection", socket => {
    socket.on("change puzzle", async msg => {
      // console.log("room info obj", roomInfo);
      socket.broadcast.to(msg.room).emit("change puzzle", msg.cell);
      try {
        if (!roomInfo[msg.room]) {
          roomInfo[msg.room] = {
            guesses: [],
            canRequest: true,
            activeCells: {}
          };
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
        socket.on("cell change", cell => {});
      } catch (err) {
        console.log(err);
      }
    });
    socket.on("change cell focus", cell => {
      const { gameId, userId, currentCell } = cell;
      roomInfo[gameId].activeCells[cell.userId] = cell.currentCell.index;
      io.in(gameId).emit("cell focus", roomInfo[gameId].activeCells);
    });

    socket.on("join", async function(payload) {
      console.log("joining room: ", payload.gameId);
      var clients = io.sockets.clients();
      // console.log("clients to socket", clients);
      const { gameId, userName, guesses, userId } = payload;
      if (!roomInfo[gameId]) {
        roomInfo[gameId] = {
          ...roomInfo[gameId],
          users: [userName],
          guesses,
          activeCells: {}
        };
        roomInfo[gameId].activeCells[userId] = {};
      } else if (!roomInfo[gameId].users.includes(userName)) {
        roomInfo[gameId].users.push(userName);
        roomInfo[gameId].activeCells[userId] = {};
      }
      io.in(gameId).emit("new player", {
        userName,
        users: roomInfo[gameId].users
      });
      socket.emit("welcome", {
        greeting: "hello",
        players: roomInfo[gameId].users
      });
      //on receiving the join message from client socket in CWScreen.js,
      //join the room requested (currently set to gameId value)

      socket.join(gameId, function() {});
    });

    socket.on("picked", function(msg) {
      // console.log(
      //   "my color in socket",
      //   msg.color,
      //   "user id ",
      //   msg.userId,
      //   "room: ",
      //   msg.room
      // );
      if (!roomInfo[msg.room].colorChoices) {
        // console.log("first player in room to choose color");
        roomInfo[msg.room].colorChoices = [
          { userId: msg.userId, color: msg.color, firstName: msg.firstName }
        ];
      } else if (
        roomInfo[msg.room].colorChoices.filter(playerColor => {
          return playerColor.userId === msg.userId;
        }).length
      ) {
        // console.log("player chose a second color");
        let index = roomInfo[msg.room].colorChoices.findIndex(
          playerChoice => playerChoice.userId === msg.userId
        );
        roomInfo[msg.room].colorChoices[index] = {
          userId: msg.userId,
          color: msg.color,
          firstName: msg.firstName
        };
      } else {
        // console.log("new player (not first) chose color");
        roomInfo[msg.room].colorChoices.push({
          userId: msg.userId,
          color: msg.color,
          firstName: msg.firstName
        });
      }
      roomInfo[msg.room].colorChoices;
      io.in(msg.room).emit("color choice", roomInfo[msg.room].colorChoices);
    });

    socket.on("leave", function(payload) {
      console.log("leaving room ", payload.room);
      const { room, userId, userName } = payload;
      const newArray = roomInfo[room].users.filter(name => name !== userName);
      roomInfo[room].users = newArray;
      socket.leave(room);

      const index = roomInfo[room].colorChoices.findIndex(el => {
        return el.userId === userId;
      });
      roomInfo[room].colorChoices.splice(index, 1);
      delete roomInfo[room].activeCells[userId];

      // delete roomInfo[room].colorChoices[userId];
      // roomInfo[room].activeCells[userId] = {};
      const focusArray = Object.values(roomInfo[room].activeCells);
      io.in(room).emit("player leaving", {
        userName,
        currentPlayers: roomInfo[room].users,
        activeCells: focusArray,
        playerColors: roomInfo[room].colorChoices
      });
      // io.in(room).emit("color choice", roomInfo[room].colorChoices);
    });
  });
};
