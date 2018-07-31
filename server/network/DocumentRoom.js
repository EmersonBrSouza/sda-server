class DocumentRoom {
  constructor (roomID, allowedMembers) {
    this.roomID = roomID;
    this.allowedMembers = allowedMembers;
    this.members = {}
  }

  join (userID, socket) {
    if (!this.allowedMembers.includes(this.allowedMembers)) return false

    this.members[userID] = socket;
    return true
  }

  exit (userID) {
    delete this.members[userID];
  }

  sendToAll (data) {
    Object.keys(this.members).forEach(id => {
      let socket = this.members[id]
      socket.emit('pull', data)
    })
  }

  sendToOthers (data, emitterID) {
    Object.keys(this.members).forEach(id => {
      if (id !== emitterID) {
        let socket = this.members[id]
        socket.emit('pull', data)
      }
    })
  }
}

module.exports = DocumentRoom