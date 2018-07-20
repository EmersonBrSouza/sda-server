const mongoose = require('mongoose')

const ActionModel = new mongoose.Schema({
  emitter: String,
  format: Object,
  updatedAt: Number
})

const HistoryModel = new mongoose.Schema({
  documentID: String,
  action: ActionModel
})

HistoryModel.statics.commit = function (documentID, action) {
  let constructAction = new Action(action)
  this.update({documentID}, {$push: { constructAction }})
}

var Action = mongoose.model('Action', ActionModel, 'action')
var History = mongoose.model('History', HistoryModel, 'history')

module.exports = { History }