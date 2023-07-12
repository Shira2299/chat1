import express from "express";
import authenticate from"../middleware/authenticate.js";
import Chat from"../model/chat.js";
import Message from"../model/messages.js";
import user from "../model/user.js";
const router = express.Router();

//Get Fetch all message
router.get("/:chatId", authenticate, async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat")
      .lean()
      .exec();
    return res.status(200).send(messages);
  } catch (error) {
    return res.status(400).send(error.messages);
  }
});

//Post create new message
router.post("/", authenticate, async (req, res) => {
  const { content, chatId } = req.body;
  if (!content || !chatId) {
    return res.status(400).send("Invalid data passed into request");
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };
  try {
    var message = await Message.create(newMessage);
    message = Message.findOne({ _id: message._id })
      .populate("sender", "name pic")
      .populate("chat")
      .lean()
      .exec();
    message = await user.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    let data = await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message._id,
    });

    return res.status(200).send(message);
  } catch (error) {
    res.status(400).send(error.message);
  }
});
export default router;
