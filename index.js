let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let express = require('express');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let mongoose = require('mongoose');

app.use(express.static('public'));

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost/code-touch-chat', function (error) {
  if (error) {
    console.log('MONGODB ERROR');
    console.log(error);
  }
});

// for simplicity, I'll just declare everything here instead of modularizing it

// Mongoose models
const Message = require('./models/Message');
const User = require('./models/User');

// API
app.get('/', function(req, res){
    res.render('index');
});

app.get('/api/get/messages/:username', function(req, res){
    // get all user messages
    Message.find({ $or: [{to: ''}, {to: req.params.username}, {from: req.params.username}] }, function(err, docs){
        if(err){
            res.status(400);
        }
        // console.log("All Messages is",docs);
        res.send([...docs]);
    })
});

app.post('/api/post/messages', function(req, res){
    let message = req.body;
    console.log("MESSAGE", message);
    Message.create({
        content: message.message,
        from: message.from,
        to: message.to
    }, function(err, doc){
        if(err) return console.log('ERROR', err);
        return console.log("DONE", doc);
    });
    res.status(200);
})

app.get('/api/get/messages/:to/:from', function(req, res){
    Message.find({to: req.params.to, from: req.params.from}, function(err, docs){
        if(err){
            res.status(400);
        }
        console.log("Docs for user is",docs);
        res.send([...docs]);
    })
})

app.get('/api/get/users', function(req, res){
    User.find({}, function(err, docs){
        if(err){
            res.status(400);
        }
        // console.log("User DOCS is",docs);
        res.send([...docs]);
    })
});

// Socket Handling
let socketStore = [];
let initialFind = false;
io.on('connection', function(socket){

    // first connection and socket store is empty although database is not
    if(!initialFind){
        User.find({}, function(err, docs){
            if(err){
                res.status(400);
            }
            // console.log("User DOCS is",docs);
            for (var i = 0; i < docs.length; i++) {
                // console.log(docs[i]);
                socketStore.push({username: docs[i].name, status: 'offline'});
            }
        })
        initialFind = true;
    }
    // console.log('initial find and others', initialFind, socketStore);

    console.log('a user connected');
    io.emit('user connection', 'user connected');
    // console.log(Object.keys(io.sockets.sockets));
    // console.log('store ------------', socketStore);
    io.emit('store', socketStore);
    // io.sockets.sockets[socket.id].emit('users', Object.keys(io.sockets.sockets));
    // io.emit('users', Object.keys(io.sockets.sockets))
    socket.on('connection', function(){
        io.emit('store', socketStore)
        socket.emit('users', Object.keys(io.socket.sockets));
    })
    socket.on('disconnect', function(){
        console.log('a user disconnected', socket.id, socketStore);
        // io.emit('user connection', 'user disconnected');
        // io.emit('users', Object.keys(io.sockets.sockets));
        let found = false;
        for (let i = 0; i < socketStore.length; i++) {
            if(socketStore[i].id === socket.id){
                found = true;
                socketStore[i].status = 'offline';
                User.findOne({name: socketStore[i].username}, function(err, doc){
                    doc.online = false;
                    doc.save()
                })
                User.update({name: socketStore[i].username}, {$set: {online: false}}, function(err, updatedDoc){
                    if (err) return console.log(err);
                });
            }
        }
        console.log('disconnecting store', found, socketStore);
        io.emit('store', socketStore);
    });
    socket.on('chat message', function(msg){

        // I could have used socket to put the message in the database but instead used API approach
        msg['content'] = msg.message;
        io.emit('chat message', msg);
    });
    socket.on('typing', function(content){
        socket.broadcast.emit('typing', content);
        console.log('typing',content);
    });
    socket.on('username', function(content){
        let username = content.username;
        console.log('SENT USERNAME', content.username)
        // let username = req.params.username;
        // socketStore.push({id: socket.id, status: "online"})
        let found = false;
        for (var i = 0; i < socketStore.length; i++) {
            if (socketStore[i].username === username) {
                socketStore[i].status = 'online';
                socketStore[i].id = socket.id;
                found = true;
                console.log("entry found", socketStore);
                break;
            }
        }
        if(!found){
            console.log('entry NOT found')
            socketStore.push({id: socket.id, status: "online", username: username});
        }

        console.log('emitting', socketStore);
        io.emit('store', socketStore);

        console.log("sent username");

        User.find({name: username}, function(err, docs){
            if(err){
                console.log(err);
                // not found
                res.status(404);
            }
            if(docs.length < 1){
                console.log(docs.length);
                User.create({
                    name: username
                }, function(err, result){
                    if(err){
                        console.log(err);
                    }
                })
            }
        });
    })
})

function setUserStatus(status, username){
    User.findOne({name: username}, function(err, doc){
        doc.online = status;
        doc.save(function(err, updatedDoc){
            if(err) console.log(err);
            console.log("Updated doc", updatedDoc);
        })
    })
}

http.listen(3000, ()=>{
    console.log('listening on', 3000);
})
