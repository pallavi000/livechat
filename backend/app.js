const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')
const app = express()
const user = require('./Routes/user')
const chatlist = require('./Routes/chatlist')
const message = require('./Routes/message')
require('dotenv').config()

const server = require('http').createServer(app);
const io = require('socket.io')(server,{
    cors:{
        origin:["http://localhost:3000"]
    }
});

let users = []

function findUserById(id){
  return users.find(r=>r.user_id==id)
}

function addUser(user_id,socket_id){
    users.push(
        {
            "user_id":user_id,
            "socket_id":socket_id
        }
    )
}

function removeUserById(id){
    users = users.filter(user=>user.user_id!=id)
}

function removeUserBySocketId(id){
    users = users.filter(user=>user.socket_id!=id)

}





io.on('connection', socket => {

    socket.on('addUser',(user)=>{
       var oldUser =  findUserById(user._id)
        if(!oldUser){
          addUser(user._id,socket.id)
        }else{
            removeUserById(user._id)
            addUser(user._id,socket.id) 
        }
    })
  
    socket.on('message',(message)=>{
       
        //pathau
        var user = findUserById(message.receiver_id._id)
        if(user){
            io.to(user.socket_id).emit('new_message',message)
        }

    })


    socket.on('disconnect', () => { 
       removeUserBySocketId(socket.id)
     });
});

try {
   
 mongoose.connect(process.env.DB_URL,{useNewUrlParser: true, useUnifiedTopology: true,})
 
} catch (error) {
    console.log(err.message);
}

app.use(cors())
app.use(express.json({limit:'50mb'}))
app.use('/api/user',user)
app.use('/api/chatlist',chatlist)
app.use('/api/message',message)

const PORT= process.env.PORT || 5000
server.listen(PORT)