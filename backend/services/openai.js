const Record = require("../models/Record");
const OpenAI = require("openai");

const GPT_API = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: GPT_API,
});

async function generateBotReply(messages, userId) {
  try {
    const formattedMessages = messages.map((m) => ({
      role: m.role === "user" ? "user" : "assistant",
      content: m.text,
    }));
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: `
Bạn là một AI quản lý thu chi.
Luôn trả về một đoạn JSON hợp lệ duy nhất. KHÔNG TRẢ BẤT KỲ văn bản nào ngoài JSON.

Nếu người dùng đang nói về giao dịch (thu, chi), thì trả về JSON đầy đủ như sau:

{
  "loai": "thu" | "chi",
  "so_tien": số,
  "mo_ta": "food" | "hang_out" | "shopping" | "fuel" | "salary" | "investing" | "others",
  "reply": "Câu trả lời hài hước hoặc vui vẻ hoặc bố láo kèm số tiền",
  "date": "dd/mm/yy" (nếu có)
}

Nếu không có số tiền, để "so_tien": 0.

Đơn vị: 1k = 1000, 1 xị = 1 trăm = 100000, 1 củ = 1 chẹo = 1 triệu = 1000000
Nếu không có loại phù hợp thì để "mo_ta": "others".

Nếu câu hỏi của người dùng KHÔNG phải giao dịch (ví dụ: hỏi còn bao nhiêu tiền, cảm ơn, chào hỏi, v.v), thì chỉ trả về JSON đơn giản như sau:

{
  "loai": "khac",
  "reply": "Câu trả lời phù hợp, hài hước hoặc dễ thương hoặc bố láo nếu nó láo."
}
`,
        },
        ...formattedMessages,
      ],
      temperature: 0.2,
    });
    const content = completion.choices[0].message.content;
    try {
      const data = JSON.parse(content);
      const record = new Record({
        loai: data.loai,
        so_tien: data.so_tien,
        mo_ta: data.mo_ta,
        owner: userId,
      });
      if (data.loai != "khac") {
        await record.save();
      }

      if (data.date) {
        console.log(data.date);
      }

      return data.reply;
    } catch (error) {
      return "Lỗi rồi ní: " + error;
    }
  } catch (error) {
    console.error(error);
    return "Chat error";
  }
}

module.exports = { generateBotReply };