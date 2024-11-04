import { StatusCodes } from "http-status-codes";

import Chat from "../models/chat-model.js";
import Message from "../models/message-model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

// send messages
export const sendMessage = async (req, res) => {
  const senderId = req.userId;
  const receiverId = req.params.receiverId;
  const { textMessage: message } = req.body;

  let chat = await Chat.findOne({
    participants: { $all: [senderId, receiverId] },
  });
  // establish the conversation if not started yet.
  if (!chat) {
    chat = await Chat.create({
      participants: [senderId, receiverId],
    });
  }
  const newMessage = await Message.create({
    senderId,
    receiverId,
    message,
  });
  if (newMessage) chat.messages.push(newMessage._id);

  await Promise.all([chat.save(), newMessage.save()]);

  //  implement socket io for real time comunication.
  const receiverSocketId = getReceiverSocketId(receiverId);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("newMessage", newMessage);
  }

  res.status(StatusCodes.OK).json({
    success: true,
    newMessage,
  });
};

// Get My messsages with a speciffic user.
export const getMyMessages = async (req, res) => {
  const senderId = req.userId;
  const receiverId = req.params.receiverId;
  const chat = await Chat.findOne({
    participants: { $all: [senderId, receiverId] },
  }).populate("messages");
  if (!chat)
    return res.status(StatusCodes.OK).json({ success: true, messages: [] });

  return res
    .status(StatusCodes.OK)
    .json({ success: true, messages: chat?.messages });
};
