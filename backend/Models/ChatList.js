const mongoose = require("mongoose");

const ChatListSchema = new mongoose.Schema(
  {
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
    last_message: { type: String },
  },
  {
    timestamps: true,
  }
);

const autoUserPopulate = function (next) {
  this.populate("sender_id");
  this.populate("receiver_id");
  next();
};

ChatListSchema.pre("find", autoUserPopulate);
ChatListSchema.pre("findOne", autoUserPopulate);
ChatListSchema.pre("create", autoUserPopulate);

const ChatList = mongoose.model("chatlist", ChatListSchema);

module.exports = ChatList;
