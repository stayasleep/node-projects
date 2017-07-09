const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 1337;
const server = app.listen(PORT);
const io = require("socket.io")(server);

//globals for now...could be database later on
let users =[];
let connections =[];

//create routing for home page
app.use(express.static(path.join(__dirname,'client')));

io.on('connection',function(socket){
    //this will get unique ids for every connection, not the sender. Just the node connected to server.
    console.log(' user connected', socket.id);

    //lets add the amount of peeps in the chat room
    connections.push(socket);
    console.log('before push',socket);
    console.log('there are %s users connected', connections.length);

    //when a message comes in, send the same thing in from client to server, back
    //from server to client. if we want message to only be seen on the
    //other screen, io.broadcast.emit('chat message', msg), wont appear on your
    //screen
 
    socket.on('chat message', function(data){
        //msg all other users
        io.emit('chat message',{msg:data, user: socket.username});
    });

    //new user
    socket.on('new user', function(data, callback){
        callback(true);
        // console.log('callback',callback);
        console.log('data',data);
        socket.username = data;
        if(users.indexOf(socket.username)===-1){
             users.push(socket.username);
            io.emit("is online", users);
        }else{
            let msg = socket.id;
            // let msg = "name is taken";
            io.emit("name taken", msg);
        }
        console.log(socket.username);
        console.log('user connected atm %s', users.length);
    });

    //user is typing
    socket.on('typing', function(data){
        io.emit('typing', '')
    })


    socket.on('disconnect',function(){
        console.log('user disconnected',socket.id);
        //when logged off, remove user from the array, but first let socket locate itself
        let socketDC = connections.indexOf(socket);
        connections.splice(connections.indexOf(socket),1);
        users.splice(socketDC,1);
        console.log('array position at ',socketDC);
        io.emit("disconnect",socketDC);
        console.log('Disconnected: %s users remaining on',connections.length)

    });
});

var typing = false;



