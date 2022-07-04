const express = require('express')
const { Router } = require('express');
const router = Router(); 
const User = require('../Models/User') 
const auth = require('../Middleware/auth')
const jwt = require('jsonwebtoken')
// Get all users
router.get('/', async(req, res) => {
    try {
        const users = await User.find()
        res.send(users)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

// Create a new user
router.post('/register', async(req, res) => {
  
    try {
        let user = new User({
            name:req.body.name,
            email:req.body.email,
            password:req.body.password
        })
        user = await user.save()
        res.send(user)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

router.post('/login', async(req, res) => {
    try {
        let user = new User({
            email:req.body.email,
            password:req.body.password
        })
        
        user = await User.findOne({'email':req.body.email})
        
        if(user){

            const valid = user.password==req.body.password
            if(valid){
                const token= await jwt.sign({_id:user._id,email:user.email},'chatapp');
                res.send({token:token,user:user})
            }else{
                res.status(400).send('invalid username and password')
            }
                   
        }else{
            res.status(401).send('user not found')
        }
    } catch (error) {
        res.status(500).send(error.message)
    }
})


// get current user

router.get('/current',auth,async(req,res)=>{
    try {
        const user =await  User.findById(req.user._id)
        res.send(user)
    } catch (error) {
        res.status(500).send(error.message)
    }
})


// Get user By ID
router.get('/:id', async(req, res) => {
    try {
        const user = await User.findById(req.params.id)
        res.send(user)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

// Update user By ID
router.put('/:id', async(req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, {
            key:value
        },{new: true})
        res.send(user)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

// Delete user By ID
router.delete('/:id', async(req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        res.send(user)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

module.exports = router