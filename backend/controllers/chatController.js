const ai = require("../services/openai");

module.exports.postChat = async (req, res) => {
  const messages = [];
  const userMessage = req.body.message;
  messages.push({ role: "user", text: userMessage });

  // Lấy userId từ req.user (nếu đã xác thực)
  const userId = req.user?._id || req.user?.id || req.user?.userId;

  try {
    const botReply = await ai.generateBotReply(
      messages.slice(-6),
      userId 
    );
    messages.push({ role: "assistant", text: botReply });
    res.json({ reply: botReply });
  } catch (error) {
    console.error(error); // Xem log lỗi ở terminal
    messages.push({ role: "assistant", text: "Server error!!" });
    res.status(500).json({ reply: "Server error!!" });
  }
}; 