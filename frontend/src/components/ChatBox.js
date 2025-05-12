import React, { useState, useEffect } from "react";
import logo from "../images/logo.jpg";
import "../style/ChatBox.css"; 

const initialMessages = [
  {
    from: "bot",
    text: "2.000.000 VNĐ cho mua sắm online vào ngày 5/3. Đây có phải là một khoản cần thiết không? 🤔",
  },
  {
    from: "user",
    text: "À... chắc là do mình ham săn sale quá. 😅",
  },
  {
    from: "bot",
    text: "Không sao cả! Mình có thể nhắc bạn kiểm tra lại giỏ hàng trước khi thanh toán vào lần sau, bạn có muốn không? 😉",
  },
  {
    from: "user",
    text: "Ừm, làm vậy đi! Nhớ nhắc mình trước ngày 15 hàng tháng nhé.",
  },
  {
    from: "bot",
    text: "Đã lên lịch nhắc nhở! 🗓️ Mình sẽ gửi thông báo vào ngày 14 để bạn xem lại ngân sách trước khi mua sắm. Hãy cứ để mình giúp bạn quản lý tài chính thật thông minh nhé! 🚀💰",
  },
];

export default function Chatbox({ userName }) {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const [showGreeting, setShowGreeting] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowGreeting(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { from: "user", text: input }]);
    setInput("");
    // Ở đây bạn có thể thêm logic trả lời tự động của bot nếu muốn
  };

  return (
    <div>
      {!open && showGreeting && (
        <div className="chatbox-greeting">
          Xin chào &nbsp;<b>{userName}</b>!
        </div>
      )}
      <div className="chatbox-toggle" onClick={() => setOpen(!open)}>
        <img src={logo} alt="Chatbot" />
      </div>
      {open && (
        <div className="chatbox-container">
          <div className="chatbox-header">Chatbot tài chính</div>
          <div className="chatbox-messages">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`chatbox-message ${msg.from === "user" ? "user" : "bot"}`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <form className="chatbox-input" onSubmit={handleSend}>
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit">Gửi</button>
          </form>
        </div>
      )}
    </div>
  );
}
