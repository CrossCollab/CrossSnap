const GameInstance = require("./db/models/gameInstance");
module.exports = io => {
  io.on("connection", socket => {
    // console.log(socket.id, " has made a persistent connection to the server!");
    socket.on("change puzzle", async msg => {
      // setInterval(async function() {
      //   console.log("in socket interval");
      //   console.log("msg.state.guesses[0]: ", msg.state.guesses[0]);
      //   const gameInstance = await GameInstance.findOne({
      //     where: {
      //       id: msg.state.gameId
      //     }
      //   });
      //   const jsonGuesses = msg.state.guesses.map(guess => {
      //     JSON.stringify(guess);
      //   });
      //   const updatedInstance = await gameInstance.update({
      //     guesses: jsonGuesses
      //   });
      //   console.log("updated: ", updatedInstance.guesses[0]);
      // }, 10000);
      try {
        console.log("im here");
        const game = await GameInstance.findOne({
          where: { id: msg.state.gameId }
        });
        console.log("before", msg.state.guesses[0]);
        // const jsonGuesses = msg.state.guesses.map(guess => {
        //   return JSON.stringify(guess);
        // });
        const jsonGuesses = JSON.stringify(msg.guesses);
        const updatedGame = await game.update({ guesses: jsonGuesses });
        console.log("updated game: ", updatedGame.guesses[0]);
      } catch (err) {
        console.log(err);
      }
      // await game.update({ guesses: msg.state.guesses });
      // socket.on("change puzzle", msg => {
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
