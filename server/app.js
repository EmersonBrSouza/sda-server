require('dotenv').config()

const app = require('express')()
const cors = require('cors')()
const server = require('http').createServer(app)
const io = require('socket.io')(server)


// DB imports
const { mongoose } = require('./db/config')
const { Document, Room, filterAllowedMembers } = require('./models')
const { DocumentRoom } = require('./network')
const { db, auth, firestore } = require('./firebase')

// App configurations
const port = process.env.PORT || process.env.SERVER_PORT
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(cors)

var stack = []
var rooms = {}

// API routes
app.post('/join', function (req, res) {
  let { documentID, userID } = req.body

  db.collection('projects')
    .doc(documentID)
    .get()
    .then(function (doc) {
      if (!doc.exists) return res.status(404).json({"error": 'document/not-found'})
      
      let allowedMembers = filterAllowedMembers(doc.data().members)
      
      if (!allowedMembers.includes(userID)) { // If user can't access the document, return "Unauthorized"
        return res.status(401).json({"error": 'document/permission-denied'})
      } else {
        Room.findOneAndUpdate({ documentID },{$set: allowedMembers, $addToSet: {onlineMembers: userID}}, function (err, document) {
          if (err) return res.json({ "error": err })
          
          if (document) {
            printSuccess()
          } else {
            let room = new Room({ documentID: doc.id, allowedMembers, onlineMembers: [userID] })
            room.save().then(() => { printSuccess() })
          }    
        })

        function printSuccess () {
          createNewRoom(doc.id, allowedMembers)
          console.log(`${userID} has joined to server in room ${documentID}`)
          return res.status(200).json({"success": 'You are joined to document'})
        }
      }
    }) 
})

function createNewRoom (docID, allowedMembers) {
  rooms[docID] = new DocumentRoom(docID, allowedMembers)
}

io.on('connection', function (socket) {
  socket.on('pingServer', function (data) {
    console.log(data)
  });

  socket.on('join', function (data) {
    rooms[data.documentID].join(data.userID, socket)
  });

  socket.on('commit', function (data) {
    // stack.push(data.execute.ops);
    rooms[data.documentID].sendToOthers(data.content, data.userID)
  });

  socket.on('pull', function (data) {
    // socket.emit('execute', { stack })
  });
});


server.listen(port, () => {
  restartServer()
  console.log(`Server is running in port ${ port }`)
  console.log(`DB status ${mongoose.connection.readyState}`)
})

function restartServer () {
  console.log('Restarting server...')
  Room.dropOnlineMembers()
}