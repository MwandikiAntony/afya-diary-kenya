import { useState } from "react";
import SharedLayout from "../../components/SharedLayout";

export default function AIChat() {
  const [messages, setMessages] = useState([
    { from: "ai", text: "Hello! I'm Afya Assistant. How are you feeling today?" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { from: "user", text: input }]);
    setInput("");
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { from: "ai", text: "Thank you for sharing. Remember, it's okay to take a break and breathe deeply. 💙" },
      ]);
    }, 1000);
  };

  return (
    <SharedLayout>
      <div className="flex flex-col min-h-[70vh]">
        <div className="flex-1 overflow-y-auto">
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

        <div className="flex gap-3 mt-4">
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
    </SharedLayout>
  );
}
