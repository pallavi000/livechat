const { Router } = require('express');
const router = Router(); 
const Chatlist = require('../Models/ChatList') 
const auth = require('../Middleware/auth')
const mongoose = require('mongoose')

// Get all chatlists
router.get('/', auth,async(req, res) => {
    try {
        console.log(req.user._id)
        const chatlists = await Chatlist.find().or([{'sender_id':req.user._id},{'receiver_id':mongoose.Types.ObjectId(req.user._id)}]).populate('sender_id').populate('receiver_id')
        res.send(chatlists)
    } catch (error) {
        res.status(500).send(error.message)
    }
})



// Create a new chatlist
router.post('/chat/:id', auth,async(req, res) => {
    try {
        console.log(req.user)
        let chatlist = new Chatlist({
            receiver_id:req.params.id,
            sender_id:req.user._id
        })
        chatlist = await chatlist.save()
        res.send(chatlist)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

// Get chatlist By ID
router.get('/:id', async(req, res) => {
    try {
        const chatlist = await Chatlist.findById(req.params.id)
        res.send(chatlist)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

// Update chatlist By ID
router.put('/:id', async(req, res) => {
    try {
        const chatlist = await Chatlist.findByIdAndUpdate(req.params.id, {
            key:value
        },{new: true})
        res.send(chatlist)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

// Delete chatlist By ID
router.delete('/:id', async(req, res) => {
    try {
        const chatlist = await Chatlist.findByIdAndDelete(req.params.id)
        res.send(chatlist)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

module.exports = router