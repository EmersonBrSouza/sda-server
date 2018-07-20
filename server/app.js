require('dotenv').config()
const bodyParser = require('body-parser')
const express = require('express')
const io = require('socket.io')
const { db, auth, firestore } = require('./firebase')
// DB imports
const { mongoose } = require('./db/config')
const { Document, Room, filterAllowedMembers } = require('./models')

// App configurations
const port = process.env.PORT || process.env.SERVER_PORT
const app = express()

app.use(bodyParser.json())

app.get('/hello', function (req, res) {
  res.json('Oi')
  // a document instance
  var book1 = new Document({ creatorID: 'xtcaDddada', createdAt:11505011015, lastUpdate: 154040455 });

  // save model to database
  book1.save(function (err, book) {
    if (err) return console.error(err);
    console.log(book.creatorID + " saved to bookstore collection.");
  });
})


app.post('/join', function (req, res) {
  let { documentID, userID } = req.body

  Room.findOneAndUpdate({ documentID },{$push: {onlineMembers: userID}}, function (err, document) {
    if (err) return res.json({ "error": err })
    
    if (document) {
      console.log(`${userID} has joined to server in room ${documentID}`)
      return res.status(200).json({"success": 'The document has been created!'})
    } else {
      
      db.collection('projects')
        .doc(documentID)
        .get()
        .then(function (doc) {
          if (!doc.exists) return res.status(404).json({"error": 'document/not-found'})
          
          let allowedMembers = filterAllowedMembers(doc.data().members)
          let onlineMembers = (allowedMembers[userID]) ? [userID] : []
          
          if(!allowedMembers[userID]) return res.status(401).json({"error": 'document/permission-denied'})

          let room = new Room({ documentID: doc.id, allowedMembers: Object.keys(allowedMembers), onlineMembers })
          
          room.save().then(function (){
            console.log(`${userID} has joined to server in room ${documentID}`)
            return res.status(200).json({"success": 'The document has been created!'})
          })
        })
    }    
  })
})

app.listen(port, () => {
  console.log(`Server is running in port ${ port }`)
  console.log(`DB status ${mongoose.connection.readyState}`)
})