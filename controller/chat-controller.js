const Message = require("../model/chat-model");

// ---------------- Send Message ----------------
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, text } = req.body;
    if (!receiverId || !text) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const message = await Message.create({
      sender: req.user.id,
      receiver: receiverId,
      text,
    });

    res.status(201).json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- Get Messages With a User ----------------
exports.getMessages = async (req, res) => {
  try {
    const { userId } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: userId },
        { sender: userId, receiver: req.user.id },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.deleteMessage = async (req, res) => {
  const msgId = req.params.id;

  try {
    const message = await Message.findById(msgId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Optional: only allow sender to delete their own message
    if (req.user.id.toString() !== message.sender.toString()) {
      return res.status(403).json({ message: "You can delete only your own messages" });
    }

    await message.deleteOne();

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
