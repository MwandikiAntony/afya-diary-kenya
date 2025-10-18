import { useState } from "react";
import axios from "axios";
import SharedLayout from "../../components/SharedLayout";

export default function AIChat() {
  const [messages, setMessages] = useState([
    { from: "ai", text: "Hello! I'm Afya Assistant. How are you feeling today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage = { from: "user", text: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/ai/chat", {
  messages: [...messages, newMessage],
});


      setMessages((prev) => [...prev, { from: "ai", text: res.data.text }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { from: "ai", text: "Sorry, something went wrong. 😢" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SharedLayout>
      <div className="flex flex-col min-h-[70vh] p-6">
        <div className="flex-1 overflow-y-auto flex flex-col gap-2">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`max-w-xs p-3 rounded-lg ${
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
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={loading}
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </SharedLayout>
  );
}
