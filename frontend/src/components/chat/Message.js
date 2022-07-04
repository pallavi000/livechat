import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'

function Message(props) {
    console.log(props)
    const messages = props.messages
    const[user,setUser]  = useState({})
    const[message,setMessage] = useState('')
    const formref = useRef()
    const messagesEndRef = useRef(null)

    const config = {
        headers:{
            authorization: 'Bearer '+localStorage.getItem('token')}
            }


    useEffect(() => {
     setUser(JSON.parse(localStorage.getItem('user')))
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [props.message])


    async function postMessage(e){
        e.preventDefault()
        try {
            const data={
                message,
                sender_id:user._id,
                chatlist_id:props.chatlist_id,
                receiver_id:props.receiver_id
               
            }
            const response = await axios.post('/message/'+props.chatlist_id,data,config)
            console.log(response.data)
            props.socket.emit('message',response.data)
            formref.current.reset()
           const newmessage = [...messages]
           newmessage.push(response.data)
           props.setMessages(newmessage)

            
        } catch (error) {
            
        }
    }
    
    console.log(messages)

  return (
    <>
         <div class="col-md-8">
      <div class="settings-tray">
          <div class="friend-drawer no-gutters friend-drawer--grey">
          <img class="profile-image" src="https://randomuser.me/api/portraits/men/30.jpg" alt=""/>
          <div class="text">
            <h6>{props.receiver.name}</h6>
          </div>
          <span class="settings-tray--right">
            <i class="material-icons">cached</i>
            <i class="material-icons">message</i>
            <i class="material-icons">menu</i>
          </span>
        </div>
      </div>
      <div class="chat-panel">
      {messages.map(message=>{
        return(
            message.sender_id?._id!=user._id?(
        <div class="row no-gutters"  ref={messagesEndRef}>
          <div class="col-md-3">
            <div class="chat-bubble chat-bubble--left">
             {message.message}
            </div>
          </div>
        </div>
        ):(
            <div class="row no-gutters"  ref={messagesEndRef}>
          <div class="col-md-3 offset-md-9">
            <div class="chat-bubble chat-bubble--right">
              {message.message}
            </div>
          </div>
        </div>
        )
        )
      })}
       
        
  
    </div>
    <form ref={formref} onSubmit={(e)=>postMessage(e)}>

    <div class="row">
          <div class="col-12">
            <div class="chat-box-tray">
              <i class="material-icons">sentiment_very_satisfied</i>
              <input type="text" onChange={(e)=>setMessage(e.target.value)} placeholder="Type your message here..."/>
              <i class="material-icons">mic</i>
              <button className='submit-button'> <i class="material-icons">send</i></button>
            </div>
          </div>
        </div>
    </form>
   
</div>
    </>
  )
}

export default Message