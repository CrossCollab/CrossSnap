/**
 * @sockets
 * Handles joining a game, interactions between the game and users, and leaving a game
 *
 */

const GameInstance = require("./db/models/gameInstance");
let roomInfo = {};

/**
 * roomInfo
 * Object with a key for each active room. Each room is also an object that holds the userIds for active users, an array of all guesses, active cells, and player's colors.
 *
 */

module.exports = io => {
  io.on("connection", socket => {
    /**
     * join
     * When first player joins socket, set up the gameId object inside the roomInfo object.
     * If not the first player, add that player to the room and emit the join to the rest of
     * the room
     * @param {payload} object
     *
     *
     */

    socket.on("join", async function(payload) {
      const { gameId, userName, guesses, userId } = payload;
      socket.join(gameId, function() {
        console.log(`Someone joined ${gameId}`);
      });
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
    });

    /**
     * change cell focus
     * object with a gameId, userId, and currentCell. When a user changes, their cell focus, the roomInfo object is updated and then all users in room are also updated.
     *@param {cell} object
     @var {gameId} number
     @var {userId} number
     @var {currentCell} object
     */

    socket.on("change cell focus", cell => {
      const { gameId, userId, currentCell } = cell;
      roomInfo[gameId].activeCells[userId] = currentCell.index;
      io.in(gameId).emit("cell focus", roomInfo[gameId].activeCells);
    });

    /**
*change puzzle
Immediately send cell to everyone else in the room. Update the roomInfo object, replacing
the old cell with new cell. Save gameInstance guesses to database if room has ability to
request
@param {msg} object
*/

    socket.on("change puzzle", async msg => {
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
          await game.update({
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

    /**
*change puzzle
Immediately send cell to everyone else in the room. Update the roomInfo object, replacing
the old cell with new cell. Save gameInstance guesses to database if room has ability to
request
@param {msg} object
*/

    socket.on("picked", function(msg) {
      if (!roomInfo[msg.room].colorChoices) {
        roomInfo[msg.room].colorChoices = [
          { userId: msg.userId, color: msg.color, firstName: msg.firstName }
        ];
      } else if (
        roomInfo[msg.room].colorChoices.filter(playerColor => {
          return playerColor.userId === msg.userId;
        }).length
      ) {
        let index = roomInfo[msg.room].colorChoices.findIndex(
          playerChoice => playerChoice.userId === msg.userId
        );
        roomInfo[msg.room].colorChoices[index] = {
          userId: msg.userId,
          color: msg.color,
          firstName: msg.firstName
        };
      } else {
        roomInfo[msg.room].colorChoices.push({
          userId: msg.userId,
          color: msg.color,
          firstName: msg.firstName
        });
      }
      roomInfo[msg.room].colorChoices;
      io.in(msg.room).emit("color choice", roomInfo[msg.room].colorChoices);
    });

    /**
*leave
Update roomInfo to not include user who is leaving. Update other members. If the user is the last person in the room, delete the room from the roomInfo object
@param {payload} object
@var {room} number
@var {userId} number
@var {userName} string
*/

    socket.on("leave", async function(payload) {
      const { room, userId, userName } = payload;
      const newArray = roomInfo[room].users.filter(name => name !== userName);
      roomInfo[room].users = newArray;
      socket.leave(room);

      const index = roomInfo[room].colorChoices.findIndex(el => {
        return el.userId === userId;
      });
      roomInfo[room].colorChoices.splice(index, 1);
      delete roomInfo[room].activeCells[userId];
      if (!roomInfo[room].users.length) {
        const game = await GameInstance.findOne({
          where: { id: room }
        });
        await game.update({
          guesses: roomInfo[room].guesses
        });
        delete roomInfo[room];
      } else {
        const focusArray = Object.values(roomInfo[room].activeCells);
        io.in(room).emit("player leaving", {
          userName,
          currentPlayers: roomInfo[room].users,
          activeCells: focusArray,
          playerColors: roomInfo[room].colorChoices
        });
      }
    });
  });
};
