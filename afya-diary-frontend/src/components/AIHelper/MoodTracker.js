import { useState, useEffect } from "react";
import { logMood, getMoodHistory } from "../../utils/aiHelperAPI";

export default function MoodTracker({ userId }) {
  const [mood, setMood] = useState("");
  const [notes, setNotes] = useState("");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!userId) return;
    fetchHistory();
  }, [userId]);

  const fetchHistory = async () => {
    try {
      const res = await getMoodHistory(userId);
      setHistory(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogMood = async () => {
    if (!mood) return;
    try {
      await logMood({ userId, mood, notes });
      setMood("");
      setNotes("");
      fetchHistory();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">Mood Tracker</h1>

      <div className="flex gap-3 mb-4">
        <select
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          className="border p-2 rounded-lg"
        >
          <option value="">Select Mood</option>
          <option value="Happy">Happy</option>
          <option value="Sad">Sad</option>
          <option value="Anxious">Anxious</option>
          <option value="Stressed">Stressed</option>
        </select>

        <input
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes (optional)"
          className="border p-2 rounded-lg flex-1"
        />

        <button
          onClick={handleLogMood}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Log
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-2">History</h2>
      <ul className="space-y-2">
        {history.map((h, i) => (
          <li key={i} className="p-3 bg-white rounded-lg shadow-sm border">
            <strong>{h.mood}</strong> - {h.notes || "No notes"} <br />
            <small>{new Date(h.createdAt).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
