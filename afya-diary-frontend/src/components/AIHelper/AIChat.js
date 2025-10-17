import { useState } from "react";

export default function AIChat() {
  const [messages, setMessages] = useState([
    { from: "ai", text: "Hello! I'm Afya Assistant. How are you feeling today?" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { from: "user", text: input }]);
    setInput("");

    // Simulated AI reply (replace with backend/API later)
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { from: "ai", text: "Thank you for sharing. Remember, it's okay to take a break and breathe deeply. 💙" },
      ]);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex-1 p-6 overflow-y-auto">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`my-2 p-3 rounded-lg max-w-xs ${
              msg.from === "ai"
                ? "bg-blue-100 text-blue-800 self-start"
                : "bg-green-100 text-green-800 self-end ml-auto"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="p-4 border-t flex gap-3 bg-white">
        <input
          className="flex-1 border rounded-lg px-3 py-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}
