module.exports = io => {
  const users = {}
  io.on('connection', socket => {
    socket.on('userConnected', data => {
      users[socket.id] = data
      io.emit('usersOnline', users)
    })

    socket.on('newMessage', (data) => {
      socket
        .to(Object.keys(users).find(id => users[id] === data.friendId))
        .emit('sendMessage', data)
    })

    socket.on('disconnect', () => {
      delete users[socket.id]
      io.emit('userOffline', users)
    })
  })
}
