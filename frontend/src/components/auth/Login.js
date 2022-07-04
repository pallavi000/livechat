import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Login() {
    const[email,setEmail] = useState('')
    const[password,setPassword] = useState('')

    const navigate = useNavigate()
    


   async function login(e){
        e.preventDefault()
        try {
            const data={
                email,
                password
            }
            const response = await axios.post('/user/login',data)
            console.log(response.data)
            localStorage.setItem('token',response.data.token)
            localStorage.setItem('user',JSON.stringify(response.data.user))
            navigate('/')
            
        } catch (error) {
            
        }
    }

  return (
    <div className='login-section auth-card'>
        <div className='card login-card '>
            <div className='card-body'>
                <div className='login-header'>Login</div>
                <form onSubmit={(e)=>login(e)}>
                    <div className='form-group d-flex'>
                        <input type="email" class="username" onChange={(e)=>setEmail(e.target.value)} placeholder="Email" required/>
                        <i class="fa-solid fa-envelope loginicon"></i>
                    </div>
                    <div className='form-group d-flex'>
                        <input type="password" class="username" onChange={(e)=>setPassword(e.target.value)} placeholder="Password" required/>
                        <i class="fa-solid fa-eye-slash loginicon"></i>
                    </div>

                    <button className='btn-signin' type="submit">Login</button>
                </form>
            </div>
        </div>
    </div>
  )
}

export default Login