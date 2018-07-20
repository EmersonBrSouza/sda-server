const mongoose = require('mongoose')
const {ObjectId} = mongoose.Types
const RoomModel = mongoose.Schema({
  documentID: String,
  allowedMembers: Array,
  onlineMembers: Array
})


RoomModel.statics.dropOnlineMembers = function () {
  console.log('Kicking online users...')
  this.update({}, {$set: {onlineMembers: []}}, {multi: true}, function (err, callback) {})
}

var Room = mongoose.model('Room', RoomModel, 'rooms')

module.exports = { Room }