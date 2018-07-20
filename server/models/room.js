const mongoose = require('mongoose')

const RoomModel = mongoose.Schema({
  documentID: String,
  allowedMembers: Array,
  onlineMembers: Array
})

var Room = mongoose.model('Room', RoomModel, 'rooms')

module.exports = { Room }