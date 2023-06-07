const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  user_id: String,
  title: String,
  content: String,
});

const Chat = mongoose.model("chat", chatSchema);
module.exports = Chat;
