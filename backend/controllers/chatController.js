const Chat = require('../models/chat');
const aiService = require('../services/aiService');
const mongoose = require('mongoose');

exports.chat = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user.id;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập tin nhắn'
      });
    }

    // Lấy 5 tin nhắn gần nhất để có context
    const previousChats = await Chat.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5);

    const previousMessages = previousChats.reverse().map(chat => ({
      role: chat.role,
      content: chat.message
    }));

    // Chat với AI
    const aiResponse = await aiService.analyzeMessage(message, previousMessages);
    console.log(aiResponse);

    // Kiểm tra xem có thông tin tài chính không
    const financialInfo = aiResponse.match(/INFO:(-?\d+)\|(income|expense)/);
    console.log(financialInfo);
    let amount = 0;
    let type = 'chat';
    let finalResponse = aiResponse;

    if (financialInfo) {
      // Trích xuất thông tin tài chính
      amount = parseInt(financialInfo[1]);
      type = financialInfo[2];
      // Loại bỏ phần INFO khỏi response
      finalResponse = aiResponse.replace(/INFO:(-?\d+)\|(income|expense)/, '').trim();
    }

    // Lưu chat vào database
    const chat = await Chat.create({
      userId,
      message,
      response: finalResponse,
      amount,
      type,
      role: 'user'
    });

    // Nếu có thông tin tài chính, tính số dư
    let balance = 0;
    if (type !== 'chat') {
      const result = await Chat.aggregate([
        {
          $match: {
            userId: mongoose.Types.ObjectId(userId),
            type: { $in: ['income', 'expense'] }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' }
          }
        }
      ]);

      balance = result[0]?.total || 0;
    }

    return res.json({
      success: true,
      data: {
        message: chat.message,
        response: finalResponse,
        financialInfo: type !== 'chat' ? {
          amount,
          type,
          balance
        } : null
      }
    });

  } catch (error) {
    console.error('Chat error:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi xử lý tin nhắn'
    });
  }
};