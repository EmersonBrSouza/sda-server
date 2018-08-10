class DocumentRoom {
  constructor (roomID, allowedMembers) {
    this.roomID = roomID;
    this.allowedMembers = allowedMembers;
    this.members = {}
    this.stack = []
  }

  join (userID, socket) {
    if (!this.allowedMembers.includes(userID)) return false
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

    let history = []
    this.stack.push(data)
    
    this.stack.forEach(item => {
      item.ops.forEach(action => {
        if (action.hasOwnProperty('retain') && action.retain > 1) action.retain = action.retain - 1
        history.push(action)
      })
    })

    console.log(Object.keys(this.members))
    Object.keys(this.members).forEach(id => {
      if (id !== emitterID) {
        let socket = this.members[id]
        socket.emit('execute', history)
      }
    })
  }
}

module.exports = DocumentRoom