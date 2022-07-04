import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import {format} from 'timeago.js'
import Message from './Message'
import {io} from 'socket.io-client'

function Chatlist() {
    const[chatlists,setChatlists] = useState([])
    const [user,setUser] = useState({})
    const [messages,setMessages] = useState([])
    const[receiver_id,setReceiver_id] = useState('')
    const[chatlist_id,setChatlist_id]= useState('')
    const[receiver,setReceiver] = useState({})

    const socket = io("http://localhost:5000");

  



    
     useEffect(()=>{

        socket.on("connect", () => {
            console.log(socket.id);  
            socket.emit('addUser',JSON.parse(localStorage.getItem('user')))
          });

        socket.on('new_message',(message)=>{
            const newmessages = [...messages]
            newmessages.push(message)
            setMessages(newmessages)
            console.log('newmessage',message)
        })



     },[messages])
      


    const config = {
        headers:{
            authorization: 'Bearer '+localStorage.getItem('token')}
            }



    useEffect(()=>{
        getChat()
        setUser(JSON.parse(localStorage.getItem('user')))
       
    },[])

    async function getMessage(id,receiver_id){
        try {
            var response = await axios.get('/message/'+id,config)
            console.log('message',response.data)
            console.log(id,receiver_id._id)
            setChatlist_id(id)
            setReceiver_id(receiver_id._id)
            setMessages(response.data)
            setReceiver(receiver_id)
           
         
        } catch (error) {
            
        }
    }



   async function getChat(){
        try {
            const response = await axios.get('/chatlist',config)
          setChatlists(response.data)
          
            
        } catch (error) {
            console.log(error.request.response)
        }
    }
  return (

    <>
    <div class="container">
    <div class="row no-gutters">
      <div class="col-md-4 border-right">
      {chatlists.map(list=>{
            return(
                
                list.sender_id._id!=user._id?(
                    <>
        <div class="friend-drawer friend-drawer--onhover"  onClick={()=>getMessage(list._id,list.sender_id)}>
          <img class="profile-image" src="https://randomuser.me/api/portraits/men/20.jpg" alt=""/>
          <div class="text">
            <h6>{list.sender_id.name}</h6>
            <p class="text-muted">{list.last_message}</p>
          </div>
          <span class="time text-muted small">{format(list.updatedAt)}</span>
        </div>
        <hr/>
              
        </>
                ):(
                    <>
        <div class="friend-drawer friend-drawer--onhover"  onClick={()=>getMessage(list._id,list.receiver_id)}>
          <img class="profile-image" src="https://randomuser.me/api/portraits/men/20.jpg" alt=""/>
          <div class="text">
            <h6>{list.receiver_id.name}</h6>
            <p class="text-muted">Hey, you're arrested!</p>
          </div>
          <span class="time text-muted small">{format(list.createdAt)}</span>
        </div>
        <hr/>
              
        </> 
                )
            )
            })}


        </div>
     
        {receiver_id?( 
           <Message messages={messages} receiver={receiver} receiver_id={receiver_id} chatlist_id={chatlist_id} setMessages={setMessages} socket={socket}/>
        ):(null)}
 
        
    </div>
    </div>


</>
  )

  }
export default Chatlist