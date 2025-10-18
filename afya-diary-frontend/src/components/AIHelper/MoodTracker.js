import { useState, useEffect, useRef } from "react";
import SharedLayout from "../../components/SharedLayout";

export default function MoodTracker({ userId, initialMoods = [] }) {
  const [moods, setMoods] = useState(initialMoods);
  const [currentMood, setCurrentMood] = useState("");
  const [loading, setLoading] = useState(false);
  const moodEndRef = useRef(null);

  // Scroll to bottom when moods update
  useEffect(() => {
    moodEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [moods]);

  const handleAddMood = async () => {
    if (!currentMood.trim()) return;

    const newMood = { mood: currentMood, date: new Date().toISOString() };
    setMoods(prev => [...prev, newMood]);
    setCurrentMood("");

    // Optional: Send to backend
    setLoading(true);
    try {
      // Replace with API call
      await new Promise((res) => setTimeout(res, 500));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SharedLayout>
      <div className="flex flex-col min-h-[70vh] bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Mood Tracker</h2>

        <div className="flex-1 overflow-y-auto space-y-2">
          {moods.length > 0 ? (
            moods.map((m, i) => (
              <div key={i} className="p-3 rounded-lg bg-yellow-100 text-yellow-900">
                {m.mood} <span className="text-xs text-gray-500">({new Date(m.date).toLocaleString()})</span>
              </div>
            ))
          ) : (
            <p>No mood entries yet.</p>
          )}
          <div ref={moodEndRef} />
        </div>

        <div className="flex gap-3 mt-4">
          <input
            className="flex-1 border rounded-lg px-3 py-2"
            value={currentMood}
            onChange={(e) => setCurrentMood(e.target.value)}
            placeholder="Enter your mood..."
            onKeyDown={(e) => e.key === "Enter" && handleAddMood()}
            disabled={loading}
          />
          <button
            onClick={handleAddMood}
            className={`px-4 py-2 rounded-lg text-white ${loading ? "bg-gray-400" : "bg-yellow-600 hover:bg-yellow-700"}`}
            disabled={loading}
          >
            {loading ? "Saving..." : "Add"}
          </button>
        </div>
      </div>
    </SharedLayout>
  );
}
