const { Router } = require("express");
const router = Router();
const Message = require("../Models/Message");
const auth = require("../Middleware/auth");
const ChatList = require("../Models/ChatList");
const { default: mongoose } = require("mongoose");

// Get all messages
router.get("/:id", auth, async (req, res) => {
  try {
    const messages = await Message.find({ chatlist_id: req.params.id })
      .populate("sender_id")
      .populate("receiver_id");
    const isRead = await Message.updateMany(
      { chatlist_id: mongoose.Types.ObjectId(req.params.id), is_read: false },
      {
        is_read: true,
      },
      {
        multi: true,
      }
    );
    console.log(isRead, "isRead");
    res.send(messages);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Create a new message
router.post("/:id", auth, async (req, res) => {
  try {
    let message = new Message({
      chatlist_id: req.params.id,
      message: req.body.message,
      sender_id: req.user._id,
      receiver_id: req.body.receiver_id,
    });
    var chatlist = await ChatList.findByIdAndUpdate(req.params.id, {
      last_message: message._id,
    });
    await Message.updateMany(
      { chatlist_id: req.params.id, is_read: false },
      {
        is_read: true,
      }
    );

    message = await message.save();

    await message.populate(["sender_id", "receiver_id"]);

    res.send(message);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Get message By ID
router.get("/:id", async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    res.send(message);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Update message By ID
router.put("/:id", async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      {
        key: value,
      },
      { new: true }
    );
    res.send(message);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Delete message By ID
router.delete("/:id", async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    res.send(message);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
