const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    chatlist_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "chatlist",
    },
    sender_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    receiver_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    is_read: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

const Message = mongoose.model("message", MessageSchema);

module.exports = Message;
