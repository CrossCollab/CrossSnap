module.exports = io => {
    io.on('connection', socket => {
        console.log(
            socket.id,
            ' has made a persistent connection to the server!'
        )

        socket.on('change puzzle', puzzle => {
            socket.broadcast.emit('change puzzle', puzzle)
        })
    })
}
