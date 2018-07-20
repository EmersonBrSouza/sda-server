const mongoose = require('mongoose')

const DocumentModel = mongoose.Schema({
  creatorID: String,
  createdAt: Number,
  lastUpdate: Number,
  formats: Object
})

var Document = mongoose.model('Document', DocumentModel, 'documents')

module.exports = { Document }